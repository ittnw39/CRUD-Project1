package com.elice.boardproject.board.dto;

import com.elice.boardproject.board.entity.BoardCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardRequestDto {
    @NotBlank(message = "게시판 이름은 필수입니다")
    @Size(min = 2, max = 50, message = "게시판 이름은 2자 이상 50자 이하여야 합니다")
    private String name;

    @NotBlank(message = "게시판 설명은 필수입니다")
    @Size(max = 500, message = "게시판 설명은 500자 이하여야 합니다")
    private String description;

    @NotNull(message = "게시판 카테고리는 필수입니다")
    private BoardCategory category;
} 