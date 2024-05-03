package com.elice.boardproject.post.controller;

import com.elice.boardproject.comment.entity.Comment;
import com.elice.boardproject.comment.service.CommentService;
import com.elice.boardproject.post.dtos.PostRequestDto;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.service.PostService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.List;

@Controller
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    @Autowired
    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("/create")
    public String showCreateForm(@RequestParam("boardId") Long boardId, Model model) {
        model.addAttribute("boardId", boardId);
        return "post/createPost";
    }

    @GetMapping
    public String getAllPost(Model model) {
        List<Post> posts = postService.findAll();
        model.addAttribute("posts", posts);
        return "board/board";
    }

    @GetMapping("/{id}")
    public String getPostDetail(@PathVariable("id") Long id, Model model) {
        Post post = postService.findById(id);
        if (post == null || post.getBoard() == null) {  // post.board의 null 체크 추가
            return "redirect:/error/404";
        }
        List<Comment> comments = commentService.findAllByPostId(id);
        model.addAttribute("post", post);
        model.addAttribute("comments", comments);

        return "post/post";
    }

    @PostMapping("/create")
    public String createPost(@RequestParam("boardId") Long boardId, @ModelAttribute PostRequestDto postRequestDto) {
        Post post = new Post();
        post.setTitle(postRequestDto.getTitle());
        post.setContent(postRequestDto.getContent());
        post.setRatedStars(postRequestDto.getRatedStars());
        post.setPassword(postRequestDto.getPassword());
        postService.create(post, boardId);
        return "redirect:/boards/" + boardId;
    }
    // 게시글 수정을 위한 비밀번호 검증 후 리다이렉션
    @PostMapping("/{postId}/edit")
    public ResponseEntity<?> verifyPostPasswordAndRedirect(@PathVariable Long postId, @RequestBody PostRequestDto postRequestDto) {
        try {
             // 게시글 정보 조회
             Post post = postService.findById(postId);
              // 비밀번호 검증
             postService.validatePassword(post, postRequestDto.getPassword());
                // 비밀번호가 맞으면 수정 페이지로 리다이렉트 (프론트에서 처리)
             return ResponseEntity.ok().build();

            } catch (EntityNotFoundException e) {
                // 게시글을 찾을 수 없을 때
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("게시글을 찾을 수 없습니다.");
            } catch (IllegalArgumentException e) {
                // 비밀번호가 틀릴 때
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("비밀번호가 올바르지 않습니다.");
            } catch (Exception e) {
                // 그 외 예외 발생 시
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 내부 오류가 발생했습니다.");
            }
        }



    @GetMapping("/{id}/edit")
    public String showUpdateForm(@PathVariable("id") Long id, Model model) {

        Post post = postService.findById(id);

        if (post != null) {
            model.addAttribute("post", post);
            return "post/editPost";
        } else {
            return "redirect:/posts/" + id; // 게시글이 없을 경우 게시판으로 리다이렉션
        }
    }

    @PostMapping("/edit/{id}")
    public String updatePost(@PathVariable("id") Long postId, @ModelAttribute PostRequestDto postRequestDto, RedirectAttributes attributes) {
        try {
            postService.update(postId, postRequestDto);
            return "redirect:/posts/" + postId;
        } catch (IllegalArgumentException e) {
            attributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/posts/" + postId + "/edit";
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable("id") Long id, @RequestBody PostRequestDto postRequestDto) {
        try {
            postService.delete(id, postRequestDto.getPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }




}
