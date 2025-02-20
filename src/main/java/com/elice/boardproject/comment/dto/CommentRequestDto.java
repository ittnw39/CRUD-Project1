package com.elice.boardproject.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    @NotNull(message = "리뷰 ID는 필수입니다")
    private Long reviewId;

    @NotBlank(message = "댓글 내용은 필수입니다")
    private String content;
} 