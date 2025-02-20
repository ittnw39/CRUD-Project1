package com.elice.boardproject.board.entity;

import lombok.Getter;

@Getter
public enum CosmeticCategory {
    SKINCARE("SKN", "스킨케어", "기초 화장품 카테고리"),
    MAKEUP("MKP", "메이크업", "색조 화장품 카테고리"),
    BODYCARE("BDC", "바디케어", "바디 케어 제품 카테고리"),
    HAIRCARE("HRC", "헤어케어", "헤어 케어 제품 카테고리"),
    SUNCARE("SNC", "선케어", "자외선 차단 제품 카테고리"),
    CLEANSING("CLN", "클렌징", "세정 제품 카테고리");

    private final String code;
    private final String displayName;
    private final String description;

    CosmeticCategory(String code, String displayName, String description) {
        this.code = code;
        this.displayName = displayName;
        this.description = description;
    }

    public static CosmeticCategory fromCode(String code) {
        for (CosmeticCategory category : values()) {
            if (category.getCode().equals(code)) {
                return category;
            }
        }
        throw new IllegalArgumentException("Invalid category code: " + code);
    }
}