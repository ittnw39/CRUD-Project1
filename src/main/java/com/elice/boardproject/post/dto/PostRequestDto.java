package com.elice.boardproject.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PostRequestDto {
    @NotNull(message = "게시판 ID는 필수입니다")
    private Long boardId;

    @NotBlank(message = "제목은 필수입니다")
    private String title;

    @NotBlank(message = "내용은 필수입니다")
    private String content;

    @NotNull(message = "태그된 화장품 ID는 필수입니다")
    private Long taggedCosmeticId;
} 