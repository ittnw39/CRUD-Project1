package com.elice.boardproject.review.service;

import com.elice.boardproject.common.exception.CustomException;
import com.elice.boardproject.common.exception.ErrorCode;
import com.elice.boardproject.cosmetic.entity.Cosmetic;
import com.elice.boardproject.cosmetic.repository.CosmeticRepository;
import com.elice.boardproject.review.dto.ReviewRequestDto;
import com.elice.boardproject.review.dto.ReviewResponseDto;
import com.elice.boardproject.review.entity.Review;
import com.elice.boardproject.review.repository.ReviewRepository;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.elice.boardproject.review.dto.RatingStatsDto;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CosmeticRepository cosmeticRepository;

    @Transactional
    public ReviewResponseDto createReview(String userEmail, ReviewRequestDto reviewRequestDto) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Cosmetic cosmetic = cosmeticRepository.findById(reviewRequestDto.getCosmeticId())
                .orElseThrow(() -> new CustomException(ErrorCode.COSMETIC_NOT_FOUND));

        if (reviewRepository.existsByUserIdAndCosmeticId(user.getId(), cosmetic.getId())) {
            throw new CustomException(ErrorCode.DUPLICATE_REVIEW);
        }

        Review review = Review.builder()
                .user(user)
                .cosmetic(cosmetic)
                .content(reviewRequestDto.getContent())
                .rating(reviewRequestDto.getRating())
                .build();

        return ReviewResponseDto.from(reviewRepository.save(review));
    }

    @Transactional(readOnly = true)
    public ReviewResponseDto getReview(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));
        return ReviewResponseDto.from(review);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponseDto> getReviewsByCosmeticId(Long cosmeticId, Pageable pageable) {
        if (!cosmeticRepository.existsById(cosmeticId)) {
            throw new CustomException(ErrorCode.COSMETIC_NOT_FOUND);
        }
        return reviewRepository.findByCosmeticId(cosmeticId, pageable)
                .map(ReviewResponseDto::from);
    }

    @Transactional(readOnly = true)
    public Page<ReviewResponseDto> getReviewsByUser(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return reviewRepository.findByUserId(user.getId(), pageable)
                .map(ReviewResponseDto::from);
    }

    @Transactional
    public ReviewResponseDto updateReview(String userEmail, Long reviewId, ReviewRequestDto reviewRequestDto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new CustomException(ErrorCode.NOT_REVIEW_OWNER);
        }

        review.updateContent(reviewRequestDto.getContent());
        review.updateRating(reviewRequestDto.getRating());

        return ReviewResponseDto.from(review);
    }

    @Transactional
    public void deleteReview(String userEmail, Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new CustomException(ErrorCode.REVIEW_NOT_FOUND));

        if (!review.getUser().getEmail().equals(userEmail)) {
            throw new CustomException(ErrorCode.NOT_REVIEW_OWNER);
        }

        reviewRepository.delete(review);
    }

    @Transactional(readOnly = true)
    public RatingStatsDto getRatingStats(Long cosmeticId) {
        if (!cosmeticRepository.existsById(cosmeticId)) {
            throw new CustomException(ErrorCode.COSMETIC_NOT_FOUND);
        }

        Double averageRating = reviewRepository.getAverageRatingByCosmeticId(cosmeticId);
        if (averageRating == null) {
            averageRating = 0.0;
        }

        return RatingStatsDto.builder()
                .cosmeticId(cosmeticId)
                .averageRating(Math.round(averageRating * 10.0) / 10.0)
                .totalReviews(reviewRepository.countByCosmeticId(cosmeticId))
                .fiveStarCount(reviewRepository.countByRatingAndCosmeticId(5, cosmeticId))
                .fourStarCount(reviewRepository.countByRatingAndCosmeticId(4, cosmeticId))
                .threeStarCount(reviewRepository.countByRatingAndCosmeticId(3, cosmeticId))
                .twoStarCount(reviewRepository.countByRatingAndCosmeticId(2, cosmeticId))
                .oneStarCount(reviewRepository.countByRatingAndCosmeticId(1, cosmeticId))
                .build();
    }
} 