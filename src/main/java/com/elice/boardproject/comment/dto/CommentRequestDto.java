package com.elice.boardproject.comment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentRequestDto {
    @NotNull(message = "게시글 ID는 필수입니다")
    private Long postId;

    private Long parentId;  // 대댓글인 경우 부모 댓글 ID

    @NotBlank(message = "댓글 내용은 필수입니다")
    @Size(min = 1, max = 1000, message = "댓글은 1자 이상 1000자 이하로 입력해주세요")
    private String content;
} 