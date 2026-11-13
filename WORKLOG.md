# 작업 기록 (WORKLOG)

날짜별로 무엇을, 왜 바꿨는지 남긴다. 최신이 위.

---

## 2026-11-13 — 사이트 첫 제작부터 Loopin 이름 변경까지

### 결과
- **사이트 주소**: https://seongyeolpark.github.io
- **저장소**: `seongyeolpark/seongyeolpark.github.io` (public, 처음 이름은 `website`)
- **배포**: GitHub Pages, `main` 브랜치 `/ (root)`. `main`에 머지하면 1~2분 뒤 자동 배포
- **사이트 이름**: Loopin (매일앱 → Loopin)
- **수록 앱**: 앱인토스 미니앱 15개 (`seongyeolpark/toss-inapp` 기준)

### 진행 순서
| PR | 내용 | 배포 (KST) |
|---|---|---|
| (첫 커밋, `main` 시작점) | 정적 사이트 뼈대 + 예시 앱 6개 | — |
| [#1](https://github.com/seongyeolpark/seongyeolpark.github.io/pull/1) | 실제 앱 15개(로고·`intoss://` 링크·카테고리 4개), 모바일 목록형 카드, 이름 "매일앱" | 11:04 |
| [#2](https://github.com/seongyeolpark/seongyeolpark.github.io/pull/2) | 화려한 애니메이션(`fx.js`/`fx.css`) | 11:23 |
| [#3](https://github.com/seongyeolpark/seongyeolpark.github.io/pull/3) | 버벅임 개선(흐림 필터·스타일 재계산 제거) | 11:43 |
| [#4](https://github.com/seongyeolpark/seongyeolpark.github.io/pull/4) | 하단에 상호·대표 추가, 하단 문구 정리 | 11:51 |
| [#5](https://github.com/seongyeolpark/seongyeolpark.github.io/pull/5) | 사이트 이름 매일앱 → Loopin | 11:58 |

### 결정과 이유
- **정적 사이트(HTML/CSS/JS, 빌드 없음)**: GitHub Pages에 바로 올릴 수 있고, 앱 목록은 `apps.js` 하나만 고치면 되게 하려고.
- **수록 앱 15개**: `toss-inapp`에서 출시된 앱만. 불멍(`bonfire`)·소원 풍등(`wish-lantern`)은 화면 코드가 없는 빈 폴더라 제외.
- **앱 정보 출처**:
  - 이름: 각 앱 `src/services/shareService.ts`의 `APP_TITLE` (토스 검색 이름과 같게)
  - 설명: 각 앱 `PRD.md`의 "한 줄 정의"를 다듬음
  - 아이콘: 각 앱 `assets/logo.png`를 192px로 줄여 `assets/icons/<폴더명>.png`
  - 링크: `intoss://<appName>` (앱 공유 코드 `Share.createLink({ path: 'intoss://<appName>' })`와 같은 형식)
- **"우리 궁합"(wechemi)은 이름 추정**: 저장소에 `APP_TITLE`이 없어 홈 화면 문구로 정함. 콘솔 등록 이름과 다르면 `apps.js`에서 고칠 것.
- **링크가 안 열릴 때 대비**: 모바일은 1.6초 뒤에도 페이지가 보이면 "토스 앱에서 '앱 이름' 검색" 안내. PC는 QR 창에 같은 안내.
- **정책 반영** (`toss-inapp/docs/new-app-playbook.md` §8):
  - 외부 사이트에서 "토스 미니앱", "토스에서 ~ 써보기" 표현은 가능. "토스 공식 파트너"류 표현은 금지 → 하단에 "토스(비바리퍼블리카)의 공식 사이트가 아니에요".
  - 로또 추첨기 카드에 "재미용 · 만 19세 이상", 두뇌 체크 카드에 "의학적 진단이 아니에요" 배지(하단의 같은 문장은 #4에서 삭제, 카드 배지는 유지).
  - "100% 무료" 문구는 오늘의 운세에 유료 결제가 있어 "매일 새로 바뀌는 콘텐츠"로 바꿈.
- **사업자 정보는 상호·대표만 공개**: 사업자등록번호·주소(집 주소)·생년월일·연락처는 사용자가 넣지 않기로 함. 사업자등록증 사진은 읽기만 했고 저장소에 올리지 않음.
  - 나중에 사이트에서 직접 판매(통신판매)를 하면 사업자등록번호·주소·통신판매업 신고번호 표시가 필요해짐.
- **이름 변경**: "MY APPS" → "매일앱" → "Loopin"(회사명). 탭 제목 뒤 설명 "매일 여는 토스 미니앱 모음"과 하단 상호 "루핀(Loopin)"은 유지.

### 성능 개선 기록 (#3)
"좀 버벅거린다"는 피드백 → 원인과 수치:

| 측정 (같은 헤드리스 환경, 마우스 이동 + 스크롤) | 전 | 후 |
|---|---|---|
| 초당 프레임 | 11.7 | 29.2 |
| 프레임당 작업 시간 | 11.2ms | 6.2ms |
| 프레임당 스타일 재계산 | 4.6ms | 1.2ms |

GPU 없는 환경이라 절대값보다 상대 개선으로 볼 것.

원인과 해결:
1. 배경 오로라: 화면 전체 `filter: blur(90px)` + `mix-blend-mode` + 마우스 이동마다 위치 변경 → 미리 흐린 `radial-gradient` + transform 애니메이션만. 마우스 시차는 제거.
2. 커서 빛: `body`에 CSS 변수(`--mx`)를 쓰던 것 → 마우스 이동마다 페이지 전체 스타일 재계산. 빛 요소의 transform만 직접 변경.
3. 네비·고스트 버튼 `backdrop-filter` → 뒤의 별 캔버스가 움직여 매 프레임 재계산. 반투명 단색으로.
4. 그 외: 노이즈 애니메이션 정지, 버튼 번짐 빛 애니메이션 제거, 도는 아이콘의 매 프레임 blur 제거, 별 캔버스 30fps·해상도 1배·최대 140개, 커서 링·폰 기울기·도는 아이콘은 멈추거나 화면 밖이면 계산 중지.

**앞으로 효과를 추가할 때 피할 것**: 화면 전체 크기 요소의 `filter: blur`/`backdrop-filter`/`mix-blend-mode`, `body`·`html`에 자주 바뀌는 CSS 변수, 계속 도는 `requestAnimationFrame` 루프(멈추면 쉬게), `left`/`top` 애니메이션(대신 `transform`).

### 겪은 문제와 해결
- **GitHub Pages가 유료로 보임**: 비공개 저장소라서. 저장소를 public으로 바꿔 해결(비공개 유지가 필요하면 Cloudflare Pages 무료).
- **주소에 `/webpage/`가 붙음**: 저장소 이름이 `계정명.github.io`가 아니면 `/저장소이름/`이 붙음. 이름을 정확히 `seongyeolpark.github.io`로 바꾸고 Pages를 다시 켜서 해결(unpublish 했다면 Pages를 꼭 다시 켜야 함).
- **`main` 브랜치가 없었음**: 첫 커밋(`c6493ec`)을 `main`으로 만들고 그 뒤를 PR로 머지.
- **제목 글자 사이 간격이 벌어짐**: 글자 쪼개기 효과가 줄 사이 공백까지 글자로 감싸서. 공백만 있는 텍스트는 건너뛰게 수정.
- **하단 연도 줄 삭제 시 스크립트 오류 위험**: `#year` 요소가 없어지면 `main.js`가 멈춤 → 요소가 있을 때만 연도를 넣게 수정.

### 아직 확인 못 한 것 (실기기에서 확인 필요)
- 휴대폰에서 카드를 누르면 `intoss://` 링크로 토스 앱이 열리는지
- PC의 QR(`intoss://` 링크)을 휴대폰 카메라로 찍었을 때 토스로 연결되는지
  - 안 되면 콘솔에서 받은 `https` 공유 링크를 `apps.js`의 `link`에 넣으면 그 링크가 우선 쓰임
- 실제 PC·휴대폰(GPU 있음)에서 애니메이션이 부드러운지
- "우리 궁합"이 콘솔 등록 이름과 같은지
- 카카오톡 링크 미리보기에 예전 이름이 보이면 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시 초기화

### 다음에 해볼 만한 것
- Google Analytics(gtag) 연결 → `open_app` 이벤트로 앱별 클릭 수 집계 (코드는 준비됨)
- 앱별 OG 이미지(공유 미리보기 이미지) 추가
- 새 앱 출시 시 `apps.js`에 추가 + `assets/icons/`에 로고
