# 작업 목록

## 진행 중인 작업
- [x] 전역 상태 관리 리팩토링
  - [x] 유틸리티 함수 분리 (cosmeticUtils)
  - [x] API 서비스 레이어 분리 (cosmeticService)
  - [x] 상태 관리 로직 최적화 (cosmeticStore)
  - [x] 유틸리티 함수 테스트 작성
  - [x] API 서비스 테스트 작성
  - [x] 상태 관리 테스트 작성
- [ ] 접근성 (a11y) 개선
  - [ ] ARIA 레이블 및 역할 추가
    - [ ] SearchDialog 컴포넌트
    - [ ] TextLoadingSpinner 컴포넌트
    - [ ] CosmeticListItem 컴포넌트
  - [ ] 키보드 네비게이션 구현
    - [ ] 검색 다이얼로그 포커스 트랩
    - [ ] 리스트 아이템 키보드 탐색
    - [ ] 모달 ESC 키 처리
  - [ ] 색상 대비 검사 및 개선
  - [ ] 스크린 리더 지원
    - [ ] 실시간 검색 결과 알림
    - [ ] 로딩 상태 알림
    - [ ] 에러 메시지 읽기
  - [ ] WAI-ARIA 가이드라인 준수
    - [ ] Dialog (role="dialog")
    - [ ] Alert (role="alert")
    - [ ] Listbox (role="listbox")
  - [ ] 접근성 테스트 작성
    - [ ] 키보드 네비게이션 테스트
    - [ ] 스크린 리더 테스트
    - [ ] ARIA 속성 테스트

## 완료된 작업
### 2025-02-28
- [x] 개발 규칙 문서 작성 (DEVELOPMENT_RULES.md)
- [x] 작업 목록 문서 작성 (TASK_LIST.md)
- [x] TextLoadingSpinner 컴포넌트 구현
- [x] CosmeticSearchDialog에 텍스트 로딩 애니메이션 적용
- [x] TextLoadingSpinner 컴포넌트 단위 테스트 작성
- [x] 검색 기능 성능 최적화
  - [x] 검색어 입력 시 디바운싱 처리
  - [x] 검색 결과 캐싱 구현
- [x] CosmeticSearchDialog 컴포넌트 단위 테스트 작성
- [x] CosmeticListItem 컴포넌트 단위 테스트 작성
- [x] CosmeticSearchDialog 컴포넌트 리팩토링 (SOLID 원칙 적용)
  - [x] 컴포넌트 분리 (Header, Content, Footer)
  - [x] 상태 관리 로직 분리 (useSearchDialog)
- [x] 에러 처리 개선
  - [x] 에러 타입 정의 및 구분
  - [x] 에러 메시지 표준화
  - [x] 에러 로깅 구현
- [x] 성능 모니터링 도구 추가
  - [x] 성능 측정 유틸리티 구현
  - [x] API 호출 시간 측정 인터셉터 추가
  - [x] 컴포넌트 성능 모니터링 훅 구현
  - [x] 웹 바이탈 지표 측정 설정
  - [x] 성능 모니터링 테스트 작성
    - [x] 컴포넌트 마운트 시간 측정 테스트
    - [x] 동기 작업 성능 측정 테스트
    - [x] 비동기 작업 성능 측정 테스트
    - [x] 에러 처리 및 시간 측정 테스트

## 예정된 작업
- [x] 접근성 (a11y) 개선
- [ ] 국제화 (i18n) 지원 추가

## 테스트
- [x] 단위 테스트 작성
  - [x] TextLoadingSpinner
  - [x] CosmeticSearchDialog
  - [x] CosmeticListItem
  - [x] 검색 관련 유틸리티 함수
  - [x] 에러 처리 유틸리티 함수
- [ ] 통합 테스트 작성
  - [ ] 검색 기능
  - [ ] 상태 관리
- [ ] E2E 테스트 작성
  - [ ] 주요 사용자 시나리오 