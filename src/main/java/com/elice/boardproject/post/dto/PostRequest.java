package com.elice.boardproject.post.dto;

import com.elice.boardproject.post.entity.PostType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@ToString
public class PostRequest {
    @NotNull
    private Long boardId;
    
    private Long cosmeticId;

    @NotBlank
    private String title;

    @NotBlank
    private String content;

    @NotNull
    private PostType postType;

    private Integer rating;

    private List<String> tags;
} 