package com.elice.boardproject.review.dto;

import com.elice.boardproject.review.entity.Review;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class ReviewResponseDto {
    private Long id;
    private Long userId;
    private String userNickname;
    private Long cosmeticId;
    private String cosmeticName;
    private String content;
    private int rating;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ReviewResponseDto from(Review review) {
        return ReviewResponseDto.builder()
                .id(review.getId())
                .userId(review.getUser().getId())
                .userNickname(review.getUser().getNickname())
                .cosmeticId(review.getCosmetic().getId())
                .cosmeticName(review.getCosmetic().getItemName())
                .content(review.getContent())
                .rating(review.getRating())
                .createdAt(review.getCreatedAt())
                .updatedAt(review.getUpdatedAt())
                .build();
    }
} 