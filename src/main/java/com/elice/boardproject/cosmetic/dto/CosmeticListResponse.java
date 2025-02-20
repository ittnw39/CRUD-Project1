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
public class CosmeticListResponse {
    
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
        private List<CosmeticListItem> itemList;
    }

    @Getter
    @Setter
    @XmlAccessorType(XmlAccessType.FIELD)
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class CosmeticListItem {
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
    }
} 