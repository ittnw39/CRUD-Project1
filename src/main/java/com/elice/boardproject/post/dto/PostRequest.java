package com.elice.boardproject.post.dto;

import com.elice.boardproject.post.entity.PostType;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class PostRequest {
    private Long boardId;
    private String title;
    private String content;
    private PostType postType;
    private Integer rating;
    private String cosmeticReportSeq;
    private CosmeticInfo cosmeticInfo;
    private List<String> tags;
} 