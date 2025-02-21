package com.elice.boardproject.post.dto;

import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.entity.PostType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@Builder
public class PostResponse {
    private Long id;
    private Long boardId;
    private String boardName;
    private Long userId;
    private String userNickname;
    private String userProfileImage;
    private Long cosmeticId;
    private String cosmeticName;
    private String title;
    private String content;
    private PostType postType;
    private Integer rating;
    private int viewCount;
    private int commentCount;
    private List<String> imagePaths;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static PostResponse from(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .boardId(post.getBoard() != null ? post.getBoard().getId() : null)
                .boardName(post.getBoard() != null ? post.getBoard().getName() : null)
                .userId(post.getUser().getId())
                .userNickname(post.getUser().getNickname())
                .userProfileImage(post.getUser().getProfileImage())
                .cosmeticId(post.getCosmetic() != null ? post.getCosmetic().getId() : null)
                .cosmeticName(post.getCosmetic() != null ? post.getCosmetic().getItemName() : null)
                .title(post.getTitle())
                .content(post.getContent())
                .postType(post.getPostType())
                .rating(post.getRating())
                .viewCount(post.getViewCount())
                .commentCount(post.getComments().size())
                .imagePaths(post.getImages().stream()
                        .map(image -> image.getFileUrl())
                        .collect(Collectors.toList()))
                .tags(post.getTags().stream()
                        .map(tag -> "#" + tag.getName())
                        .collect(Collectors.toList()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }
} 