package com.elice.boardproject.user.controller;

import com.elice.boardproject.user.dto.UserResponseDto;
import com.elice.boardproject.user.dto.PasswordUpdateDto;
import com.elice.boardproject.user.dto.ProfileUpdateDto;
import com.elice.boardproject.user.service.UserService;
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

    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getMyInfo(@AuthenticationPrincipal String email) {
        return ResponseEntity.ok(userService.getMyInfo(email));
    }

    @PutMapping("/me/password")
    public ResponseEntity<Void> updatePassword(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody PasswordUpdateDto passwordUpdateDto) {
        userService.updatePassword(email, passwordUpdateDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/me/profile")
    public ResponseEntity<UserResponseDto> updateProfile(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ProfileUpdateDto profileUpdateDto) {
        return ResponseEntity.ok(userService.updateProfile(email, profileUpdateDto));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal String email) {
        userService.deleteAccount(email);
        return ResponseEntity.ok().build();
    }
} 