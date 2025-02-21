package com.elice.boardproject.post.service;

import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.common.exception.CustomException;
import com.elice.boardproject.common.exception.ErrorCode;
import com.elice.boardproject.common.service.FileService;
import com.elice.boardproject.post.dto.PostRequest;
import com.elice.boardproject.post.dto.PostResponse;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.entity.PostImage;
import com.elice.boardproject.post.entity.PostType;
import com.elice.boardproject.post.repository.PostRepository;
import com.elice.boardproject.tag.entity.Tag;
import com.elice.boardproject.tag.repository.TagRepository;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import com.elice.boardproject.cosmetic.entity.Cosmetic;
import com.elice.boardproject.cosmetic.repository.CosmeticRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class PostService {
    private final PostRepository postRepository;
    private final BoardRepository boardRepository;
    private final UserRepository userRepository;
    private final CosmeticRepository cosmeticRepository;
    private final TagRepository tagRepository;
    private final FileService fileService;

    public Page<PostResponse> getPostsByBoardId(Long boardId, Pageable pageable) {
        return postRepository.findByBoardId(boardId, pageable)
                .map(PostResponse::from);
    }

    public Page<PostResponse> getPostsByBoardIdAndType(Long boardId, PostType type, Pageable pageable) {
        return postRepository.findByBoardIdAndPostType(boardId, type, pageable)
                .map(PostResponse::from);
    }

    public Page<PostResponse> searchPostsByBoardId(Long boardId, String search, Pageable pageable) {
        return postRepository.searchByBoardId(boardId, search, pageable)
                .map(PostResponse::from);
    }

    public Page<PostResponse> searchPostsByBoardIdAndType(Long boardId, PostType type, String search, Pageable pageable) {
        return postRepository.searchByBoardIdAndType(boardId, type, search, pageable)
                .map(PostResponse::from);
    }

    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        post.incrementViewCount();
        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public PostResponse createPost(PostRequest request, List<MultipartFile> images) {
        User user = getCurrentUser();
        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));

        // 화장품 조회 (리뷰인 경우에만)
        Cosmetic cosmetic = null;
        if (request.getCosmeticId() != null) {
            cosmetic = cosmeticRepository.findById(request.getCosmeticId())
                    .orElseThrow(() -> new CustomException(ErrorCode.COSMETIC_NOT_FOUND));
            
            // 리뷰 중복 검사
            if (request.getPostType() == PostType.REVIEW) {
                boolean exists = postRepository.existsByUserAndCosmeticAndPostType(
                    user, cosmetic, PostType.REVIEW);
                if (exists) {
                    throw new CustomException(ErrorCode.DUPLICATE_REVIEW);
                }
            }
        }

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .postType(request.getPostType())
                .rating(request.getRating())
                .board(board)
                .user(user)
                .cosmetic(cosmetic)
                .build();

        // 이미지 처리
        if (images != null && !images.isEmpty()) {
            for (MultipartFile image : images) {
                String fileUrl = fileService.uploadFile(image);
                
                PostImage postImage = PostImage.builder()
                    .originalFileName(image.getOriginalFilename())
                    .storedFileName(fileUrl.substring(fileUrl.lastIndexOf("/") + 1))
                    .contentType(image.getContentType())
                    .fileSize(image.getSize())
                    .fileUrl(fileUrl)
                    .build();
                
                post.addImage(postImage);
            }
        }

        // 태그 처리
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            for (String tagName : request.getTags()) {
                final String finalTagName = tagName.startsWith("#") ? tagName.substring(1) : tagName;
                Tag tag = tagRepository.findByName(finalTagName)
                        .orElseGet(() -> tagRepository.save(new Tag(finalTagName)));
                post.addTag(tag);
            }
        }

        board.incrementPostCount();
        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request, List<MultipartFile> images) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        validatePostOwner(post);

        // 화장품 정보 업데이트 (리뷰인 경우)
        if (request.getCosmeticId() != null) {
            Cosmetic cosmetic = cosmeticRepository.findById(request.getCosmeticId())
                    .orElseThrow(() -> new CustomException(ErrorCode.COSMETIC_NOT_FOUND));
            post.setCosmetic(cosmetic);
        }

        post.update(request.getTitle(), request.getContent(), request.getRating());

        // 이미지 처리
        if (images != null && !images.isEmpty()) {
            // 기존 이미지 삭제
            post.getImages().forEach(image -> fileService.deleteFile(image.getFileUrl()));
            post.getImages().clear();

            // 새 이미지 추가
            for (MultipartFile image : images) {
                String fileUrl = fileService.uploadFile(image);
                
                PostImage postImage = PostImage.builder()
                    .originalFileName(image.getOriginalFilename())
                    .storedFileName(fileUrl.substring(fileUrl.lastIndexOf("/") + 1))
                    .contentType(image.getContentType())
                    .fileSize(image.getSize())
                    .fileUrl(fileUrl)
                    .build();
                
                post.addImage(postImage);
            }
        }

        // 태그 처리
        new ArrayList<>(post.getTags()).forEach(post::removeTag);
        if (request.getTags() != null && !request.getTags().isEmpty()) {
            for (String tagName : request.getTags()) {
                final String finalTagName = tagName.startsWith("#") ? tagName.substring(1) : tagName;
                Tag tag = tagRepository.findByName(finalTagName)
                        .orElseGet(() -> tagRepository.save(new Tag(finalTagName)));
                post.addTag(tag);
            }
        }

        return PostResponse.from(postRepository.save(post));
    }

    @Transactional
    public void deletePost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        validatePostOwner(post);

        // 이미지 파일 삭제
        post.getImages().forEach(image -> fileService.deleteFile(image.getFileUrl()));
        
        // 태그 관계 제거
        new ArrayList<>(post.getTags()).forEach(post::removeTag);

        if (post.getBoard() != null) {
            post.getBoard().decrementPostCount();
        }
        
        postRepository.delete(post);
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_USER);
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private void validatePostOwner(Post post) {
        User currentUser = getCurrentUser();
        if (!post.getUser().getId().equals(currentUser.getId())) {
            throw new CustomException(ErrorCode.NOT_POST_OWNER);
        }
    }
}