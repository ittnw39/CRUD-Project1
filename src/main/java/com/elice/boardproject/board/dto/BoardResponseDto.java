package com.elice.boardproject.board.dto;

import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.entity.BoardCategory;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@Builder
public class BoardResponseDto {
    private Long id;
    private String name;
    private BoardCategory category;
    private String description;
    private boolean isActive;
    private int postCount;
    private Long userId;
    private String userNickname;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static BoardResponseDto from(Board board) {
        return BoardResponseDto.builder()
                .id(board.getId())
                .name(board.getName())
                .category(board.getCategory())
                .description(board.getDescription())
                .isActive(board.isActive())
                .postCount(board.getPostCount())
                .userId(board.getUser().getId())
                .userNickname(board.getUser().getNickname())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }
} 