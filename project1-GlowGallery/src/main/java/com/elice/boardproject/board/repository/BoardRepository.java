package com.elice.boardproject.board.repository;

import com.elice.boardproject.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    Optional<Board> findByTitle(String title);

    void deleteById(Long id);
}
