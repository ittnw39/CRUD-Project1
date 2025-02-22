package com.elice.boardproject.cosmetic.repository;

import com.elice.boardproject.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CosmeticRepository extends JpaRepository<Cosmetic, Long> {
    Optional<Cosmetic> findByCosmeticReportSeq(String cosmeticReportSeq);
    List<Cosmetic> findByItemNameContaining(String itemName);
    List<Cosmetic> findByEntpNameContaining(String entpName);
    boolean existsByCosmeticReportSeq(String cosmeticReportSeq);
    
    // 선크림 제품 조회 (SPF/PA 값이 있거나 자외선 차단 기능이 있는 제품)
    @Query("SELECT c FROM Cosmetic c WHERE c.spf IS NOT NULL OR c.pa IS NOT NULL OR c.effectYn3 = 'Y'")
    List<Cosmetic> findSunscreenProducts();
    
    @Query("SELECT c FROM Cosmetic c WHERE " +
           "LOWER(c.itemName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(c.entpName) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Cosmetic> searchCosmetics(@Param("keyword") String keyword);
} 