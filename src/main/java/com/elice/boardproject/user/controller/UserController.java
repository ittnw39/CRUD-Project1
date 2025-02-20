package com.elice.boardproject.user.controller;

import com.elice.boardproject.user.dto.LoginRequestDto;
import com.elice.boardproject.user.dto.SignUpRequestDto;
import com.elice.boardproject.user.dto.UserResponseDto;
import com.elice.boardproject.user.dto.PasswordUpdateDto;
import com.elice.boardproject.user.dto.ProfileUpdateDto;
import com.elice.boardproject.user.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<UserResponseDto> signup(@Valid @RequestBody SignUpRequestDto signUpRequestDto) {
        return ResponseEntity.ok(userService.signup(signUpRequestDto));
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequestDto loginRequestDto) {
        String token = userService.login(loginRequestDto);
        return ResponseEntity.ok(token);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getMyInfo(email));
    }

    @PutMapping("/password")
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody PasswordUpdateDto passwordUpdateDto) {
        userService.updatePassword(email, passwordUpdateDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponseDto> updateProfile(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ProfileUpdateDto profileUpdateDto) {
        return ResponseEntity.ok(userService.updateProfile(email, profileUpdateDto));
    }

    @PostMapping("/refresh")
    public ResponseEntity<String> refreshToken(@RequestHeader("Refresh-Token") String refreshToken) {
        return ResponseEntity.ok(userService.refreshToken(refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @AuthenticationPrincipal String email,
            HttpServletRequest request,
            HttpServletResponse response) {
        userService.logout(email);
        
        // 응답 헤더에서 토큰 제거
        response.setHeader("Authorization", "");
        response.setHeader("Refresh-Token", "");
        
        return ResponseEntity.ok().build();
    }
} 