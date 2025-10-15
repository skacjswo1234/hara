# 하라 헌옷 및 잡화 수거 랜딩페이지

환경을 생각하는 헌옷 및 잡화 수거 전문업체 "하라"의 랜딩페이지입니다.

## 🚀 주요 기능

- **반응형 디자인**: 모바일, 태블릿, 데스크톱 모든 기기에서 최적화
- **현대적인 UI/UX**: 깔끔하고 직관적인 사용자 인터페이스
- **부드러운 애니메이션**: 스크롤 효과와 페이드인 애니메이션
- **접근성**: 키보드 네비게이션 및 스크린 리더 지원
- **SEO 최적화**: 검색 엔진 최적화된 구조

## 📱 섹션 구성

1. **헤더**: 로고와 네비게이션 메뉴
2. **히어로**: 메인 비주얼과 CTA 버튼
3. **업체소개**: 하라의 서비스와 특징
4. **수거서비스**: 수거 가능/불가능 품목 안내
5. **수거가격**: 실시간 가격 정보
6. **문의하기**: 상담 신청 폼

## 🛠 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: Flexbox, Grid, 애니메이션
- **JavaScript**: ES6+, 모듈화된 코드
- **Cloudflare Pages**: 정적 사이트 호스팅

## 🚀 배포 방법

### Cloudflare Pages 배포

1. **Wrangler CLI 설치**:
   ```bash
   npm install -g wrangler
   ```

2. **Cloudflare 로그인**:
   ```bash
   wrangler login
   ```

3. **개발 서버 실행**:
   ```bash
   npm run dev
   ```

4. **프로덕션 배포**:
   ```bash
   npm run deploy
   ```

### 수동 배포

1. Cloudflare 대시보드에서 Pages 프로젝트 생성
2. GitHub 저장소 연결 또는 파일 업로드
3. 빌드 설정에서 빌드 명령어 비워두기 (정적 사이트)
4. 배포 완료

## 📁 파일 구조

```
├── index.html          # 메인 HTML 파일
├── styles.css          # CSS 스타일시트
├── script.js           # JavaScript 파일
├── wrangler.toml       # Cloudflare 설정
├── package.json        # 프로젝트 설정
└── README.md          # 프로젝트 문서
```

## 🎨 커스터마이징

### 색상 변경
`styles.css`의 CSS 변수를 수정하여 색상을 변경할 수 있습니다:

```css
:root {
    --primary-color: #2c3e50;    /* 메인 색상 */
    --secondary-color: #3498db;  /* 보조 색상 */
    --accent-color: #e74c3c;     /* 강조 색상 */
}
```

### 가격 업데이트
`script.js`의 `updatePrice` 함수를 사용하여 실시간으로 가격을 변경할 수 있습니다:

```javascript
updatePrice('clothes', '500원'); // 헌옷 가격을 500원으로 변경
```

## 📞 연락처

- **업체명**: 하라
- **서비스**: 헌옷 및 잡화 수거
- **지역**: 서울 전 지역
- **연락처**: 010-1234-5678

## 📄 라이선스

MIT License - 자유롭게 사용 및 수정 가능합니다.

## 🔄 업데이트 내역

- **v1.0.0** (2024-01-01): 초기 버전 릴리스
  - 기본 랜딩페이지 구조
  - 반응형 디자인
  - Cloudflare Pages 배포 설정
