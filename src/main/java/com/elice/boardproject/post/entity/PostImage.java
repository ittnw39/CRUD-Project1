package com.elice.boardproject.post.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "post_images")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
@Builder
@EntityListeners(AuditingEntityListener.class)
public class PostImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_image_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @Column(nullable = false)
    private String originalFileName;  // 원본 파일명

    @Column(nullable = false)
    private String storedFileName;    // 저장된 파일명 (UUID)

    @Column(nullable = false)
    private String contentType;       // 파일 타입 (MIME)

    @Column(nullable = false)
    private Long fileSize;           // 파일 크기 (bytes)

    @Column(nullable = false)
    private String fileUrl;          // 파일 접근 URL

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // 연관관계 편의 메서드
    public void setPost(Post post) {
        this.post = post;
    }
} 