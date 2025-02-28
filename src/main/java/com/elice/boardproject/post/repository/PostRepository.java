package com.elice.boardproject.post.repository;

import com.elice.boardproject.cosmetic.entity.Cosmetic;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.entity.PostType;
import com.elice.boardproject.user.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    void deleteById(Long id);

    // 게시판 ID에 따라 게시글 목록을 찾는 메소드 (페이지네이션)
    @Query(value = "SELECT p FROM Post p " +
           "WHERE p.board.id = :boardId " +
           "ORDER BY p.createdAt DESC",
           countQuery = "SELECT COUNT(p) FROM Post p WHERE p.board.id = :boardId")
    Page<Post> findByBoardId(@Param("boardId") Long boardId, Pageable pageable);

    // 게시판 ID와 타입으로 게시글 검색 (페이지네이션)
    @Query(value = "SELECT p FROM Post p " +
           "WHERE p.board.id = :boardId AND p.postType = :postType " +
           "ORDER BY p.createdAt DESC",
           countQuery = "SELECT COUNT(p) FROM Post p WHERE p.board.id = :boardId AND p.postType = :postType")
    Page<Post> findByBoardIdAndPostType(@Param("boardId") Long boardId, 
                                       @Param("postType") PostType postType, 
                                       Pageable pageable);
    
    // 게시판 ID와 검색어로 게시글 검색 (제목, 내용, 태그 포함)
    @Query(value = "SELECT DISTINCT p FROM Post p " +
           "LEFT JOIN p.tags t " +
           "WHERE p.board.id = :boardId " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))",
           countQuery = "SELECT COUNT(DISTINCT p) FROM Post p " +
           "LEFT JOIN p.tags t " +
           "WHERE p.board.id = :boardId " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Post> searchByBoardId(@Param("boardId") Long boardId, 
                              @Param("search") String search,
                              Pageable pageable);

    // 게시판 ID, 타입, 검색어로 게시글 검색
    @Query(value = "SELECT DISTINCT p FROM Post p " +
           "LEFT JOIN p.tags t " +
           "WHERE p.board.id = :boardId " +
           "AND p.postType = :postType " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))",
           countQuery = "SELECT COUNT(DISTINCT p) FROM Post p " +
           "LEFT JOIN p.tags t " +
           "WHERE p.board.id = :boardId " +
           "AND p.postType = :postType " +
           "AND (LOWER(p.title) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(p.content) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(t.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Post> searchByBoardIdAndType(@Param("boardId") Long boardId,
                                     @Param("postType") PostType postType,
                                     @Param("search") String search,
                                     Pageable pageable);

    List<Post> findByBoardId(Long boardId);

    Page<Post> findAllByBoardId(Long boardId, Pageable pageable);

    List<Post> findByCosmeticId(Long cosmeticId);

    Page<Post> findByCosmeticId(Long cosmeticId, Pageable pageable);

    Page<Post> findByUserId(Long userId, Pageable pageable);

    boolean existsByUserAndCosmeticAndPostType(User user, Cosmetic cosmetic, PostType postType);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.cosmetic.id = :cosmeticId AND p.postType = 'REVIEW'")
    long countReviewsByCosmeticId(@Param("cosmeticId") Long cosmeticId);

    @Query("SELECT AVG(p.rating) FROM Post p WHERE p.cosmetic.id = :cosmeticId AND p.postType = 'REVIEW'")
    Double getAverageRatingByCosmeticId(@Param("cosmeticId") Long cosmeticId);

    @Query("SELECT COUNT(p) FROM Post p WHERE p.cosmetic.id = :cosmeticId AND p.rating = :rating AND p.postType = 'REVIEW'")
    Long countByRatingAndCosmeticId(@Param("rating") Integer rating, @Param("cosmeticId") Long cosmeticId);

    // 게시판 통계
    @Query("SELECT COUNT(p) FROM Post p WHERE p.board.id = :boardId")
    long countByBoardId(@Param("boardId") Long boardId);

    @Query("SELECT SUM(p.viewCount) FROM Post p WHERE p.board.id = :boardId")
    Long getTotalViewsByBoardId(@Param("boardId") Long boardId);

    @Query("SELECT COUNT(c) FROM Post p JOIN p.comments c WHERE p.board.id = :boardId")
    Long getTotalCommentsByBoardId(@Param("boardId") Long boardId);

    // 태그로 게시글 검색
    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t WHERE t.name = :tagName")
    Page<Post> findByTagName(@Param("tagName") String tagName, Pageable pageable);

    // 태그로 게시글 검색 (게시판별)
    @Query("SELECT DISTINCT p FROM Post p JOIN p.tags t WHERE p.board.id = :boardId AND t.name = :tagName")
    Page<Post> findByBoardIdAndTagName(@Param("boardId") Long boardId, @Param("tagName") String tagName, Pageable pageable);
}
