package com.elice.boardproject.comment.controller;

import ch.qos.logback.classic.Logger;
import com.elice.boardproject.comment.dtos.CommentRequestDto;
import com.elice.boardproject.comment.entity.Comment;
import com.elice.boardproject.comment.service.CommentService;
import com.elice.boardproject.post.entity.Post;
import com.elice.boardproject.post.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Optional;

@Controller
@RequiredArgsConstructor
@RequestMapping("/comments")
public class CommentController {

    private final CommentService commentService;
    private final PostService postService;
    private Logger logger;

    @PostMapping("/create")
    public String createComment(@RequestParam("postId") Long postId, CommentRequestDto commentRequestDto, RedirectAttributes redirectAttributes, Model model) {

        Comment comment = new Comment();
        Post post = postService.findById(postId);

        comment.setPost(post);
        comment.setId(commentRequestDto.getId());
        comment.setContent(commentRequestDto.getContent());
        comment.setCreatedAt(commentRequestDto.getCreatedAt());
        commentService.save(comment);

        model.addAttribute("comment", comment);

        redirectAttributes.addAttribute("id", postId);
        return "redirect:/posts/{id}";
    }

    @PostMapping("/update/{commentId}")
    public String updateComment(@PathVariable("commentId") Long commentId, RedirectAttributes redirectAttributes, CommentRequestDto commentRequestDto) {
        Optional<Comment> comment = commentService.findById(commentId);
        if (comment.isEmpty()) {
            return "redirect:/error/404";
        }

        comment.get().setContent(commentRequestDto.getContent());
        commentService.update(comment.orElse(null));

        redirectAttributes.addAttribute("id", comment.get().getPost().getId());
        return "redirect:/posts/{id}";
    }

    @DeleteMapping("/delete/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable("commentId") Long commentId) {
        try {
            commentService.delete(commentId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            // 예외 로깅
            logger.error("Error deleting comment: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


}
