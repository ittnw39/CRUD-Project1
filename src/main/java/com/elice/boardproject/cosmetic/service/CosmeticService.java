package com.elice.boardproject.cosmetic.service;

import com.elice.boardproject.common.exception.CustomException;
import com.elice.boardproject.common.exception.ErrorCode;
import com.elice.boardproject.cosmetic.dto.CosmeticListResponse;
import com.elice.boardproject.cosmetic.dto.CosmeticSearchResponse;
import com.elice.boardproject.cosmetic.entity.Cosmetic;
import com.elice.boardproject.cosmetic.repository.CosmeticRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class CosmeticService {

    private final WebClient productWebClient;
    private final CosmeticRepository cosmeticRepository;
    
    @Value("${cosmetic.api.key}")
    private String apiKey;
    
    @Transactional
    public void processCosmeticData(CosmeticListResponse.CosmeticListItem item) {
        Cosmetic cosmetic = cosmeticRepository.findByCosmeticReportSeq(item.getCosmeticReportSeq())
                .orElseGet(() -> {
                    Cosmetic newCosmetic = new Cosmetic();
                    newCosmetic.setCosmeticReportSeq(item.getCosmeticReportSeq());
                    return newCosmetic;
                });

        // 기본 정보 설정
        cosmetic.setItemName(item.getItemName());
        cosmetic.setReportFlagName(item.getReportFlagName());
        cosmetic.setItemPh(item.getItemPh());
        cosmetic.setCosmeticStdName(item.getCosmeticStdName());
        cosmetic.setEntpName(item.getEntpName());
        
        // SPF 설정: API 응답값 우선, 없으면 제품명에서 추출
        if (item.getSpf() != null && !item.getSpf().equals("0")) {
            cosmetic.setSpf(item.getSpf());
        } else {
            String extractedSpf = extractSpf(item.getItemName());
            if (extractedSpf != null) {
                cosmetic.setSpf(extractedSpf);
            }
        }
        
        // PA 설정: API 응답값 우선, 없으면 제품명에서 추출
        if (item.getPa() != null && !item.getPa().equals("0")) {
            cosmetic.setPa(item.getPa());
        } else {
            String extractedPa = extractPa(item.getItemName());
            if (extractedPa != null) {
                cosmetic.setPa(extractedPa);
            }
        }
        
        // 추가 정보 설정
        cosmetic.setUsageDosage(item.getUsageDosage());
        cosmetic.setEffectYn1(item.getEffectYn1());
        cosmetic.setEffectYn2(item.getEffectYn2());
        cosmetic.setEffectYn3(item.getEffectYn3());
        cosmetic.setWaterProofingName(item.getWaterProofingName());
        cosmetic.setCancelApprovalYn(item.getCancelApprovalYn());
        cosmetic.setEthanolOverYn(item.getEthanolOverYn());
        
        cosmeticRepository.save(cosmetic);
    }

    private String extractSpf(String itemName) {
        String[] patterns = {"에스피에프", "spf", "SPF"};
        String loweredItemName = itemName.toLowerCase();
        
        for (String pattern : patterns) {
            // 괄호 안과 밖 모두 검색
            int index = loweredItemName.indexOf(pattern);
            if (index != -1) {
                StringBuilder result = new StringBuilder();
                boolean foundNumber = false;
                
                // 숫자와 + 또는 "플러스" 찾기
                for (int i = index + pattern.length(); i < itemName.length(); i++) {
                    char c = itemName.charAt(i);
                    
                    // 괄호나 '/' 만나면 중단
                    if (c == ')' || c == '/') break;
                    
                    if (Character.isDigit(c)) {
                        foundNumber = true;
                        result.append(c);
                    } else if (foundNumber && (c == '+' || itemName.substring(i).startsWith("플러스"))) {
                        result.append("+");
                        if (c == '플') i += 2; // "플러스" 건너뛰기
                    } else if (foundNumber && !Character.isWhitespace(c)) {
                        break;
                    }
                }
                
                if (foundNumber) {
                    return result.toString();
                }
            }
        }
        return null;
    }

    private String extractPa(String itemName) {
        String[] patterns = {"피에이", "pa", "PA"};
        String loweredItemName = itemName.toLowerCase();
        
        for (String pattern : patterns) {
            // 괄호 안과 밖 모두 검색
            int index = loweredItemName.indexOf(pattern);
            if (index != -1) {
                int plusCount = 0;
                
                // + 또는 "플러스" 개수 세기
                for (int i = index + pattern.length(); i < itemName.length(); i++) {
                    char c = itemName.charAt(i);
                    
                    // 괄호나 '/' 만나면 중단
                    if (c == ')' || c == '/') break;
                    
                    if (c == '+') {
                        plusCount++;
                    } else if (itemName.substring(i).startsWith("플러스")) {
                        plusCount++;
                        i += 2; // "플러스" 건너뛰기
                    } else if (plusCount > 0 && !Character.isWhitespace(c)) {
                        break;
                    }
                }
                
                if (plusCount > 0) {
                    return "+".repeat(plusCount);
                }
            }
        }
        return null;
    }

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
    
    public Mono<CosmeticSearchResponse> searchCosmetics(String itemName, int pageNo, int numOfRows) {
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

    @Transactional(readOnly = true)
    public List<Cosmetic> searchCosmeticByEntpName(String entpName) {
        return cosmeticRepository.findByEntpNameContaining(entpName);
    }

    @Transactional(readOnly = true)
    public List<Cosmetic> getSunscreenProducts() {
        return cosmeticRepository.findSunscreenProducts();
    }

    public Mono<Cosmetic> getCosmeticById(Long id) {
        return cosmeticRepository.findById(id)
            .map(Mono::just)
            .orElseThrow(() -> new CustomException(ErrorCode.COSMETIC_NOT_FOUND));
    }

    @Transactional(readOnly = true)
    public List<Cosmetic> searchCosmeticsByKeyword(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return cosmeticRepository.findAll();
        }

        // DB에서 검색
        List<Cosmetic> dbResults = cosmeticRepository.searchCosmetics(keyword.trim());
        
        // 이미 있는 화장품의 reportSeq 목록
        Set<String> existingReportSeqs = dbResults.stream()
            .map(Cosmetic::getCosmeticReportSeq)
            .collect(Collectors.toSet());

        // 검색어가 있을 때만 API 호출
        if (!keyword.trim().isEmpty()) {
            try {
                Mono<CosmeticSearchResponse> apiResponse = searchCosmetics(keyword.trim(), 1, 10);
                CosmeticSearchResponse response = apiResponse.block();
                
                if (response != null && response.getBody() != null && response.getBody().getItems() != null) {
                    List<CosmeticSearchResponse.CosmeticSearchItem> apiItems = response.getBody().getItems().getItemList();
                    
                    // API 결과를 Cosmetic 엔티티로 변환하고 DB에 없는 것만 추가
                    for (CosmeticSearchResponse.CosmeticSearchItem item : apiItems) {
                        if (!existingReportSeqs.contains(item.getCosmeticReportSeq())) {
                            Cosmetic cosmetic = new Cosmetic();
                            cosmetic.setCosmeticReportSeq(item.getCosmeticReportSeq());
                            cosmetic.setItemName(item.getItemName());
                            cosmetic.setEntpName(item.getEntpName());
                            cosmetic.setReportFlagName(item.getReportFlagName());
                            cosmetic.setItemPh(item.getItemPh());
                            cosmetic.setCosmeticStdName(item.getCosmeticStdName());
                            
                            // SPF/PA 설정
                            if (item.getSpf() != null && !item.getSpf().equals("0")) {
                                cosmetic.setSpf(item.getSpf());
                            } else {
                                String extractedSpf = extractSpf(item.getItemName());
                                if (extractedSpf != null) {
                                    cosmetic.setSpf(extractedSpf);
                                }
                            }
                            
                            if (item.getPa() != null && !item.getPa().equals("0")) {
                                cosmetic.setPa(item.getPa());
                            } else {
                                String extractedPa = extractPa(item.getItemName());
                                if (extractedPa != null) {
                                    cosmetic.setPa(extractedPa);
                                }
                            }
                            
                            cosmetic.setUsageDosage(item.getUsageDosage());
                            cosmetic.setEffectYn1(item.getEffectYn1());
                            cosmetic.setEffectYn2(item.getEffectYn2());
                            cosmetic.setEffectYn3(item.getEffectYn3());
                            cosmetic.setWaterProofingName(item.getWaterProofingName());
                            
                            dbResults.add(cosmetic);
                            existingReportSeqs.add(item.getCosmeticReportSeq());
                        }
                    }
                }
            } catch (Exception e) {
                log.error("API 검색 중 에러 발생: {}", e.getMessage());
            }
        }
        
        return dbResults;
    }
} 