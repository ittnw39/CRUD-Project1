package com.elice.boardproject.cosmetic.controller;

import com.elice.boardproject.cosmetic.dto.CosmeticListResponse;
import com.elice.boardproject.cosmetic.dto.CosmeticSearchResponse;
import com.elice.boardproject.cosmetic.entity.Cosmetic;
import com.elice.boardproject.cosmetic.service.CosmeticService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.List;

@RestController
@RequestMapping("/api/cosmetics")
@RequiredArgsConstructor
public class CosmeticController {

    private final CosmeticService cosmeticService;

    @GetMapping
    public ResponseEntity<Mono<CosmeticListResponse>> getDefaultList() {
        return ResponseEntity.ok(cosmeticService.getCosmeticList(1, 10));
    }

    @GetMapping("/list")
    public ResponseEntity<Mono<CosmeticListResponse>> getCosmeticList(
            @RequestParam(value = "pageNo", defaultValue = "1") int pageNo,
            @RequestParam(value = "numOfRows", defaultValue = "10") int numOfRows) {
        return ResponseEntity.ok(cosmeticService.getCosmeticList(pageNo, numOfRows));
    }

    @GetMapping("/search")
    public ResponseEntity<Mono<CosmeticSearchResponse>> searchCosmetics(
            @RequestParam(name = "item_name") String itemName,
            @RequestParam(value = "pageNo", defaultValue = "1") int pageNo,
            @RequestParam(value = "numOfRows", defaultValue = "10") int numOfRows) {
        return ResponseEntity.ok(cosmeticService.searchCosmetics(itemName, pageNo, numOfRows));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Mono<Cosmetic>> getCosmeticById(@PathVariable Long id) {
        return ResponseEntity.ok(cosmeticService.getCosmeticById(id));
    }

    @GetMapping("/search/company")
    public List<Cosmetic> searchCosmeticsByCompany(
            @RequestParam(name = "entp_name") String entpName) {
        return cosmeticService.searchCosmeticByEntpName(entpName);
    }

    @GetMapping("/sunscreens")
    public List<Cosmetic> getSunscreenProducts() {
        return cosmeticService.getSunscreenProducts();
    }
}