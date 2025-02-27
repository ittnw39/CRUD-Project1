# 개발 규칙 문서

## 1. SOLID 원칙
### Single Responsibility Principle (단일 책임 원칙)
- 각 클래스는 하나의 책임만 가져야 합니다.
- 컴포넌트는 하나의 주요 기능에 집중해야 합니다.
- 예시: `TextLoadingSpinner`는 로딩 애니메이션만 담당

### Open-Closed Principle (개방-폐쇄 원칙)
- 확장에는 열려있고, 수정에는 닫혀있어야 합니다.
- 기존 코드를 수정하지 않고 새로운 기능을 추가할 수 있어야 합니다.
- 예시: 새로운 로딩 애니메이션 추가 시 기존 컴포넌트 수정 없이 새 컴포넌트 생성

### Liskov Substitution Principle (리스코프 치환 원칙)
- 하위 클래스는 상위 클래스를 대체할 수 있어야 합니다.
- 컴포넌트의 props 타입은 일관성을 유지해야 합니다.
- 예시: 모든 로딩 컴포넌트는 동일한 기본 props 인터페이스를 따름

### Interface Segregation Principle (인터페이스 분리 원칙)
- 클라이언트는 자신이 사용하지 않는 인터페이스에 의존하지 않아야 합니다.
- props는 필요한 것만 전달받아야 합니다.
- 예시: 불필요한 props 전달 금지

### Dependency Inversion Principle (의존성 역전 원칙)
- 상위 모듈은 하위 모듈에 의존하지 않아야 합니다.
- 둘 다 추상화에 의존해야 합니다.
- 예시: 상태 관리는 커스텀 훅을 통해 추상화

## 2. 객체지향 원칙
### 캡슐화
- 관련된 데이터와 동작을 하나의 단위로 묶습니다.
- 내부 구현을 숨기고 필요한 인터페이스만 노출합니다.
- 예시: 상태 관리 로직은 커스텀 훅 내부에 캡슐화

### 상속
- 코드 재사용을 위해 적절한 상속 구조를 사용합니다.
- 단, 과도한 상속은 피하고 합성을 선호합니다.
- 예시: 기본 컴포넌트를 확장한 커스텀 컴포넌트 생성

### 다형성
- 동일한 인터페이스로 다양한 구현을 제공합니다.
- props를 통해 다양한 동작을 지원합니다.
- 예시: 다양한 로딩 애니메이션 컴포넌트가 동일한 인터페이스 사용

### 추상화
- 공통된 특성을 추출하여 재사용 가능한 단위로 만듭니다.
- 복잡한 로직을 단순화된 인터페이스로 제공합니다.
- 예시: 공통 훅과 유틸리티 함수 사용

## 3. TDD (테스트 주도 개발)
### 테스트 작성 규칙
1. 실패하는 테스트를 먼저 작성합니다.
2. 테스트를 통과하는 최소한의 코드를 작성합니다.
3. 리팩토링을 통해 코드를 개선합니다.

### 테스트 범위
- 단위 테스트: 개별 컴포넌트와 함수
- 통합 테스트: 컴포넌트 간 상호작용
- E2E 테스트: 주요 사용자 시나리오

### 테스트 네이밍
- `describe`: 테스트 대상 컴포넌트/함수 이름
- `it`: 테스트하는 동작 설명
- 예시: `describe('TextLoadingSpinner', () => { it('should show loading text with dots', () => {}) })`

### 테스트 커버리지
- 새로운 기능 추가 시 관련 테스트 필수 작성
- 버그 수정 시 해당 케이스에 대한 테스트 추가
- 목표 커버리지: 80% 이상

## 4. 커밋 규칙
### 커밋 메시지 형식
```
<type>: <description>

[optional body]
[optional footer]
```

### 커밋 타입
- feat: 새로운 기능 추가
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅
- refactor: 코드 리팩토링
- test: 테스트 코드 추가/수정
- chore: 빌드 프로세스 또는 보조 도구 변경

### 예시
```
feat: 검색 로딩 애니메이션 개선

- TextLoadingSpinner 컴포넌트 추가
- 검색 결과 영역에 텍스트 기반 로딩 애니메이션 적용

Resolves: #123
``` 