package com.elice.boardproject.post.controller;

import com.elice.boardproject.post.dto.PostRequestDto;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    // 게시물 목록 조회 (페이징)
    @GetMapping
    public ResponseEntity<Page<Post>> getPosts(@PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(postService.findAll(pageable));
    }

    // 게시물 상세 조회
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(postService.findById(id));
    }

    // 화장품별 게시물 조회
    @GetMapping("/cosmetic/{cosmeticId}")
    public ResponseEntity<Page<Post>> getPostsByCosmetic(
            @PathVariable Long cosmeticId,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(postService.findByTaggedCosmeticId(cosmeticId, pageable));
    }

    // 게시물 생성
    @PostMapping
    public ResponseEntity<Post> createPost(
            @Valid @RequestBody PostRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        return ResponseEntity.ok(postService.create(requestDto, userId));
    }

    // 게시물 수정
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(
            @PathVariable Long id,
            @Valid @RequestBody PostRequestDto requestDto,
            @RequestHeader("X-USER-ID") Long userId) {
        return ResponseEntity.ok(postService.update(id, requestDto, userId));
    }

    // 게시물 삭제
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(
            @PathVariable Long id,
            @RequestHeader("X-USER-ID") Long userId) {
        postService.delete(id, userId);
        return ResponseEntity.ok().build();
    }
}
