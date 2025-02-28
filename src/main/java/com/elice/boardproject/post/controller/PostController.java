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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;
    private static final Logger log = LoggerFactory.getLogger(PostController.class);

    @GetMapping("/boards/{boardId}/posts")
    public ResponseEntity<Page<PostResponse>> getPosts(
            @PathVariable(name = "boardId") Long boardId,
            @RequestParam(name = "type", required = false) PostType type,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "12") int size,
            @RequestParam(name = "sort", defaultValue = "createdAt") String sort,
            @RequestParam(name = "direction", defaultValue = "desc") String direction
    ) {
        log.debug("게시글 목록 조회 요청 - boardId: {}, type: {}, search: {}", boardId, type, search);
        
        Sort.Direction sortDirection = Sort.Direction.fromString(direction);
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sort));
        
        Page<PostResponse> posts;
        try {
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
            
            log.debug("게시글 목록 조회 완료 - 총 게시글 수: {}", posts.getTotalElements());
            return ResponseEntity.ok(posts);
        } catch (Exception e) {
            log.error("게시글 목록 조회 중 오류 발생", e);
            throw e;
        }
    }

    @GetMapping("/posts/{postId}")
    public ResponseEntity<PostResponse> getPost(
            @PathVariable(name = "postId") Long postId
    ) {
        log.debug("게시글 상세 조회 요청 - postId: {}", postId);
        try {
            PostResponse response = postService.getPost(postId);
            log.debug("게시글 상세 조회 완료 - postId: {}", postId);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("게시글 상세 조회 중 오류 발생", e);
            throw e;
        }
    }

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> createPost(
            @RequestPart(name = "request") PostRequest request,
            @RequestPart(name = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal String email
    ) {
        log.debug("게시글 생성 요청 시작");
        log.debug("이메일: {}", email);
        log.debug("요청 데이터: {}", request);
        if (images != null) {
            log.debug("이미지 개수: {}", images.size());
            images.forEach(image -> 
                log.debug("이미지 정보 - 파일명: {}, 크기: {}, 타입: {}", 
                    image.getOriginalFilename(), 
                    image.getSize(), 
                    image.getContentType())
            );
        }
        
        try {
            PostResponse response = postService.createPost(request, images, email);
            log.debug("게시글 생성 완료 - 게시글 ID: {}", response.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("게시글 생성 중 오류 발생", e);
            throw e;
        }
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable(name = "postId") Long postId,
            @RequestPart(name = "request") PostRequest request,
            @RequestPart(name = "images", required = false) List<MultipartFile> images,
            @AuthenticationPrincipal String email
    ) {
        log.debug("게시글 수정 요청 시작");
        log.debug("게시글 ID: {}, 이메일: {}", postId, email);
        log.debug("요청 데이터: {}", request);
        if (images != null) {
            log.debug("이미지 개수: {}", images.size());
            images.forEach(image -> 
                log.debug("이미지 정보 - 파일명: {}, 크기: {}, 타입: {}", 
                    image.getOriginalFilename(), 
                    image.getSize(), 
                    image.getContentType())
            );
        }
        
        try {
            PostResponse response = postService.updatePost(postId, request, images, email);
            log.debug("게시글 수정 완료 - 게시글 ID: {}", response.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("게시글 수정 중 오류 발생", e);
            throw e;
        }
    }

    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<Void> deletePost(
            @PathVariable(name = "postId") Long postId,
            @AuthenticationPrincipal String email
    ) {
        postService.deletePost(postId, email);
        return ResponseEntity.ok().build();
    }
}
