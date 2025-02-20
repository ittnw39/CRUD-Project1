package com.elice.boardproject.cosmetic.repository;

import com.elice.boardproject.cosmetic.entity.Cosmetic;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CosmeticRepository extends JpaRepository<Cosmetic, Long> {
    List<Cosmetic> findByProductNameContaining(String productName);
    List<Cosmetic> findByManufacturerContaining(String manufacturer);
} 