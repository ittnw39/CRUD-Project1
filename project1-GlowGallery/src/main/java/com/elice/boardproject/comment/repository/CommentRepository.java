package com.elice.boardproject.comment.repository;


import com.elice.boardproject.comment.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    void deleteById(Long id);

    Optional<Comment> findById(Long id);

    List<Comment> findAllByPostId(Long id);

}
