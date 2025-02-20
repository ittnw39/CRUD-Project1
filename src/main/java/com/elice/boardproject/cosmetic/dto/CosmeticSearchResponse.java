package com.elice.boardproject.cosmetic.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty;
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlRootElement;
import jakarta.xml.bind.annotation.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@XmlRootElement(name = "response")
@XmlAccessorType(XmlAccessType.FIELD)
@JsonIgnoreProperties(ignoreUnknown = true)
@JacksonXmlRootElement(localName = "response")
public class CosmeticSearchResponse {
    
    @XmlElement(name = "header")
    private Header header;
    
    @XmlElement(name = "body")
    private Body body;

    @Getter
    @Setter
    @XmlAccessorType(XmlAccessType.FIELD)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Header {
        @XmlElement(name = "resultCode")
        private String resultCode;
        
        @XmlElement(name = "resultMsg")
        private String resultMsg;
    }

    @Getter
    @Setter
    @XmlAccessorType(XmlAccessType.FIELD)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Body {
        @XmlElement(name = "items")
        private Items items;
        
        @XmlElement(name = "numOfRows")
        private int numOfRows;
        
        @XmlElement(name = "pageNo")
        private int pageNo;
        
        @XmlElement(name = "totalCount")
        private int totalCount;
    }

    @Getter
    @Setter
    @XmlAccessorType(XmlAccessType.FIELD)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Items {
        @XmlElement(name = "item")
        @JacksonXmlElementWrapper(useWrapping = false)
        @JacksonXmlProperty(localName = "item")
        private List<CosmeticSearchItem> itemList;
    }

    @Getter
    @Setter
    @XmlAccessorType(XmlAccessType.FIELD)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CosmeticSearchItem {
        @XmlElement(name = "COSMETIC_REPORT_SEQ")
        private String cosmeticReportSeq;    // 화장품보고일련번호
        
        @XmlElement(name = "ITEM_NAME")
        private String itemName;             // 품목명
        
        @XmlElement(name = "REPORT_FLAG_NAME")
        private String reportFlagName;       // 화장품보고구분명
        
        @XmlElement(name = "ITEM_PH")
        private String itemPh;               // 품목PH
        
        @XmlElement(name = "COSMETIC_STD_NAME")
        private String cosmeticStdName;      // 화장품기준명
        
        @XmlElement(name = "ENTP_NAME")
        private String entpName;             // 업소명
        
        @XmlElement(name = "REPORT_DATE")
        private String reportDate;           // 보고일자

        @XmlElement(name = "CANCEL_APPROVAL_YN")
        private String cancelApprovalYn;     // 취하승인여부

        @XmlElement(name = "ETHANOL_OVER_YN")
        private String ethanolOverYn;        // 에탄올4%초과여부

        @XmlElement(name = "SPF")
        private String spf;                  // 자외선차단지수(SPF)

        @XmlElement(name = "PA")
        private String pa;                   // 자외선차단지수(PA)

        @XmlElement(name = "USAGE_DOSAGE")
        private String usageDosage;         // 용법용량

        @XmlElement(name = "EFFECT_YN1")
        private String effectYn1;           // 2호효능효과_미백

        @XmlElement(name = "EFFECT_YN2")
        private String effectYn2;           // 2호효능효과_주름개선

        @XmlElement(name = "EFFECT_YN3")
        private String effectYn3;           // 2호효능효과_자외선

        @XmlElement(name = "WATER_PROOFING_NAME")
        private String waterProofingName;   // 2호효능효과_자외선_내수성
    }
} 