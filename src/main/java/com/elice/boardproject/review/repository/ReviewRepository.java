package com.elice.boardproject.review.repository;

import com.elice.boardproject.review.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByCosmeticId(Long cosmeticId, Pageable pageable);
    Page<Review> findByUserId(Long userId, Pageable pageable);
    boolean existsByUserIdAndCosmeticId(Long userId, Long cosmeticId);
    long countByCosmeticId(Long cosmeticId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.cosmetic.id = :cosmeticId")
    Double getAverageRatingByCosmeticId(@Param("cosmeticId") Long cosmeticId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.cosmetic.id = :cosmeticId AND r.rating = :rating")
    Long countByRatingAndCosmeticId(@Param("rating") Integer rating, @Param("cosmeticId") Long cosmeticId);
} 