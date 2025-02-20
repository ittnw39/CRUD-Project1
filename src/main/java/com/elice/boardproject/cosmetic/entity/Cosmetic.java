package com.elice.boardproject.cosmetic.entity;

import com.elice.boardproject.review.entity.Review;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "cosmetics")
@Getter
@Setter
public class Cosmetic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String cosmeticReportSeq;    // 화장품보고일련번호 (COSMETIC_REPORT_SEQ)

    @Column(nullable = false)
    private String itemName;             // 품목명 (ITEM_NAME)

    @Column(nullable = false)
    private String reportFlagName;       // 화장품보고구분명 (REPORT_FLAG_NAME)

    private String itemPh;               // 품목PH (ITEM_PH)

    private String cosmeticStdName;      // 화장품기준명 (COSMETIC_STD_NAME)

    @Column(nullable = false)
    private String entpName;             // 업소명 (ENTP_NAME)

    private LocalDateTime reportDate;     // 보고일자 (REPORT_DATE)

    private String cancelApprovalYn;     // 취하승인여부 (CANCEL_APPROVAL_YN)

    private String ethanolOverYn;        // 에탄올4%초과여부 (ETHANOL_OVER_YN)

    private String spf;                  // 자외선차단지수 (SPF)

    private String pa;                   // 자외선차단지수PA (PA)

    private String usageDosage;          // 용법용량 (USAGE_DOSAGE)

    private String effectYn1;            // 2호효능효과_미백 (EFFECT_YN1)

    private String effectYn2;            // 2호효능효과_주름개선 (EFFECT_YN2)

    private String effectYn3;            // 2호효능효과_자외선 (EFFECT_YN3)

    private String waterProofingName;    // 2호효능효과_자외선_내수성 (WATER_PROOFING_NAME)

    @OneToMany(mappedBy = "cosmetic", cascade = CascadeType.ALL)
    private List<Review> reviews = new ArrayList<>();

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
} 