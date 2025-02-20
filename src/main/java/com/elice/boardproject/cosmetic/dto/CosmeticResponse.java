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
public class CosmeticResponse {
    
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
        private List<CosmeticItem> itemList;
    }

    @Getter
    @Setter
    @XmlAccessorType(XmlAccessType.FIELD)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CosmeticItem {
        @XmlElement(name = "COSMETIC_REPORT_SEQ")
        @JacksonXmlProperty(localName = "COSMETIC_REPORT_SEQ")
        private String cosmeticReportSeq;    // 화장품 보고 일련번호
        
        @XmlElement(name = "ITEM_NAME")
        @JacksonXmlProperty(localName = "ITEM_NAME")
        private String itemName;             // 제품명
        
        @XmlElement(name = "REPORT_FLAG_NAME")
        @JacksonXmlProperty(localName = "REPORT_FLAG_NAME")
        private String reportFlagName;       // 보고구분명
        
        @XmlElement(name = "ITEM_PH")
        @JacksonXmlProperty(localName = "ITEM_PH")
        private String itemPh;               // 제품 pH
        
        @XmlElement(name = "COSMETIC_STD_NAME")
        @JacksonXmlProperty(localName = "COSMETIC_STD_NAME")
        private String cosmeticStdName;      // 화장품 기준 규격
        
        @XmlElement(name = "ENTP_NAME")
        @JacksonXmlProperty(localName = "ENTP_NAME")
        private String entpName;             // 업체명
        
        @XmlElement(name = "REPORT_DATE")
        @JacksonXmlProperty(localName = "REPORT_DATE")
        private String reportDate;           // 보고일자
        
        @XmlElement(name = "CANCEL_APPROVAL_YN")
        @JacksonXmlProperty(localName = "CANCEL_APPROVAL_YN")
        private String cancelApprovalYn;     // 취소승인여부
        
        @XmlElement(name = "ETHANOL_OVER_YN")
        @JacksonXmlProperty(localName = "ETHANOL_OVER_YN")
        private String ethanolOverYn;        // 에탄올 10% 초과여부
        
        @XmlElement(name = "SPF")
        @JacksonXmlProperty(localName = "SPF")
        private String spf;                  // SPF 지수
        
        @XmlElement(name = "PA")
        @JacksonXmlProperty(localName = "PA")
        private String pa;                   // PA 지수
        
        @XmlElement(name = "USAGE_DOSAGE")
        @JacksonXmlProperty(localName = "USAGE_DOSAGE")
        private String usageDosage;         // 사용량/용법
        
        @XmlElement(name = "EFFECT_YN1")
        @JacksonXmlProperty(localName = "EFFECT_YN1")
        private String effectYn1;           // 효과1 여부
        
        @XmlElement(name = "EFFECT_YN2")
        @JacksonXmlProperty(localName = "EFFECT_YN2")
        private String effectYn2;           // 효과2 여부
        
        @XmlElement(name = "EFFECT_YN3")
        @JacksonXmlProperty(localName = "EFFECT_YN3")
        private String effectYn3;           // 효과3 여부
        
        @XmlElement(name = "WATER_PROOFING_NAME")
        @JacksonXmlProperty(localName = "WATER_PROOFING_NAME")
        private String waterProofingName;   // 내수성 구분
        
        @XmlElement(name = "BIZRNO")
        @JacksonXmlProperty(localName = "BIZRNO")
        private String bizrno;              // 사업자등록번호
    }
} 