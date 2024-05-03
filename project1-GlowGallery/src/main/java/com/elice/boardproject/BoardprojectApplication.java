package com.elice.boardproject;

import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.comment.repository.CommentRepository;
import com.elice.boardproject.post.repository.PostRepository;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Profile;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EntityScan(basePackages = {"com.elice.boardproject.board.entity", "com.elice.boardproject.post.entity", "com.elice.boardproject.comment.entity"})
public class BoardprojectApplication {

	public static void main(String[] args) {
		SpringApplication.run(BoardprojectApplication.class, args);
	}

//	@Bean
//	@Profile("local")
//	public DataInit stubDataInit(BoardRepository boardRepository, PostRepository postRepository, CommentRepository commentRepository) {
//		return new DataInit(boardRepository, postRepository, commentRepository);
//	}

}
