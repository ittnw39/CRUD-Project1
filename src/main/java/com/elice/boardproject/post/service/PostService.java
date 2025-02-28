package com.elice.boardproject.post.service;

import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.common.exception.CustomException;
import com.elice.boardproject.common.exception.ErrorCode;
import com.elice.boardproject.common.service.FileService;
import com.elice.boardproject.post.dto.PostRequest;
import com.elice.boardproject.post.dto.PostResponse;
import com.elice.boardproject.post.dto.CosmeticInfo;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
    private static final Logger log = LoggerFactory.getLogger(PostService.class);

    public Page<PostResponse> getPostsByBoardId(Long boardId, Pageable pageable) {
        log.debug("게시글 목록 조회 시작 - boardId: {}, page: {}, size: {}", 
            boardId, pageable.getPageNumber(), pageable.getPageSize());
            
        Page<Post> posts = postRepository.findByBoardId(boardId, pageable);
        
        log.debug("조회된 게시글 수: {}, 총 페이지: {}", 
            posts.getNumberOfElements(), posts.getTotalPages());
            
        return posts.map(PostResponse::from);
    }

    public Page<PostResponse> getPostsByBoardIdAndType(Long boardId, PostType type, Pageable pageable) {
        log.debug("타입별 게시글 목록 조회 시작 - boardId: {}, type: {}, page: {}, size: {}", 
            boardId, type, pageable.getPageNumber(), pageable.getPageSize());
            
        Page<Post> posts = postRepository.findByBoardIdAndPostType(boardId, type, pageable);
        
        log.debug("조회된 게시글 수: {}, 총 페이지: {}", 
            posts.getNumberOfElements(), posts.getTotalPages());
            
        return posts.map(PostResponse::from);
    }

    public Page<PostResponse> searchPostsByBoardId(Long boardId, String search, Pageable pageable) {
        log.debug("게시글 검색 시작 - boardId: {}, search: {}, page: {}, size: {}", 
            boardId, search, pageable.getPageNumber(), pageable.getPageSize());
            
        Page<Post> posts = postRepository.searchByBoardId(boardId, search, pageable);
        
        log.debug("검색된 게시글 수: {}, 총 페이지: {}", 
            posts.getNumberOfElements(), posts.getTotalPages());
            
        return posts.map(post -> {
            PostResponse response = PostResponse.from(post);
            log.debug("변환된 게시글 정보 - id: {}, title: {}, type: {}", 
                post.getId(), post.getTitle(), post.getPostType());
            return response;
        });
    }

    public Page<PostResponse> searchPostsByBoardIdAndType(Long boardId, PostType type, String search, Pageable pageable) {
        log.debug("타입별 게시글 검색 시작 - boardId: {}, type: {}, search: {}, page: {}, size: {}", 
            boardId, type, search, pageable.getPageNumber(), pageable.getPageSize());
            
        Page<Post> posts = postRepository.searchByBoardIdAndType(boardId, type, search, pageable);
        
        log.debug("검색된 게시글 수: {}, 총 페이지: {}", 
            posts.getNumberOfElements(), posts.getTotalPages());
            
        return posts.map(post -> {
            PostResponse response = PostResponse.from(post);
            log.debug("변환된 게시글 정보 - id: {}, title: {}, type: {}", 
                post.getId(), post.getTitle(), post.getPostType());
            return response;
        });
    }

    public PostResponse getPost(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));
        post.incrementViewCount();
        return PostResponse.from(postRepository.save(post));
    }

    private void checkNoticePermission(User user, PostType postType) {
        if (postType == PostType.NOTICE && !user.isAdmin()) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }
    }

    @Transactional
    public PostResponse createPost(PostRequest request, List<MultipartFile> images, String email) {
        log.debug("게시글 생성 시작 - 요청 데이터: {}", request);
        
        if (request.getBoardId() == null) {
            log.error("게시판 ID가 누락되었습니다.");
            throw new CustomException(ErrorCode.INVALID_REQUEST);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("사용자를 찾을 수 없음: {}", email);
                    return new CustomException(ErrorCode.USER_NOT_FOUND);
                });
        log.debug("게시글 작성자 정보: {}", user.getId());

        checkNoticePermission(user, request.getPostType());

        // REVIEW 타입인 경우 화장품 정보 필수 체크
        if (PostType.REVIEW.equals(request.getPostType()) && request.getCosmeticInfo() == null) {
            log.error("리뷰 작성 시 화장품 정보가 누락되었습니다.");
            throw new CustomException(ErrorCode.COSMETIC_NOT_SELECTED);
        }

        Board board = boardRepository.findById(request.getBoardId())
                .orElseThrow(() -> {
                    log.error("게시판을 찾을 수 없음: {}", request.getBoardId());
                    return new CustomException(ErrorCode.BOARD_NOT_FOUND);
                });
        log.debug("게시판 정보: {}", board.getId());

        // 화장품 처리 (리뷰인 경우)
        Cosmetic cosmetic = null;
        if (PostType.REVIEW.equals(request.getPostType()) && request.getCosmeticInfo() != null) {
            CosmeticInfo info = request.getCosmeticInfo();
            
            // 화장품 카테고리 필수값 검증
            if (info.getCosmeticType() == null) {
                log.error("화장품 카테고리가 누락되었습니다.");
                throw new CustomException(ErrorCode.INVALID_REQUEST);
            }
            
            // 이미 등록된 화장품인지 확인
            cosmetic = cosmeticRepository.findByCosmeticReportSeq(info.getCosmeticReportSeq())
                    .orElseGet(() -> {
                        // 새로운 화장품 정보 저장
                        Cosmetic newCosmetic = new Cosmetic();
                        newCosmetic.setCosmeticReportSeq(info.getCosmeticReportSeq());
                        newCosmetic.setItemName(info.getItemName());
                        newCosmetic.setEntpName(info.getEntpName());
                        newCosmetic.setReportFlagName(info.getReportFlagName());
                        newCosmetic.setItemPh(info.getItemPh());
                        newCosmetic.setCosmeticStdName(info.getCosmeticStdName());
                        newCosmetic.setSpf(info.getSpf());
                        newCosmetic.setPa(info.getPa());
                        newCosmetic.setUsageDosage(info.getUsageDosage());
                        newCosmetic.setEffectYn1(info.getEffectYn1());
                        newCosmetic.setEffectYn2(info.getEffectYn2());
                        newCosmetic.setEffectYn3(info.getEffectYn3());
                        newCosmetic.setWaterProofingName(info.getWaterProofingName());
                        return cosmeticRepository.save(newCosmetic);
                    });

            // 카테고리가 없는 경우에만 업데이트
            if (cosmetic.getCosmeticType() == null) {
                cosmetic.setCosmeticType(info.getCosmeticType());
                cosmetic = cosmeticRepository.save(cosmetic);
                log.info("화장품 카테고리 업데이트: {} -> {}", cosmetic.getItemName(), info.getCosmeticType());
            }
            
            log.debug("화장품 정보: {}", cosmetic.getId());
            
            // 리뷰 중복 검사
            boolean exists = postRepository.existsByUserAndCosmeticAndPostType(
                user, cosmetic, PostType.REVIEW);
            if (exists) {
                log.error("이미 작성한 리뷰가 존재합니다. 사용자: {}, 화장품: {}", user.getId(), cosmetic.getId());
                throw new CustomException(ErrorCode.DUPLICATE_REVIEW);
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

        log.debug("생성된 게시글 정보 - postType: {}, cosmeticId: {}", post.getPostType(), 
            post.getCosmetic() != null ? post.getCosmetic().getId() : "null");

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
        Post savedPost = postRepository.save(post);
        log.debug("저장된 게시글 정보 - id: {}, cosmeticId: {}", 
            savedPost.getId(), 
            savedPost.getCosmetic() != null ? savedPost.getCosmetic().getId() : "null");
            
        return PostResponse.from(savedPost);
    }

    @Transactional
    public PostResponse updatePost(Long postId, PostRequest request, List<MultipartFile> images, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        checkNoticePermission(user, post.getPostType());
        
        if (!post.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        // 화장품 정보 업데이트 (리뷰인 경우)
        if (PostType.REVIEW.equals(request.getPostType()) && request.getCosmeticInfo() != null) {
            CosmeticInfo info = request.getCosmeticInfo();
            
            // 화장품 카테고리 필수값 검증
            if (info.getCosmeticType() == null) {
                log.error("화장품 카테고리가 누락되었습니다.");
                throw new CustomException(ErrorCode.INVALID_REQUEST);
            }
            
            // 이미 등록된 화장품인지 확인
            Cosmetic cosmetic = cosmeticRepository.findByCosmeticReportSeq(info.getCosmeticReportSeq())
                    .orElseGet(() -> {
                        // 새로운 화장품 정보 저장
                        Cosmetic newCosmetic = new Cosmetic();
                        newCosmetic.setCosmeticReportSeq(info.getCosmeticReportSeq());
                        newCosmetic.setItemName(info.getItemName());
                        newCosmetic.setEntpName(info.getEntpName());
                        newCosmetic.setReportFlagName(info.getReportFlagName());
                        newCosmetic.setItemPh(info.getItemPh());
                        newCosmetic.setCosmeticStdName(info.getCosmeticStdName());
                        newCosmetic.setSpf(info.getSpf());
                        newCosmetic.setPa(info.getPa());
                        newCosmetic.setUsageDosage(info.getUsageDosage());
                        newCosmetic.setEffectYn1(info.getEffectYn1());
                        newCosmetic.setEffectYn2(info.getEffectYn2());
                        newCosmetic.setEffectYn3(info.getEffectYn3());
                        newCosmetic.setWaterProofingName(info.getWaterProofingName());
                        return cosmeticRepository.save(newCosmetic);
                    });
            
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
    public void deletePost(Long postId, String email) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        checkNoticePermission(user, post.getPostType());
        
        if (!post.getUser().getId().equals(user.getId()) && !user.isAdmin()) {
            throw new CustomException(ErrorCode.ACCESS_DENIED);
        }

        // 이미지 파일 삭제
        post.getImages().forEach(image -> fileService.deleteFile(image.getFileUrl()));
        
        // 태그 관계 제거
        new ArrayList<>(post.getTags()).forEach(post::removeTag);

        if (post.getBoard() != null) {
            post.getBoard().decrementPostCount();
        }
        
        postRepository.delete(post);
    }
}