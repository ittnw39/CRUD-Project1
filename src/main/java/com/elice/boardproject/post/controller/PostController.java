package com.elice.boardproject.post.controller;

import com.elice.boardproject.post.dto.PostRequest;
import com.elice.boardproject.post.dto.PostResponse;
import com.elice.boardproject.post.entity.PostType;
import com.elice.boardproject.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @GetMapping("/boards/{boardId}/posts")
    public ResponseEntity<Page<PostResponse>> getPosts(
            @PathVariable Long boardId,
            @RequestParam(required = false) PostType type,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sort,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<PostResponse> posts;
        if (search != null && !search.trim().isEmpty()) {
            if (type != null) {
                posts = postService.searchPostsByBoardIdAndType(boardId, type, search, pageable);
            } else {
                posts = postService.searchPostsByBoardId(boardId, search, pageable);
            }
        } else if (type != null) {
            posts = postService.getPostsByBoardIdAndType(boardId, type, pageable);
        } else {
            posts = postService.getPostsByBoardId(boardId, pageable);
        }
        
        return ResponseEntity.ok(posts);
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPost(postId));
    }

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> createPost(
            @RequestPart PostRequest request,
            @RequestPart(required = false) List<MultipartFile> images
    ) {
        return ResponseEntity.ok(postService.createPost(request, images));
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long postId,
            @RequestPart PostRequest request,
            @RequestPart(required = false) List<MultipartFile> images
    ) {
        return ResponseEntity.ok(postService.updatePost(postId, request, images));
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok().build();
    }
}
