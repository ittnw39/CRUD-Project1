package com.elice.boardproject.cosmetic.service;

import com.elice.boardproject.cosmetic.dto.CosmeticListResponse;
import com.elice.boardproject.cosmetic.dto.CosmeticSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.web.util.UriComponentsBuilder;

@Slf4j
@Service
@RequiredArgsConstructor
public class CosmeticService {

    private final WebClient productWebClient;
    
    @Value("${cosmetic.api.key}")
    private String apiKey;
    
    public Mono<CosmeticListResponse> getCosmeticList(int pageNo, int numOfRows) {
        String uri = UriComponentsBuilder.fromPath("/getRptPrdlstInq")
                .queryParam("serviceKey", apiKey)
                .queryParam("pageNo", pageNo)
                .queryParam("numOfRows", numOfRows)
                .queryParam("type", "xml")
                .build()
                .toUriString();
                
        log.debug("화장품 목록 API 호출: {}", uri);
        
        return productWebClient.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .bodyToMono(CosmeticListResponse.class)
                .doOnNext(response -> {
                    log.info("=== 화장품 목록 API 응답 ===");
                    if (response.getBody() != null && response.getBody().getItems() != null) {
                        response.getBody().getItems().getItemList().forEach(item -> {
                            log.info("제품명: {}", item.getItemName());
                            log.info("제조사: {}", item.getEntpName());
                            log.info("보고구분: {}", item.getReportFlagName());
                            log.info("pH: {}", item.getItemPh());
                            log.info("------------------------");
                        });
                    }
                })
                .doOnError(error -> {
                    log.error("API 호출 중 에러 발생: {}", error.getMessage());
                    log.error("상세 에러: ", error);
                });
    }

    
    private String encodeParam(String value) {
        try {
            return java.net.URLEncoder.encode(value, "UTF-8");
        } catch (java.io.UnsupportedEncodingException e) {
            throw new RuntimeException("파라미터 인코딩 실패", e);
        }
    }
    
    public Mono<CosmeticSearchResponse> searchCosmeticByName(String itemName, int pageNo, int numOfRows) {
        String uri = UriComponentsBuilder.fromPath("/getRptPrdlstInq")
                .queryParam("serviceKey", apiKey)
                .queryParam("pageNo", pageNo)
                .queryParam("numOfRows", numOfRows)
                .queryParam("type", "xml")
                .queryParam("item_name", encodeParam(itemName))
                .build()
                .toUriString();
                
        log.debug("화장품 검색 API 호출: {}", uri);
        
        return productWebClient.get()
                .uri(uri)
                .accept(MediaType.APPLICATION_XML)
                .retrieve()
                .bodyToMono(CosmeticSearchResponse.class)
                .doOnNext(response -> {
                    log.info("=== 화장품 검색 API 응답 ===");
                    if (response.getBody() != null && response.getBody().getItems() != null) {
                        response.getBody().getItems().getItemList().forEach(item -> {
                            log.info("품목명: {}", item.getItemName());
                            log.info("업소명: {}", item.getEntpName());
                            log.info("보고구분: {}", item.getReportFlagName());
                            log.info("pH: {}", item.getItemPh());
                            log.info("------------------------");
                        });
                    } else {
                        log.info("검색 결과가 없습니다.");
                    }
                })
                .doOnError(error -> {
                    log.error("API 호출 중 에러 발생: {}", error.getMessage());
                    log.error("상세 에러: ", error);
                });
    }
} 