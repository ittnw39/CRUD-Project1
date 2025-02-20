package com.elice.boardproject.cosmetic.controller;

import com.elice.boardproject.cosmetic.dto.CosmeticResponse;
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
    public Mono<CosmeticResponse> getCosmeticList(
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int numOfRows) {
        return cosmeticService.getCosmeticList(pageNo, numOfRows);
    }

    @GetMapping("/search")
    public Mono<CosmeticResponse> searchCosmetics(
            @RequestParam String productName,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "10") int numOfRows) {
        return cosmeticService.searchCosmeticByName(productName, pageNo, numOfRows);
    }
}