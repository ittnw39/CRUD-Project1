package com.elice.boardproject.board.controller;

import com.elice.boardproject.board.dto.BoardRequestDto;
import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.entity.CosmeticCategory;
import com.elice.boardproject.board.service.BoardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;

    // 모든 게시판 조회
    @GetMapping
    public ResponseEntity<List<Board>> getBoards() {
        return ResponseEntity.ok(boardService.findAll());
    }

    // 게시판 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Board> getBoard(@PathVariable Long id) {
        return ResponseEntity.ok(boardService.findById(id));
    }

    // 카테고리별 게시판 조회
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Board>> getBoardsByCategory(
            @PathVariable CosmeticCategory category) {
        return ResponseEntity.ok(boardService.findByCategory(category));
    }

    // 게시판 생성
    @PostMapping
    public ResponseEntity<Board> createBoard(
            @Valid @RequestBody BoardRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        return ResponseEntity.ok(boardService.create(requestDto, userId));
    }

    // 게시판 수정
    @PutMapping("/{id}")
    public ResponseEntity<Board> updateBoard(
            @PathVariable Long id,
            @Valid @RequestBody BoardRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        return ResponseEntity.ok(boardService.update(id, requestDto, userId));
    }

    // 게시판 활성화/비활성화
    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<Board> toggleBoardActive(
            @PathVariable Long id,
            @RequestHeader("X-USER-ID") Long userId) {
        return ResponseEntity.ok(boardService.toggleActive(id, userId));
    }
}
