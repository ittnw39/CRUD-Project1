package com.elice.boardproject.comment.controller;

import com.elice.boardproject.comment.dto.CommentRequestDto;
import com.elice.boardproject.comment.dto.CommentResponseDto;
import com.elice.boardproject.comment.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // 게시글별 댓글 목록 조회
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponseDto>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(
            commentService.findByPostId(postId).stream()
                .map(CommentResponseDto::from)
                .collect(Collectors.toList())
        );
    }

    // 댓글 생성
    @PostMapping
    public ResponseEntity<CommentResponseDto> createComment(
            @Valid @RequestBody CommentRequestDto requestDto,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
            CommentResponseDto.from(commentService.create(requestDto, email))
        );
    }

    // 댓글 수정
    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponseDto> updateComment(
            @PathVariable Long commentId,
            @Valid @RequestBody CommentRequestDto requestDto,
            @AuthenticationPrincipal String email) {
        return ResponseEntity.ok(
            CommentResponseDto.from(commentService.update(commentId, requestDto, email))
        );
    }

    // 댓글 삭제
    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long commentId,
            @AuthenticationPrincipal String email) {
        commentService.delete(commentId, email);
        return ResponseEntity.ok().build();
    }
}
