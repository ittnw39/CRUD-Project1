# GlowGallery(글로우 갤러리) - 화장품 리뷰 커뮤니티 플랫폼

화장품 리뷰와 정보를 공유하는 커뮤니티 플랫폼으로, 사용자들이 화장품에 대한 리뷰를 작성하고 의견을 나눌 수 있습니다. 공공 API를 활용하여 화장품 정보를 제공하며, 카테고리별 게시판과 리뷰 시스템을 통해 사용자 간 활발한 소통이 가능합니다.

---

## 프로젝트 데모

### 1. 메인 화면 및 게시판
<div align="center">
  <img src="screenshots/main.png" alt="메인 화면 데모" width="800"/>
</div>

- 카테고리별 게시판 구성
- 최신 리뷰 및 인기 게시글 표시
- 화장품 검색 기능

### 2. 리뷰 시스템
<div align="center">
  <img src="screenshots/review.png" alt="리뷰 시스템 데모" width="800"/>
</div>

- 별점 평가 시스템 (1-5점)
  - 화장품별 평균 별점
  - 별점 분포 통계
  - 전체 리뷰 수 집계
- 상세한 리뷰 작성 기능
  - 리뷰 내용 작성 (최대 1000자)
  - 한 화장품당 한 개의 리뷰만 작성 가능
- 리뷰 관리 기능
  - 자신의 리뷰 조회/수정/삭제
  - 화장품별 리뷰 목록 조회

### 3. 화장품 정보
<div align="center">
  <img src="screenshots/product.png" alt="화장품 정보 데모" width="800"/>
</div>

- 공공 API 연동
- 상세 제품 정보 제공
- 관련 리뷰 모아보기

---

## 기술 스택
### 언어 및 프레임워크
![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)

### 보안 및 인증
![Spring Security](https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=spring-security&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2-2F2F2F?style=for-the-badge&logo=oauth&logoColor=white)

### 개발 도구
![IntelliJ IDEA](https://img.shields.io/badge/IntelliJ_IDEA-000000?style=for-the-badge&logo=intellij-idea&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Gradle](https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white)

---

## 주요 기능

### 💄 화장품 정보
- 공공 API를 활용한 화장품 정보 검색
- 제품 상세 정보 조회
- 카테고리별 제품 분류

### ⭐ 리뷰 시스템
- 화장품 리뷰 작성 및 평점 부여
- 사진 첨부 기능
- 리뷰 추천 시스템

### 🗨️ 커뮤니티
- 카테고리별 게시판
- 댓글 시스템
- 게시글 태그 기능

### 👤 사용자 관리
- JWT 기반 인증
- OAuth2.0 소셜 로그인
- 프로필 관리

---

## 프로젝트 구조

```
src
├── main
│   ├── java
│   │   └── com.elice.boardproject
│   │       ├── board
│   │       ├── comment
│   │       ├── cosmetic
│   │       ├── post
│   │       ├── review
│   │       ├── security
│   │       └── user
│   └── resources
│       ├── static
│       └── templates
└── test
    └── java
        └── com.elice.boardproject
```

---

## API 구조

> 아래는 실제 구현된 API 구조입니다.

<details>
<summary><b>📥 API 엔드포인트 상세 보기</b></summary>

### 인증 관련 (/api/auth/**)
- POST /api/auth/signup - 회원가입
- POST /api/auth/login - 로그인
- POST /api/auth/refresh - 토큰 갱신

### 게시판 관련 (/api/boards/**)
- GET /api/boards - 게시판 목록
- POST /api/boards - 게시판 생성
- PUT /api/boards/{id} - 게시판 수정
- DELETE /api/boards/{id} - 게시판 삭제

### 게시글 관련 (/api/posts/**)
- GET /api/posts - 게시글 목록
- POST /api/posts - 게시글 작성
- PUT /api/posts/{id} - 게시글 수정
- DELETE /api/posts/{id} - 게시글 삭제

### 리뷰 관련 (/api/reviews/**)
- POST /api/reviews - 리뷰 작성
- GET /api/reviews/{reviewId} - 리뷰 상세 조회
- GET /api/reviews/cosmetic/{cosmeticId} - 화장품별 리뷰 목록
- GET /api/reviews/my - 내 리뷰 목록
- PUT /api/reviews/{reviewId} - 리뷰 수정
- DELETE /api/reviews/{reviewId} - 리뷰 삭제
- GET /api/reviews/cosmetic/{cosmeticId}/stats - 화장품 별점 통계

</details>

---

## 설치 및 실행

1. 저장소 클론
```bash
git clone https://github.com/ittnw39/CRUD-Project1.git
```

2. 환경변수 설정
다음 환경변수들을 설정해야 합니다:
```properties
# Database Configuration
DB_URL=jdbc:mysql://localhost:3306/glowgallery
DB_USERNAME=your_username
DB_PASSWORD=your_password

# API Configuration
COSMETIC_API_BASE_URL=api_url
COSMETIC_API_KEY=your_api_key

# Security Configuration
JWT_SECRET=your_jwt_secret
```

환경변수 설정 방법:
- IDE(IntelliJ)에서 실행 시: Run/Debug Configurations에서 환경변수 설정
- 서버 배포 시: 서버의 환경변수로 설정
- 로컬 개발 시: application-local.yml 파일 생성 (gitignore에 포함됨)

3. 프로젝트 실행
```bash
./gradlew bootRun
```

4. 접속
- 웹 브라우저에서 http://localhost:8080 접속 