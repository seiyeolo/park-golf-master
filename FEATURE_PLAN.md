# 🎯 파크골프 마스터 기능 개선 기획서

## 프로젝트 개요
- **프로젝트**: park-golf-master (파크골프 자격증 학습 앱)
- **기술 스택**: React + Vite + Tailwind CSS + Framer Motion
- **현재 상태**: 354개 문제, 플래시카드 학습, 검색, 북마크 기능 있음
- **배포**: Vercel (자동 배포)

---

## 📋 구현할 기능 (우선순위 순)

### 1단계: 카테고리별 학습 모드
### 2단계: 학습 진도 저장
### 3단계: 자기평가 (알았다/몰랐다)

---

## 🔧 1단계: 카테고리별 학습 모드

### 목적
354개 문제를 한번에 학습하기 어려움. 카테고리별로 선택해서 집중 학습 가능하게 함.

### 현재 카테고리 (questions.json 분석)
```
- 파크골프 기초 (1~50번)
- 장비 및 시설 (51~100번)
- 경기 규칙 (101~113번, 114~196번)
- 실전 기술 (197~354번)
```

### 구현 요구사항

1. **CategoryModal.jsx 컴포넌트 생성** (`src/components/CategoryModal.jsx`)
   - 카테고리 목록 표시 (각 카테고리별 문제 수 포함)
   - "전체 학습" 옵션 포함
   - 카테고리 선택 시 해당 문제들만 필터링

2. **App.jsx 수정**
   - 상태 추가: `selectedCategory` (null이면 전체)
   - 상태 추가: `filteredQuestions` (선택된 카테고리의 문제들)
   - 헤더에 카테고리 선택 버튼 추가 (Menu 아이콘 활용)
   - 카테고리 변경 시 currentIndex를 0으로 리셋

3. **UI 디자인**
   - 모달 형태로 카테고리 선택
   - 각 카테고리 카드에 문제 수 배지 표시
   - 현재 선택된 카테고리 하이라이트
   - 헤더에 현재 카테고리명 표시

### 예상 코드 구조
```jsx
// CategoryModal.jsx
const categories = [
  { id: 'all', name: '전체 학습', filter: () => true },
  { id: 'basic', name: '파크골프 기초', filter: (q) => q.category === '파크골프 기초' },
  { id: 'equipment', name: '장비 및 시설', filter: (q) => q.category === '장비 및 시설' },
  { id: 'rules', name: '경기 규칙', filter: (q) => q.category === '경기 규칙' },
  { id: 'practice', name: '실전 기술', filter: (q) => q.category === '실전 기술' },
];
```

---

## 🔧 2단계: 학습 진도 저장

### 목적
앱을 닫았다 열어도 마지막으로 학습한 위치부터 이어서 학습 가능.

### 구현 요구사항

1. **localStorage 활용**
   - 키: `parkgolf_progress`
   - 저장 데이터: `{ currentIndex, selectedCategory, lastStudied }`

2. **App.jsx 수정**
   - 앱 시작 시 localStorage에서 진도 불러오기
   - currentIndex 변경 시 자동 저장
   - 카테고리 변경 시에도 저장

3. **진도 표시 UI**
   - 헤더에 진행률 프로그레스 바 추가 (선택사항)
   - "이어서 학습하기" 토스트 메시지 (첫 로드 시)

### 예상 코드
```javascript
// 저장
useEffect(() => {
  localStorage.setItem('parkgolf_progress', JSON.stringify({
    currentIndex,
    selectedCategory,
    lastStudied: new Date().toISOString()
  }));
}, [currentIndex, selectedCategory]);

// 불러오기
useEffect(() => {
  const saved = localStorage.getItem('parkgolf_progress');
  if (saved) {
    const { currentIndex: savedIndex, selectedCategory: savedCategory } = JSON.parse(saved);
    setCurrentIndex(savedIndex);
    setSelectedCategory(savedCategory);
  }
}, []);
```

---

## 🔧 3단계: 자기평가 (알았다/몰랐다)

### 목적
정답 확인 후 "알았다/몰랐다" 체크 → 몰랐던 문제만 모아서 복습 가능.

### 구현 요구사항

1. **Flashcard.jsx 수정**
   - 뒷면(정답)에 두 개 버튼 추가: "알았어요 ✓" / "몰랐어요 ✗"
   - 버튼 클릭 시 상위 컴포넌트로 결과 전달

2. **App.jsx 수정**
   - 상태 추가: `knownQuestions` (Set 또는 배열)
   - 상태 추가: `unknownQuestions` (Set 또는 배열)
   - localStorage에 저장: `parkgolf_self_eval`

3. **복습 모드 추가**
   - CategoryModal에 "몰랐던 문제만" 옵션 추가
   - unknownQuestions만 필터링해서 학습

4. **UI 디자인**
   - 카드 뒷면 하단에 버튼 2개 배치
   - "알았어요": 초록색 배경
   - "몰랐어요": 주황색 배경
   - 버튼 클릭 시 자동으로 다음 문제로 이동

### 예상 코드 구조
```jsx
// Flashcard.jsx 뒷면에 추가
<div className="absolute bottom-20 flex gap-4">
  <button 
    onClick={() => onSelfEval(question.id, 'known')}
    className="px-6 py-3 bg-green-500 text-white rounded-xl"
  >
    알았어요 ✓
  </button>
  <button 
    onClick={() => onSelfEval(question.id, 'unknown')}
    className="px-6 py-3 bg-orange-500 text-white rounded-xl"
  >
    몰랐어요 ✗
  </button>
</div>
```

---

## 📁 파일 구조 (변경 후)

```
src/
├── App.jsx (수정)
├── components/
│   ├── Flashcard.jsx (수정)
│   ├── Controls.jsx
│   ├── SearchModal.jsx
│   ├── AuthModal.jsx
│   └── CategoryModal.jsx (신규)
├── data/
│   └── questions.json
├── hooks/
│   └── useLocalStorage.js (신규 - 선택사항)
├── index.css
└── main.jsx
```

---

## ✅ 체크리스트

### 1단계 완료 조건
- [ ] CategoryModal 컴포넌트 생성
- [ ] 카테고리 선택 시 문제 필터링 동작
- [ ] 헤더에 현재 카테고리 표시
- [ ] 카테고리별 문제 수 표시

### 2단계 완료 조건
- [ ] 학습 진도 localStorage 저장
- [ ] 앱 재시작 시 진도 복원
- [ ] 카테고리 정보도 함께 저장/복원

### 3단계 완료 조건
- [ ] 정답 화면에 자기평가 버튼 2개
- [ ] 평가 결과 localStorage 저장
- [ ] "몰랐던 문제만" 학습 모드

---

## 🚀 Claude Code 실행 방법

터미널에서 다음 명령어로 Claude Code 실행:

```bash
cd /Users/mac/park-golf-master
claude
```

그리고 이 기획서 내용을 전달하거나, 다음과 같이 요청:

```
이 프로젝트에 FEATURE_PLAN.md 파일이 있어. 
이 기획서를 읽고 1단계부터 순서대로 구현해줘.
```

---

## 📝 참고사항

- 기존 코드 스타일 유지 (Tailwind CSS 클래스 활용)
- 기존 색상 체계 유지 (primary-600 등 green 계열)
- lucide-react 아이콘 라이브러리 활용
- framer-motion 애니메이션 활용
- 모바일 우선 반응형 디자인

---

작성일: 2024년 12월
작성: Claude (기획) → Claude Code (구현)
