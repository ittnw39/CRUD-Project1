package com.elice.boardproject.comment.controller;

import com.elice.boardproject.comment.dto.CommentRequestDto;
import com.elice.boardproject.comment.entity.Comment;
import com.elice.boardproject.comment.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    // 리뷰별 댓글 조회
    @GetMapping("/review/{reviewId}")
    public ResponseEntity<List<Comment>> getCommentsByReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(commentService.findByReviewId(reviewId));
    }

    // 댓글 생성
    @PostMapping
    public ResponseEntity<Comment> createComment(
            @Valid @RequestBody CommentRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        return ResponseEntity.ok(commentService.create(requestDto, userId));
    }

    // 댓글 수정
    @PutMapping("/{id}")
    public ResponseEntity<Comment> updateComment(
            @PathVariable Long id,
            @Valid @RequestBody CommentRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        return ResponseEntity.ok(commentService.update(id, requestDto, userId));
    }

    // 댓글 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(
            @PathVariable Long id,
            @RequestHeader("X-USER-ID") Long userId) {
        commentService.delete(id, userId);
        return ResponseEntity.ok().build();
    }
}
