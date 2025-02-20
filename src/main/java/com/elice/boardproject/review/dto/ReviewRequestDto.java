package com.elice.boardproject.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ReviewRequestDto {
    @NotNull
    private Long cosmeticId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer rating;

    @NotNull
    private String content;
} 