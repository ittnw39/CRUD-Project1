package com.elice.boardproject.review.repository;

import com.elice.boardproject.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByCosmeticId(Long cosmeticId);
    Optional<Review> findByUserIdAndCosmeticId(Long userId, Long cosmeticId);
    boolean existsByUserIdAndCosmeticId(Long userId, Long cosmeticId);
} 