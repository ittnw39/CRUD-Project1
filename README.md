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
  - 리뷰당 여러 장의 이미지 첨부 가능
- 리뷰 관리 기능
  - 자신의 리뷰 조회/수정/삭제
  - 화장품별 리뷰 목록 조회
  - 리뷰 이미지 관리 (추가/삭제)

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
- 리뷰당 다중 이미지 업로드 기능
- 리뷰 추천 시스템
- 리뷰 이미지 관리 (추가/수정/삭제)

### 🗨️ 커뮤니티
- 카테고리별 게시판
- 댓글 시스템
- 게시글 태그 기능
  - 게시글 작성/수정 시 #태그 추가 가능
  - 태그를 통한 게시글 분류 및 검색
  - 동일 태그를 가진 게시글 모아보기
  - 태그 클릭 시 해당 태그가 포함된 게시글 목록 표시
- 사용자 탈퇴 후에도 게시글 및 리뷰 보존

### 👤 사용자 관리
- JWT 기반 인증
- OAuth2.0 소셜 로그인
- 프로필 관리

---

## 프로젝트 구조
```
src
├── main
│   ├── java/com/elice/boardproject
│   │   ├── board          # 게시판 관련 기능
│   │   ├── comment        # 댓글 관련 기능
│   │   ├── common         # 공통 유틸리티, 설정
│   │   ├── cosmetic       # 화장품 정보 관련 기능
│   │   ├── post           # 게시글 관련 기능
│   │   ├── security       # 보안 및 인증 관련
│   │   ├── tag           # 태그 관련 기능
│   │   └── user          # 사용자 관련 기능
│   └── resources
│       ├── frontend      # React 프론트엔드
│       └── application.yml
└── test                  # 테스트 코드
```

---

## API 구조

> 아래는 실제 구현된 API 구조입니다.

<details>
<summary><b>📥 API 엔드포인트 상세 보기</b></summary>

### 사용자 관련 (/api/users/**)
- POST /api/users/signup - 회원가입
- POST /api/users/login - 로그인
- GET /api/users/me - 내 정보 조회
- PUT /api/users/password - 비밀번호 변경
- PUT /api/users/profile - 프로필 정보 수정
- POST /api/users/refresh - 토큰 갱신
- POST /api/users/logout - 로그아웃

### 게시판 관련 (/api/boards/**)
- GET / - 게시판 목록 조회
- GET /{id} - 게시판 상세 조회
- POST / - 게시판 생성 (관리자)
- PUT /{id} - 게시판 수정 (관리자)
- DELETE /{id} - 게시판 삭제 (관리자)

### 게시글 관련 (/api/posts/**)
- GET / - 게시글 목록 조회 (페이징)
- GET /{id} - 게시글 상세 조회
- POST / - 게시글 작성
- PUT /{id} - 게시글 수정
- DELETE /{id} - 게시글 삭제

### 댓글 관련 (/api/comments/**)
- GET /post/{postId} - 게시글 댓글 목록
- POST / - 댓글 작성
- PUT /{id} - 댓글 수정
- DELETE /{id} - 댓글 삭제

### 화장품 관련 (/api/cosmetics/**)
- GET /api/cosmetics/list - 화장품 목록 조회 (페이징)
  - pageNo: 페이지 번호 (기본값: 1)
  - numOfRows: 페이지당 항목 수 (기본값: 10)
- GET /api/cosmetics/search - 화장품 검색
  - item_name: 검색할 제품명
  - pageNo: 페이지 번호 (기본값: 1)
  - numOfRows: 페이지당 항목 수 (기본값: 10)

### 태그 관련 (/api/tags/**)
- GET /api/tags - 전체 태그 목록
- GET /api/tags/popular - 인기 태그 목록
- GET /api/tags/search - 태그 검색

</details>

---

## 데이터베이스 구조

### 엔티티 관계도
```
User (사용자)
├── 1:N Post (게시글)
└── 1:N Comment (댓글)

Board (게시판)
└── 1:N Post (게시글)

Cosmetic (화장품)
└── 1:N Post (게시글)

Post (게시글)
├── N:1 Board (게시판)
├── N:1 User (작성자)
├── N:1 Cosmetic (화장품)
├── 1:N PostImage (이미지)
├── 1:N Comment (댓글)
└── N:M Tag (해시태그)

Comment (댓글)
├── N:1 Post (게시글)
├── N:1 User (작성자)
├── N:1 Comment (부모 댓글)
└── 1:N Comment (답글)

Tag (해시태그)
└── N:M Post (게시글)
```

### 삭제 정책
1. 사용자(User) 삭제 시
   - 게시글(Post) 보존
   - 댓글(Comment) 보존
   - RefreshToken 삭제

2. 게시판(Board) 삭제 시
   - 연관된 게시글(Post) 모두 삭제
   - 게시글 댓글(Comment) 자동 삭제
   - 게시글-태그 관계 자동 삭제

3. 게시글(Post) 삭제 시
   - 게시글 이미지(PostImage) 자동 삭제
   - 게시글 댓글(Comment) 자동 삭제
   - 게시글-태그 관계 자동 삭제 (태그 자체는 보존)

4. 댓글(Comment) 삭제 시
   - 실제 삭제가 아닌 soft delete 처리
   - deleted 필드를 true로 설정
   - content를 "삭제된 댓글입니다."로 변경

5. 화장품(Cosmetic) 삭제 시
   - 연관된 리뷰(Post)는 보존됨
   - Post 엔티티의 cosmetic 필드가 null로 설정됨
   - 리뷰의 화장품 정보는 cosmeticName 필드로 보존
   - 삭제된 화장품에 대한 새로운 리뷰 작성 불가

### 파일 저장소
- 리뷰 이미지: 로컬 파일 시스템의 'uploads' 디렉토리에 저장
- 이미지 파일명: UUID를 사용하여 고유한 파일명 생성
- 허용되는 파일 형식: jpg, jpeg, png, gif
- 파일 크기 제한: 
  - 단일 파일 최대 10MB
  - 요청당 최대 50MB
- 보안 기능:
  - 파일 확장자 검증
  - 디렉토리 트래버설 공격 방지
  - 파일명 정리(cleaning)를 통한 악성 문자 제거
  - 업로드 디렉토리 자동 생성

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