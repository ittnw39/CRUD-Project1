package com.elice.boardproject.board.controller;

import com.elice.boardproject.board.dto.BoardRequestDto;
import com.elice.boardproject.board.dto.BoardResponseDto;
import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.entity.BoardCategory;
import com.elice.boardproject.board.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    // 모든 게시판 조회
    @GetMapping
    public ResponseEntity<List<BoardResponseDto>> getBoards() {
        List<BoardResponseDto> boards = boardService.findAll().stream()
                .map(BoardResponseDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(boards);
    }

    // 게시판 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<BoardResponseDto> getBoard(@PathVariable Long id) {
        Board board = boardService.findById(id);
        return ResponseEntity.ok(BoardResponseDto.from(board));
    }

    // 카테고리별 게시판 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<BoardResponseDto>> getBoardsByCategory(
            @PathVariable BoardCategory category) {
        List<BoardResponseDto> boards = boardService.findByCategory(category).stream()
                .map(BoardResponseDto::from)
                .collect(Collectors.toList());
        return ResponseEntity.ok(boards);
    }

    // 게시판 생성
    @PostMapping
    public ResponseEntity<BoardResponseDto> createBoard(
            @Valid @RequestBody BoardRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        Board board = boardService.create(requestDto, userId);
        return ResponseEntity.ok(BoardResponseDto.from(board));
    }

    // 게시판 수정
    @PutMapping("/{id}")
    public ResponseEntity<BoardResponseDto> updateBoard(
            @PathVariable Long id,
            @Valid @RequestBody BoardRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        Board board = boardService.update(id, requestDto, userId);
        return ResponseEntity.ok(BoardResponseDto.from(board));
    }

    // 게시판 활성화/비활성화
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<BoardResponseDto> toggleBoardActive(
            @PathVariable Long id,
            @RequestHeader("X-USER-ID") Long userId) {
        Board board = boardService.toggleActive(id, userId);
        return ResponseEntity.ok(BoardResponseDto.from(board));
    }
}
