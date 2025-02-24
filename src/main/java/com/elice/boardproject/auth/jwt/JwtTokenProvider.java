package com.elice.boardproject.auth.jwt;

import com.elice.boardproject.user.entity.Role;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;

@Slf4j
@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long accessTokenValidityInMilliseconds;
    private final long refreshTokenValidityInMilliseconds;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.access-token-validity-in-seconds}") long accessTokenValidityInSeconds,
            @Value("${jwt.refresh-token-validity-in-seconds}") long refreshTokenValidityInSeconds) {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenValidityInMilliseconds = accessTokenValidityInSeconds * 1000;
        this.refreshTokenValidityInMilliseconds = refreshTokenValidityInSeconds * 1000;
    }

    public String createToken(String email, Role role) {
        Claims claims = Jwts.claims().setSubject(email);
        claims.put("role", role.name());

        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createAccessToken(Authentication authentication) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + accessTokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(authentication.getName())
                .claim("auth", authentication.getAuthorities().iterator().next().getAuthority())
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public String createRefreshToken(Authentication authentication) {
        Date now = new Date();
        Date validity = new Date(now.getTime() + refreshTokenValidityInMilliseconds);

        return Jwts.builder()
                .setSubject(authentication != null ? authentication.getName() : null)
                .setIssuedAt(now)
                .setExpiration(validity)
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public Authentication getAuthentication(String token) {
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            String subject = claims.getSubject();
            if (subject == null || subject.isEmpty()) {
                log.error("토큰에서 사용자 정보를 찾을 수 없습니다.");
                return null;
            }

            String role = claims.get("role", String.class);
            if (role == null) {
                role = claims.get("auth", String.class);
            }
            if (role == null) {
                role = "USER"; // 기본 역할 설정
            }

            SimpleGrantedAuthority authority = new SimpleGrantedAuthority(
                role.startsWith("ROLE_") ? role : "ROLE_" + role
            );

            if (log.isTraceEnabled()) {
                log.trace("토큰 인증 정보 - 사용자: {}, 권한: {}", subject, authority.getAuthority());
            }
            return new UsernamePasswordAuthenticationToken(subject, "", Collections.singleton(authority));
        } catch (JwtException | IllegalArgumentException e) {
            log.error("토큰 파싱 중 오류 발생: {}", e.getMessage());
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            if (token == null || token.isEmpty()) {
                return false;
            }

            Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token);
            
            if (log.isTraceEnabled()) {
                log.trace("토큰 검증 성공");
            }
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            log.error("잘못된 JWT 토큰: {}", e.getMessage());
            return false;
        }
    }
} 