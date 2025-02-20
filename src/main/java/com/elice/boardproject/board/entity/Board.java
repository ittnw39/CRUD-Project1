package com.elice.boardproject.board.entity;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.user.entity.User;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boards")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;  // 게시판 이름 (스킨케어, 메이크업, 바디케어 등)

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private CosmeticCategory category;  // 화장품 카테고리

    @Column(length = 500)
    private String description;  // 게시판 설명

    @Column(nullable = false)
    @Builder.Default
    private boolean isActive = true;  // 게시판 활성화 여부

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Post> posts = new ArrayList<>();

    @Column(name = "post_count")
    @Builder.Default
    private int postCount = 0;  // 게시글 수

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;  // 게시판 관리자

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
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

    // 게시글 수 증가
    public void incrementPostCount() {
        this.postCount++;
    }

    // 게시글 수 감소
    public void decrementPostCount() {
        if (this.postCount > 0) {
            this.postCount--;
        }
    }
}