# Loopin 사이트 — 작업 안내

앱인토스 미니앱을 모아 소개하고 토스로 유입시키는 정적 웹사이트. 사용자는 한국어로 대화한다.
날짜별 작업 내역과 결정 이유는 `WORKLOG.md`.

- 사이트: https://seongyeolpark.github.io
- 저장소: `seongyeolpark/seongyeolpark.github.io` (public)
- 앱 소스: `seongyeolpark/toss-inapp` (private, 앱별 폴더)

## 구조 (빌드 없음, HTML/CSS/JS만)
| 파일 | 역할 |
|---|---|
| `apps.js` | **여기만 고치면 되는 설정.** `window.SITE`(이름·설명·상호·대표·연락처)와 `window.APPS`(앱 목록) |
| `index.html` | 페이지 뼈대, 메타 태그(탭 제목·공유 미리보기는 여기에 직접 적혀 있음) |
| `main.js` | 카드·필터·폰 목업·마키 렌더, 앱 열기(모바일 링크 / PC QR 모달), 별 배경 |
| `style.css` | 기본 스타일과 반응형 |
| `fx.js` / `fx.css` | 화려한 효과(인트로, 글자 등장, 도는 아이콘, 클릭 폭죽, 커서 링 등). 동작 줄이기 설정이면 모두 꺼짐 |
| `assets/icons/` | 앱 로고 192px (`toss-inapp/<폴더>/assets/logo.png`를 줄인 것) |

## 앱 추가·수정
1. `toss-inapp`에서 정보 확인:
   - `appName`: `<폴더>/apps-in-toss.config.ts`
   - 이름: `<폴더>/src/services/shareService.ts`의 `APP_TITLE`
   - 설명: `<폴더>/PRD.md`의 한 줄 정의
   - 로고: `<폴더>/assets/logo.png` → 192px로 줄여 `assets/icons/<폴더>.png`
2. `apps.js`의 `APPS`에 항목 추가. `link`를 비우면 `intoss://<appName>`이 자동으로 쓰임.

## 배포
- `main`에 머지하면 GitHub Pages가 자동 배포(1~2분).
- 작업 흐름: 작업 브랜치에서 커밋·푸시 → PR → 사용자가 머지 → Actions의 `pages build and deployment` 결과 확인.
- 이 클라우드 작업 환경에서는 `*.github.io`에 직접 접속이 막혀 있다. 배포 확인은 GitHub Actions 실행 기록과 `main`의 파일 내용으로 한다.

## 지켜야 할 것
- **사업자 정보는 상호·대표만** 공개(사용자 결정). 사업자등록번호·주소(집 주소)·생년월일·연락처는 넣지 않는다.
- **토스 공식처럼 보이는 표현 금지**("토스 공식 파트너" 등). 하단의 "공식 사이트가 아니에요" 문구 유지.
- 로또 추첨기는 당첨 확률·예측 표현 금지, "재미용 · 만 19세 이상" 유지. 두뇌 체크·약 챙김은 의료 표현("치매/예방/진단/치료") 금지.
- 오늘의 운세에 유료 결제가 있으니 "전부 무료" 같은 표현을 쓰지 않는다.
- **성능**: 화면 전체 크기 요소에 `filter: blur`/`backdrop-filter`/`mix-blend-mode`를 쓰지 않는다. `body`·`html`에 자주 바뀌는 CSS 변수를 쓰지 않는다. `requestAnimationFrame` 루프는 멈추거나 화면 밖이면 쉬게 한다. 움직임은 `transform`/`opacity`로만.
- 효과를 바꾼 뒤에는 데스크톱(1440px)과 휴대폰(iPhone 13) 화면, 페이지 오류, 모바일 가로 스크롤(`scrollWidth`가 화면 폭과 같은지)을 확인한다.

## 미리보기
```bash
python3 -m http.server 8000
```
