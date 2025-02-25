-- 관리자 계정 생성 (비밀번호: admin123)
INSERT INTO users (email, password, nickname, role, provider_type, created_at, updated_at)
VALUES ('admin@admin.com', '$2a$10$egsiy83qIKE3n5AyjV.6G.vzs5fX2.GHea5PAtaaIC3yhhNpnHfW.', '관리자', 'ADMIN', 'LOCAL', NOW(), NOW());

-- 게시판 생성
INSERT INTO boards (name, category, description, is_active, user_id, post_count, created_at, updated_at)
SELECT '일반 게시판', 'GENERAL', '자유롭게 소통하는 공간입니다.', true, user_id, 0, NOW(), NOW()
FROM users WHERE email = 'admin@admin.com';

INSERT INTO boards (name, category, description, is_active, user_id, post_count, created_at, updated_at)
SELECT '리뷰 게시판', 'REVIEW', '화장품 리뷰를 공유하는 공간입니다.', true, user_id, 0, NOW(), NOW()
FROM users WHERE email = 'admin@admin.com';

INSERT INTO boards (name, category, description, is_active, user_id, post_count, created_at, updated_at)
SELECT '공지사항', 'NOTICE', '중요한 공지사항을 확인하세요.', true, user_id, 0, NOW(), NOW()
FROM users WHERE email = 'admin@admin.com';

INSERT INTO boards (name, category, description, is_active, user_id, post_count, created_at, updated_at)
SELECT '질문 게시판', 'QNA', '화장품에 대해 궁금한 점을 질문하세요.', true, user_id, 0, NOW(), NOW()
FROM users WHERE email = 'admin@admin.com'; 