package com.elice.boardproject.board.controller;

import com.elice.boardproject.board.dtos.*;
import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.service.BoardService;
import com.elice.boardproject.post.dtos.PostRequestDto;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.service.PostService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;
    private final PostService postService;

    // 게시판 생성 폼 페이지
    @GetMapping("/create")
    public String showCreateForm() {
        return "board/createBoard";
    }

    @PostMapping("/create")
    public String createBoard(@ModelAttribute BoardRequestDto boardRequestDto) {
        Board board = new Board();
        board.setTitle(boardRequestDto.getTitle());
        board.setDescription(boardRequestDto.getDescription());
        board.setPassword(boardRequestDto.getPassword());
        boardService.create(board);
        return "redirect:/boards";
    }

    // 게시판 목록 페이지
    @GetMapping
    public String getAllBoard(Model model) {
        List<Board> boards = boardService.findAll();
        model.addAttribute("boards", boards);
        return "board/boards";
    }

    // 개별 게시판 상세 페이지
    @GetMapping("/{id}")
    public String getBoardDetail(@PathVariable("id") Long id,
                                 @RequestParam(name = "page", defaultValue = "0") int page,
                                 @RequestParam(name = "size", defaultValue = "10") int size, Model model) {
        Board board = boardService.findById(id);
        if (board == null) {
            return "error/404"; // 게시판이 존재하지 않으면 404 에러 페이지로 리다이렉션
        }
        model.addAttribute("board", board);

        Pageable pageable = PageRequest.of(page, size);
        Page<Post> postPage = postService.findAllByBoardIdPaged(id, pageable);
        model.addAttribute("postPage", postPage);

        return "board/board"; // 해당 게시판의 상세 정보
    }

    // 게시글 수정을 위한 비밀번호 검증 후 리다이렉션
    @PostMapping("/{id}/edit")
    public ResponseEntity<?> verifyBoardPasswordAndRedirect(@PathVariable("id") Long boardId, @RequestBody BoardRequestDto boardRequestDto) {
        try {
            // 게시글 정보 조회
            Board board = boardService.findById(boardId);
            // 비밀번호 검증
            boardService.validatePassword(board, boardRequestDto.getPassword());

            // 비밀번호가 맞으면 수정 페이지로 리다이렉트 (프론트에서 처리)
            return ResponseEntity.ok().build();

        } catch (EntityNotFoundException e) {
            // 게시글을 찾을 수 없을 때
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
        } catch (IllegalArgumentException e) {
            // 비밀번호가 틀릴 때
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 올바르지 않습니다.");
        } catch (Exception e) {
            // 그 외 예외 발생 시
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 내부 오류가 발생했습니다.");
        }
    }

    @GetMapping("/edit/{id}")
    public String showUpdateForm(@PathVariable("id") Long id, Model model) {
        Board board = boardService.findById(id);
        if (board != null) {
            model.addAttribute("board", board);
            return "board/editBoard";
        } else {
            return "redirect:/boards";
        }
    }

    // 게시판 수정
    @PostMapping("/edit/{id}")
    public String updateBoard(@PathVariable("id") Long id, @ModelAttribute BoardRequestDto boardRequestDto) {
        Board board = new Board();
        board.setId(id);
        board.setTitle(boardRequestDto.getTitle());
        board.setDescription(boardRequestDto.getDescription());
        board.setPassword(boardRequestDto.getPassword());
        boardService.update(board);
        return "redirect:/boards";
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable("id") Long id, @RequestBody BoardRequestDto boardRequestDto) {
        try {
            boardService.delete(id, boardRequestDto.getPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
