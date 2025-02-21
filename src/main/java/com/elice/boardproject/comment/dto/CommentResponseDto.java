package com.elice.boardproject.comment.dto;

import com.elice.boardproject.comment.entity.Comment;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class CommentResponseDto {
    private Long id;
    private String content;
    private String userEmail;
    private String userNickname;
    private boolean isAuthorComment;    // 게시글 작성자의 댓글 여부
    private boolean isDeleted;          // 삭제된 댓글 여부
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long parentId;              // 부모 댓글 ID (대댓글인 경우)
    private List<CommentResponseDto> replies;  // 대댓글 목록

    public static CommentResponseDto from(Comment comment) {
        return CommentResponseDto.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .userEmail(comment.getUser().getEmail())
                .userNickname(comment.getUser().getNickname())
                .isAuthorComment(comment.isAuthorComment())
                .isDeleted(comment.isDeleted())
                .createdAt(comment.getCreatedAt())
                .updatedAt(comment.getUpdatedAt())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .replies(comment.getReplies().stream()
                        .map(CommentResponseDto::from)
                        .collect(Collectors.toList()))
                .build();
    }
} 