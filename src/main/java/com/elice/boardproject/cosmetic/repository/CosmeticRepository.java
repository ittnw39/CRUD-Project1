package com.elice.boardproject.cosmetic.repository;

import com.elice.boardproject.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CosmeticRepository extends JpaRepository<Cosmetic, Long> {
    Optional<Cosmetic> findByCosmeticReportSeq(String cosmeticReportSeq);
    List<Cosmetic> findByItemNameContaining(String itemName);
    List<Cosmetic> findByEntpNameContaining(String entpName);
    boolean existsByCosmeticReportSeq(String cosmeticReportSeq);
    
    // SPF 또는 PA 값이 있는 선제품 조회
    @Query("SELECT c FROM Cosmetic c WHERE c.spf IS NOT NULL OR c.pa IS NOT NULL")
    List<Cosmetic> findSunscreenProducts();
} 