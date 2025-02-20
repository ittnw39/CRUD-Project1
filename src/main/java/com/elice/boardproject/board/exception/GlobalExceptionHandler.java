package com.elice.boardproject.board.exception;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<String> handleEntityNotFound(EntityNotFoundException e) {
        // 적절한 HTTP 상태 코드와 함께 오류 메시지 반환
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

}