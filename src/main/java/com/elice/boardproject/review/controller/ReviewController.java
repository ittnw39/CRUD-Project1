package com.elice.boardproject.review.controller;

import com.elice.boardproject.review.dto.ReviewRequestDto;
import com.elice.boardproject.review.dto.ReviewResponseDto;
import com.elice.boardproject.review.dto.RatingStatsDto;
import com.elice.boardproject.review.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewResponseDto> createReview(
            @AuthenticationPrincipal String email,
            @Valid @RequestBody ReviewRequestDto reviewRequestDto) {
        return ResponseEntity.ok(reviewService.createReview(email, reviewRequestDto));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDto> getReview(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getReview(reviewId));
    }

    @GetMapping("/cosmetic/{cosmeticId}")
    public ResponseEntity<Page<ReviewResponseDto>> getReviewsByCosmetic(
            @PathVariable Long cosmeticId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByCosmeticId(cosmeticId, pageable));
    }

    @GetMapping("/my")
    public ResponseEntity<Page<ReviewResponseDto>> getMyReviews(
            @AuthenticationPrincipal String email,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(email, pageable));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewResponseDto> updateReview(
            @AuthenticationPrincipal String email,
            @PathVariable Long reviewId,
            @Valid @RequestBody ReviewRequestDto reviewRequestDto) {
        return ResponseEntity.ok(reviewService.updateReview(email, reviewId, reviewRequestDto));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(
            @AuthenticationPrincipal String email,
            @PathVariable Long reviewId) {
        reviewService.deleteReview(email, reviewId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/cosmetic/{cosmeticId}/stats")
    public ResponseEntity<RatingStatsDto> getRatingStats(@PathVariable Long cosmeticId) {
        return ResponseEntity.ok(reviewService.getRatingStats(cosmeticId));
    }
} 