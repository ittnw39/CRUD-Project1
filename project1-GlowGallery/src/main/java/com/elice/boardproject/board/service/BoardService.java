package com.elice.boardproject.board.service;

import com.elice.boardproject.board.dtos.BoardRequestDto;
import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.post.entity.Post;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    // 게시판 전체 조회
    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    // 게시판 개별 조회
    public Board findById(Long boardId) {
        return boardRepository.findById(boardId).orElseThrow(() -> new EntityNotFoundException("Board with id " + boardId + " not found"));
    }

    // 게시판 생성
    @Transactional
    public Board create(Board board) {
        return boardRepository.save(board);
    }

    //비밀번호 검증
    public void validatePassword(Board board, String password) {
        if (!board.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
        }
    }

    // 게시판 수정
    @Transactional
    public void update(Board board) {
        boardRepository.save(board);
    }

    // 게시판 삭제
    @Transactional
    public void delete(Long id, String password) {

        Board board = boardRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Post not found"));
        validatePassword(board, password);

        boardRepository.deleteById(id);
    }

}
