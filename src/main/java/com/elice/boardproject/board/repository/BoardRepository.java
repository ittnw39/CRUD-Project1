package com.elice.boardproject.board.repository;

import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.entity.CosmeticCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {
    Optional<Board> findByName(String name);
    List<Board> findByCategory(CosmeticCategory category);
}
