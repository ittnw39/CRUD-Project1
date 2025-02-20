package com.elice.boardproject.review.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class RatingStatsDto {
    private Long cosmeticId;
    private double averageRating;
    private long totalReviews;
    private long fiveStarCount;
    private long fourStarCount;
    private long threeStarCount;
    private long twoStarCount;
    private long oneStarCount;
} 