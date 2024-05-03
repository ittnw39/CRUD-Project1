package com.elice.boardproject.board.dtos;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BoardRequestDto { //클라이언트->서버 // 입력데이터 - 생성, 수정

    private Long id;

    @NotNull
    private String title;

    private String description;

    private String password;

}

