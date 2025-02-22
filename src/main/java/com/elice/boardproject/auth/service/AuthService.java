package com.elice.boardproject.auth.service;

import com.elice.boardproject.auth.dto.LoginRequest;
import com.elice.boardproject.auth.dto.RegisterRequest;
import com.elice.boardproject.common.exception.CustomException;
import com.elice.boardproject.common.exception.ErrorCode;
import com.elice.boardproject.user.entity.ProviderType;
import com.elice.boardproject.user.entity.Role;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;

    @Transactional
    public Map<String, String> register(RegisterRequest request) {
        // 이메일 중복 체크
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL);
        }

        // 닉네임 중복 체크
        if (userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(ErrorCode.DUPLICATE_NICKNAME);
        }

        // 회원 생성
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .role(Role.USER)
                .providerType(ProviderType.LOCAL)
                .build();

        userRepository.save(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "회원가입이 완료되었습니다.");
        return response;
    }

    @Transactional
    public Map<String, Object> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        // 토큰 생성
        Map<String, String> tokens = tokenService.createTokens(user);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "로그인이 완료되었습니다.");
        response.put("token", tokens.get("accessToken"));
        response.put("refreshToken", tokens.get("refreshToken"));
        response.put("nickname", user.getNickname());
        return response;
    }

    @Transactional
    public void logout(String email) {
        tokenService.invalidateRefreshToken(email);
    }

    @Transactional
    public String refreshToken(String refreshToken) {
        return tokenService.refreshAccessToken(refreshToken);
    }

    @Transactional(readOnly = true)
    public boolean isValidToken(String token) {
        return tokenService.validateToken(token);
    }
} 