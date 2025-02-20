package com.elice.boardproject.review.service;

import com.elice.boardproject.cosmetic.entity.Cosmetic;
import com.elice.boardproject.cosmetic.repository.CosmeticRepository;
import com.elice.boardproject.review.dto.ReviewRequestDto;
import com.elice.boardproject.review.entity.Review;
import com.elice.boardproject.review.repository.ReviewRepository;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CosmeticRepository cosmeticRepository;

    // 화장품별 리뷰 조회
    public List<Review> findByCosmeticId(Long cosmeticId) {
        return reviewRepository.findByCosmeticId(cosmeticId);
    }

    // 리뷰 상세 조회
    public Review findById(Long reviewId) {
        return reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found with id: " + reviewId));
    }

    // 리뷰 작성
    @Transactional
    public Review create(ReviewRequestDto requestDto, Long userId) {
        // 사용자 존재 확인
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // 화장품 존재 확인
        Cosmetic cosmetic = cosmeticRepository.findById(requestDto.getCosmeticId())
                .orElseThrow(() -> new EntityNotFoundException("Cosmetic not found"));

        // 이미 리뷰를 작성했는지 확인
        if (reviewRepository.existsByUserIdAndCosmeticId(userId, requestDto.getCosmeticId())) {
            throw new IllegalStateException("User already wrote a review for this cosmetic");
        }

        Review review = new Review();
        review.setUser(user);
        review.setCosmetic(cosmetic);
        review.setRating(requestDto.getRating());
        review.setContent(requestDto.getContent());

        return reviewRepository.save(review);
    }

    // 리뷰 수정
    @Transactional
    public Review update(Long reviewId, ReviewRequestDto requestDto, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        // 리뷰 작성자 확인
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to update this review");
        }

        review.setRating(requestDto.getRating());
        review.setContent(requestDto.getContent());

        return reviewRepository.save(review);
    }

    // 리뷰 삭제
    @Transactional
    public void delete(Long reviewId, Long userId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        // 리뷰 작성자 확인
        if (!review.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to delete this review");
        }

        reviewRepository.delete(review);
    }
} 