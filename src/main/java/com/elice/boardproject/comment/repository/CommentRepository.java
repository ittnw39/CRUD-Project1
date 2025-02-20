package com.elice.boardproject.comment.repository;

import com.elice.boardproject.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByReviewId(Long reviewId);
    List<Comment> findByReviewIdOrderByCreatedAtDesc(Long reviewId);
}
