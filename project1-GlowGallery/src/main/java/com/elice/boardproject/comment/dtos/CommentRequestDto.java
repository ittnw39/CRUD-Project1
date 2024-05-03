package com.elice.boardproject.comment.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentRequestDto {

    @NotNull
    private Long id;

    @NotNull
    private String content;

    @NotNull
    private LocalDateTime createdAt;

}
