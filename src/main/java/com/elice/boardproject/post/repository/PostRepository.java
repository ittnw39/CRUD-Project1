package com.elice.boardproject.post.repository;

import com.elice.boardproject.post.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    void deleteById(Long id);

    // 게시판 ID에 따라 게시글 목록을 찾는 메소드
    List<Post> findByBoardId(Long boardId);

    Page<Post> findAllByBoardId(Long boardId, Pageable pageable);

    List<Post> findByTaggedCosmeticId(Long cosmeticId);

    Page<Post> findByTaggedCosmeticId(Long cosmeticId, Pageable pageable);
}
