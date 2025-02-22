package com.elice.boardproject.board.service;

import com.elice.boardproject.board.dto.BoardRequestDto;
import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.entity.BoardCategory;
import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
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
    private final UserRepository userRepository;

    // 모든 게시판 조회
    public List<Board> findAll() {
        return boardRepository.findAll();
    }

    // 게시판 상세 조회
    public Board findById(Long id) {
        return boardRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Board not found"));
    }

    // 카테고리별 게시판 조회
    public List<Board> findByCategory(BoardCategory category) {
        return boardRepository.findByCategory(category);
    }

    // 게시판 생성
    @Transactional
    public Board create(BoardRequestDto requestDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // 게시판 이름 중복 체크
        if (boardRepository.findByName(requestDto.getName()).isPresent()) {
            throw new IllegalStateException("Board name already exists");
        }

        Board board = new Board();
        board.setName(requestDto.getName());
        board.setDescription(requestDto.getDescription());
        board.setCategory(requestDto.getCategory());
        board.setActive(true);
        board.setUser(user);

        return boardRepository.save(board);
    }

    // 게시판 수정
    @Transactional
    public Board update(Long boardId, BoardRequestDto requestDto, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException("Board not found"));

        // 게시판 관리자 확인
        if (!board.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to update this board");
        }

        // 이름 변경 시 중복 체크
        if (!board.getName().equals(requestDto.getName()) &&
            boardRepository.findByName(requestDto.getName()).isPresent()) {
            throw new IllegalStateException("Board name already exists");
        }

        board.setName(requestDto.getName());
        board.setDescription(requestDto.getDescription());
        board.setCategory(requestDto.getCategory());

        return boardRepository.save(board);
    }

    // 게시판 활성화/비활성화
    @Transactional
    public Board toggleActive(Long boardId, Long userId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new EntityNotFoundException("Board not found"));

        // 게시판 관리자 확인
        if (!board.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to toggle this board's status");
        }

        board.setActive(!board.isActive());
        return boardRepository.save(board);
    }
}
