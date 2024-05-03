package com.elice.boardproject.post.entity;

import com.elice.boardproject.board.dtos.BoardRequestDto;
import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.comment.entity.Comment;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;


import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "board_id")
    private Board board;

    private String title;

    private String content;

    @Enumerated(EnumType.STRING)
    private PostStatus status;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @OrderBy("createdAt DESC")
    private final List<Comment> comments = new ArrayList<>();

    @Column(nullable = false)
    private String password;

    @Column(name = "rated_Stars", nullable = false)
    private int ratedStars;

}
