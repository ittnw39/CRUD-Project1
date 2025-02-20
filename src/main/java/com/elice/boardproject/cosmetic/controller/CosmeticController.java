package com.elice.boardproject.cosmetic.controller;

import com.elice.boardproject.cosmetic.dto.CosmeticListResponse;
import com.elice.boardproject.cosmetic.dto.CosmeticSearchResponse;
import com.elice.boardproject.cosmetic.service.CosmeticService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/cosmetics")
@RequiredArgsConstructor
public class CosmeticController {

    private final CosmeticService cosmeticService;

    @GetMapping("/list")
    public Mono<CosmeticListResponse> getCosmeticList(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int numOfRows) {
        return cosmeticService.getCosmeticList(pageNo, numOfRows);
    }

    @GetMapping("/search")
    public Mono<CosmeticSearchResponse> searchCosmetics(
            @RequestParam(name = "item_name") String itemName,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int numOfRows) {
        return cosmeticService.searchCosmeticByName(itemName, pageNo, numOfRows);
    }
}