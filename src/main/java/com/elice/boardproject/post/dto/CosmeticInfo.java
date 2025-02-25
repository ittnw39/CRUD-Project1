package com.elice.boardproject.post.dto;

import com.elice.boardproject.cosmetic.entity.CosmeticType;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CosmeticInfo {
    private String cosmeticReportSeq;
    private String itemName;
    private String entpName;
    private String reportFlagName;
    private String itemPh;
    private String cosmeticStdName;
    private String spf;
    private String pa;
    private String usageDosage;
    private String effectYn1;
    private String effectYn2;
    private String effectYn3;
    private String waterProofingName;
    private CosmeticType cosmeticType;
} 