package com.elice.boardproject.comment.service;

import com.elice.boardproject.comment.dto.CommentRequestDto;
import com.elice.boardproject.comment.entity.Comment;
import com.elice.boardproject.comment.repository.CommentRepository;
import com.elice.boardproject.common.exception.CustomException;
import com.elice.boardproject.common.exception.ErrorCode;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.repository.PostRepository;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    // 게시글별 댓글 조회
    public List<Comment> findByPostId(Long postId) {
        return commentRepository.findByPostIdOrderByCreatedAtDesc(postId);
    }

    // 댓글 생성
    @Transactional
    public Comment create(CommentRequestDto requestDto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Post post = postRepository.findById(requestDto.getPostId())
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        Comment comment = new Comment();
        comment.setUser(user);
        comment.setPost(post);
        comment.setContent(requestDto.getContent());
        comment.setAuthorComment(post.getUser().getId().equals(user.getId()));

        if (requestDto.getParentId() != null) {
            Comment parent = commentRepository.findById(requestDto.getParentId())
                    .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));
            
            // 삭제된 댓글에는 대댓글을 달 수 없음
            if (parent.isDeleted()) {
                throw new CustomException(ErrorCode.COMMENT_NOT_FOUND);
            }
            
            comment.setParent(parent);
            parent.addReply(comment);
        }

        return commentRepository.save(comment);
    }

    // 댓글 수정
    @Transactional
    public Comment update(Long commentId, CommentRequestDto requestDto, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new CustomException(ErrorCode.NOT_COMMENT_OWNER);
        }

        if (comment.isDeleted()) {
            throw new CustomException(ErrorCode.COMMENT_NOT_FOUND);
        }

        comment.setContent(requestDto.getContent());
        return commentRepository.save(comment);
    }

    // 댓글 삭제
    @Transactional
    public void delete(Long commentId, String email) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new CustomException(ErrorCode.COMMENT_NOT_FOUND));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new CustomException(ErrorCode.NOT_COMMENT_OWNER);
        }

        // 이미 삭제된 댓글인 경우
        if (comment.isDeleted()) {
            throw new CustomException(ErrorCode.COMMENT_NOT_FOUND);
        }

        // 대댓글이 있거나 자신이 대댓글인 경우 소프트 삭제
        if (!comment.getReplies().isEmpty() || comment.getParent() != null) {
            comment.softDelete();
        } else {
            // 대댓글이 없는 경우 하드 삭제
            commentRepository.delete(comment);
        }
    }
}
