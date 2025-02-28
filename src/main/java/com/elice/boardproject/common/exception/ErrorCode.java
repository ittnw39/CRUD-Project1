package com.elice.boardproject.common.exception;

import org.springframework.http.HttpStatus;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {
    // Common
    INVALID_REQUEST(HttpStatus.BAD_REQUEST, "잘못된 요청입니다."),
    INVALID_INPUT_VALUE(HttpStatus.BAD_REQUEST, "잘못된 입력값입니다."),
    UNAUTHORIZED_USER(HttpStatus.UNAUTHORIZED, "인증되지 않은 사용자입니다."),
    
    // User
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    DUPLICATE_EMAIL(HttpStatus.CONFLICT, "이미 존재하는 이메일입니다."),
    DUPLICATE_NICKNAME(HttpStatus.CONFLICT, "이미 존재하는 닉네임입니다."),
    INVALID_PASSWORD(HttpStatus.BAD_REQUEST, "잘못된 비밀번호입니다."),
    
    // Board & Post
    BOARD_NOT_FOUND(HttpStatus.NOT_FOUND, "게시판을 찾을 수 없습니다."),
    POST_NOT_FOUND(HttpStatus.NOT_FOUND, "게시글을 찾을 수 없습니다."),
    NOT_POST_OWNER(HttpStatus.FORBIDDEN, "게시글의 작성자가 아닙니다."),
    
    // Cosmetic
    COSMETIC_NOT_FOUND(HttpStatus.NOT_FOUND, "화장품을 찾을 수 없습니다."),
    DUPLICATE_REVIEW(HttpStatus.CONFLICT, "이미 리뷰를 작성했습니다."),
    COSMETIC_NOT_SELECTED(HttpStatus.BAD_REQUEST, "화장품을 선택해주세요."),
    
    // Comment
    COMMENT_NOT_FOUND(HttpStatus.NOT_FOUND, "댓글을 찾을 수 없습니다."),
    NOT_COMMENT_OWNER(HttpStatus.FORBIDDEN, "댓글의 작성자가 아닙니다."),
    NOT_BOARD_OWNER(HttpStatus.FORBIDDEN, "게시판의 소유자가 아닙니다."),
    
    // Review
    REVIEW_NOT_FOUND(HttpStatus.NOT_FOUND, "리뷰를 찾을 수 없습니다."),
    NOT_REVIEW_OWNER(HttpStatus.FORBIDDEN, "리뷰의 작성자가 아닙니다."),
    
    // Token
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    EXPIRED_TOKEN(HttpStatus.UNAUTHORIZED, "만료된 토큰입니다."),
    
    // Access
    ACCESS_DENIED(HttpStatus.FORBIDDEN, "접근 권한이 없습니다."),
    
    // Server
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 에러가 발생했습니다.");

    private final HttpStatus status;
    private final String message;
} 