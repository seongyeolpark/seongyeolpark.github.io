# 매일앱 — 토스 미니앱 모음

https://seongyeolpark.github.io

앱인토스 미니앱 링크를 모아 사용자를 유입시키는 정적 웹사이트입니다. 빌드 과정 없이 HTML/CSS/JS만 사용합니다.

## 앱 추가/수정
`apps.js` 파일만 수정하면 됩니다.

```js
{
  name: "앱 이름",
  desc: "한 줄 설명",
  tag: "카테고리",          // 필터 버튼이 자동으로 생성됩니다
  emoji: "🔮",             // 흐르는 띠에 함께 표시
  icon: "assets/icons/app.png", // (선택) 아이콘 이미지
  colors: ["#7c3aed", "#ec4899"],
  appName: "myfortune100",   // 콘솔 appName → 링크 intoss://myfortune100 자동 생성
  link: "",                  // (선택) 다른 링크를 쓸 때만
  badge: "NEW",            // (선택)
}
```

## 수록 앱 (15개, seongyeolpark/toss-inapp 기준)
오늘의 운세 · 오늘의 타로 · 오늘의 달 · 로또 추첨기 · 오늘 뭐 먹지 · 내 유형은 · 우리 궁합 · 나의 취향 월드컵 · 초성 퀴즈 · 맞춤법 퀴즈 · 두뇌 체크 · 다녀왔어 · 감정일기 · 디지털 디톡스 · 약 챙김

아이콘은 각 앱의 `assets/logo.png`를 192px로 줄여 `assets/icons/`에 넣었습니다. 아직 화면이 없는 불멍(bonfire)·소원 풍등(wish-lantern)은 넣지 않았습니다.

## 동작 방식
- **모바일**: 카드를 누르면 `intoss://<appName>`으로 이동 → 토스 앱에서 열림. 안 열리면 "토스에서 '앱 이름' 검색" 안내가 뜸
- **PC**: QR 코드 모달이 열려 휴대폰으로 스캔해 열 수 있음
- Google Analytics(gtag)를 붙이면 `open_app` 이벤트로 앱별 클릭 수가 집계됩니다.

## 효과
`fx.js`/`fx.css`에 모여 있습니다(인트로, 글자 등장, 단어 스크램블, 폰 주위를 도는 아이콘, 클릭 폭죽, 커서 링, 자석 버튼, 별자리·별똥별, 스크롤 진행 막대). 기기의 "동작 줄이기" 설정이 켜져 있으면 모두 꺼집니다. 효과를 빼고 싶으면 `index.html`에서 두 파일을 불러오는 줄을 지우면 됩니다.

## 로컬 미리보기
```bash
python3 -m http.server 8000
```

## 배포 (GitHub Pages)
저장소 Settings → Pages → Branch를 이 브랜치(또는 main)의 `/ (root)`로 지정하면 됩니다.
