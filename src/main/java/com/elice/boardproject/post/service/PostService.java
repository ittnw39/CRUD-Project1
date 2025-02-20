package com.elice.boardproject.post.service;

import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.post.dto.PostRequestDto;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.repository.PostRepository;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import com.elice.boardproject.cosmetic.entity.Cosmetic;
import com.elice.boardproject.cosmetic.repository.CosmeticRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CosmeticRepository cosmeticRepository;

    // 게시물 목록 조회 (페이징)
    public Page<Post> findAll(Pageable pageable) {
        return postRepository.findAll(pageable);
    }

    // 게시물 상세 조회
    public Post findById(Long id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
    }

    // 태그된 화장품별 게시물 조회
    public Page<Post> findByTaggedCosmeticId(Long cosmeticId, Pageable pageable) {
        return postRepository.findByTaggedCosmeticId(cosmeticId, pageable);
    }

    // 게시물 생성
    @Transactional
    public Post create(PostRequestDto requestDto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        Board board = boardRepository.findById(requestDto.getBoardId())
                .orElseThrow(() -> new EntityNotFoundException("Board not found"));

        Cosmetic cosmetic = cosmeticRepository.findById(requestDto.getTaggedCosmeticId())
                .orElseThrow(() -> new EntityNotFoundException("Cosmetic not found"));

        Post post = new Post();
        post.setUser(user);
        post.setBoard(board);
        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setTaggedCosmetic(cosmetic);

        board.incrementPostCount();
        return postRepository.save(post);
    }

    // 게시물 수정
    @Transactional
    public Post update(Long postId, PostRequestDto requestDto, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        // 작성자 확인
        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to update this post");
        }

        Cosmetic cosmetic = cosmeticRepository.findById(requestDto.getTaggedCosmeticId())
                .orElseThrow(() -> new EntityNotFoundException("Cosmetic not found"));

        post.setTitle(requestDto.getTitle());
        post.setContent(requestDto.getContent());
        post.setTaggedCosmetic(cosmetic);

        return postRepository.save(post);
    }

    // 게시물 삭제
    @Transactional
    public void delete(Long postId, Long userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));

        // 작성자 확인
        if (!post.getUser().getId().equals(userId)) {
            throw new IllegalStateException("Not authorized to delete this post");
        }

        post.getBoard().decrementPostCount();
        postRepository.delete(post);
    }
}