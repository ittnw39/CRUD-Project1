package com.elice.boardproject.cosmetic.entity;

public enum CosmeticType {
    SKINCARE("스킨케어"),
    BODYCARE("바디케어"),
    SUNCARE("선케어"),
    MAKEUP("메이크업");

    private final String displayName;

    CosmeticType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
} 