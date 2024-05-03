package com.elice.boardproject.comment.service;

import com.elice.boardproject.comment.entity.Comment;
import com.elice.boardproject.comment.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;

    public List<Comment> findAllByPostId(Long id) {
        return commentRepository.findAllByPostId(id);
    }

    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    // 댓글 생성
    @Transactional
    public void save(Comment comment) {
        commentRepository.save(comment);

    }

    //댓글 수정
    @Transactional
    public Comment update(Comment comment) {
        commentRepository.save(comment);
        return comment;
    }

    //댓글 삭제
    @Transactional
    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

}
