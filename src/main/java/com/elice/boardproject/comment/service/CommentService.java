package com.elice.boardproject.comment.service;

import com.elice.boardproject.comment.dto.CommentRequestDto;
import com.elice.boardproject.comment.entity.Comment;
import com.elice.boardproject.comment.repository.CommentRepository;
import com.elice.boardproject.review.entity.Review;
import com.elice.boardproject.review.repository.ReviewRepository;
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
public class CommentService {

    private final CommentRepository commentRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // 리뷰별 댓글 조회
    public List<Comment> findByReviewId(Long reviewId) {
        return commentRepository.findByReviewIdOrderByCreatedAtDesc(reviewId);
    }

    // 댓글 생성
    @Transactional
    public Comment create(CommentRequestDto requestDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Review review = reviewRepository.findById(requestDto.getReviewId())
                .orElseThrow(() -> new EntityNotFoundException("Review not found"));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setReview(review);
        comment.setContent(requestDto.getContent());
        comment.setAuthorComment(review.getUser().getId().equals(userId));

        return commentRepository.save(comment);
    }

    // 댓글 수정
    @Transactional
    public Comment update(Long commentId, CommentRequestDto requestDto, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        // 댓글 작성자 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to update this comment");
        }

        comment.setContent(requestDto.getContent());
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    @Transactional
    public void delete(Long commentId, Long userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("Comment not found"));

        // 댓글 작성자 확인
        if (!comment.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to delete this comment");
        }

        commentRepository.delete(comment);
    }
}
