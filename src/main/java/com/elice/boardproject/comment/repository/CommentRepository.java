package com.elice.boardproject.comment.repository;

import com.elice.boardproject.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    // 게시글별 댓글 목록 조회 (대댓글 제외, 최신순)
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.parent IS NULL ORDER BY c.createdAt DESC")
    List<Comment> findByPostIdOrderByCreatedAtDesc(@Param("postId") Long postId);

    // 게시글별 전체 댓글 수 조회 (대댓글 포함)
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.post.id = :postId")
    Long countByPostId(@Param("postId") Long postId);

    // 특정 사용자의 댓글 목록 조회
    List<Comment> findByUserIdOrderByCreatedAtDesc(Long userId);

    // 특정 댓글의 대댓글 목록 조회
    List<Comment> findByParentIdOrderByCreatedAtAsc(Long parentId);

    // 삭제되지 않은 댓글만 조회
    @Query("SELECT c FROM Comment c WHERE c.post.id = :postId AND c.deleted = false ORDER BY c.createdAt DESC")
    List<Comment> findActiveCommentsByPostId(@Param("postId") Long postId);
}
