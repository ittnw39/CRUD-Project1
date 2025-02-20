package com.elice.boardproject.user.entity;

public enum ProviderType {
    LOCAL("local", "로컬"),
    GOOGLE("google", "구글"),
    KAKAO("kakao", "카카오"),
    NAVER("naver", "네이버");

    private final String key;
    private final String title;

    ProviderType(String key, String title) {
        this.key = key;
        this.title = title;
    }

    public String getKey() {
        return key;
    }

    public String getTitle() {
        return title;
    }
} 