package com.elice.boardproject.post.service;

import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.post.dtos.PostRequestDto;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.repository.PostRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;


    public Page<Post> findAllByBoardIdPaged(Long boardId, Pageable pageable) {
        // 게시글을 가져오고 페이징 처리
        return postRepository.findAllByBoardId(boardId, pageable);
    }

    public List<Post> findAll() {
        return postRepository.findAll();
    }


    public Post findById(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post with id " + postId + " not found"));
    }

    // 게시글 생성
    @Transactional
    public Post create(Post post, Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(() -> new RuntimeException("Board not found"));
        post.setBoard(board);
        return postRepository.save(post);
    }

    //비밀번호 검증
    public void validatePassword(Post post, String password) {
        if (!post.getPassword().equals(password)) {
            throw new IllegalArgumentException("비밀번호가 틀렸습니다.");
        }
    }


    // 게시글 수정
    @Transactional
    public void update(Long postId, PostRequestDto postRequestDto) {

        Post post = postRepository.findById(postId).orElseThrow(() -> new EntityNotFoundException("Post not found"));

        validatePassword(post, postRequestDto.getPassword());

        post.setTitle(postRequestDto.getTitle());
        post.setContent(postRequestDto.getContent());
        post.setRatedStars(postRequestDto.getRatedStars());

        postRepository.save(post);
    }

    // 게시글 삭제
    @Transactional
    public void delete(Long id, String password) {

        Post post = postRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Post not found"));

        validatePassword(post, password);
        postRepository.deleteById(id);
    }

}