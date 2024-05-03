package com.elice.boardproject.board.dtos;

import com.elice.boardproject.board.entity.Board;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BoardResponseDto { //서버->클라이언트, 출력데이터 - 조회

    private Long id;

    private String title;

    private String description;

    public BoardResponseDto(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.description = board.getDescription();
    }

}
