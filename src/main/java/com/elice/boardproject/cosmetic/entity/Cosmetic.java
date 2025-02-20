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
    private String productName;  // PRDUCT

    @Column(nullable = false)
    private String manufacturer; // BSSH_NM

    private String industry;    // INDUTY

    private LocalDateTime reportDate; // PRMS_DT

    private String expirationPeriod; // DISTB_PD

    private String usagePeriod;     // POG_DAYCNT

    private String storageMethod;   // CSTDY_METHD

    @Column(length = 1000)
    private String precautions;     // IFTKN_ATNT_MATR_CN

    private String standards;       // STDR_STND

    private String licenseNumber;   // LCNS_NO

    private String reportNumber;    // PRDLST_REPORT_NO

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