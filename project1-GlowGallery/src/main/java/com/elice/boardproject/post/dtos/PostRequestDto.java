package com.elice.boardproject.post.dtos;

import com.elice.boardproject.board.entity.Board;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PostRequestDto {

    private Long id;

    @NotNull
    private String title;

    private String content;

    private Board board;

    @NotNull
    private String password; // 현재 비밀번호

    private String newPassword; // 새로운 비밀번호

    private int ratedStars;
}
