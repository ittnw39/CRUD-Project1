package com.elice.boardproject.common.config;

import com.elice.boardproject.board.entity.Board;
import com.elice.boardproject.board.entity.BoardCategory;
import com.elice.boardproject.board.repository.BoardRepository;
import com.elice.boardproject.user.entity.ProviderType;
import com.elice.boardproject.user.entity.Role;
import com.elice.boardproject.user.entity.User;
import com.elice.boardproject.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final BoardRepository boardRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        // 관리자 계정 생성
        User admin = User.builder()
                .email("admin@admin.com")
                .password(passwordEncoder.encode("admin123"))
                .nickname("관리자")
                .role(Role.ADMIN)
                .providerType(ProviderType.LOCAL)
                .build();
        
        admin = userRepository.save(admin);

        // 게시판 생성
        createBoard("일반 게시판", BoardCategory.GENERAL, "자유롭게 소통하는 공간입니다.", admin);
        createBoard("리뷰 게시판", BoardCategory.REVIEW, "화장품 리뷰를 공유하는 공간입니다.", admin);
        createBoard("공지사항", BoardCategory.NOTICE, "중요한 공지사항을 확인하세요.", admin);
        createBoard("질문 게시판", BoardCategory.QNA, "화장품에 대해 궁금한 점을 질문하세요.", admin);
    }

    private void createBoard(String name, BoardCategory category, String description, User admin) {
        Board board = Board.builder()
                .name(name)
                .category(category)
                .description(description)
                .isActive(true)
                .user(admin)
                .postCount(0)
                .build();
        
        boardRepository.save(board);
    }
} 