# 앱인토스 미니앱 소개 사이트

앱인토스 미니앱 링크를 모아 사용자를 유입시키는 정적 웹사이트입니다. 빌드 과정 없이 HTML/CSS/JS만 사용합니다.

## 앱 추가/수정
`apps.js` 파일만 수정하면 됩니다.

```js
{
  name: "앱 이름",
  desc: "한 줄 설명",
  tag: "카테고리",          // 필터 버튼이 자동으로 생성됩니다
  emoji: "🔮",             // 아이콘 이미지가 없을 때 표시
  icon: "assets/icons/app.png", // (선택) 아이콘 이미지
  colors: ["#7c3aed", "#ec4899"],
  link: "앱인토스 공유 링크",
  badge: "NEW",            // (선택)
}
```

## 동작 방식
- **모바일**: 카드를 누르면 링크로 바로 이동 → 토스 앱에서 열림
- **PC**: QR 코드 모달이 열려 휴대폰으로 스캔해 열 수 있음
- Google Analytics(gtag)를 붙이면 `open_app` 이벤트로 앱별 클릭 수가 집계됩니다.

## 로컬 미리보기
```bash
python3 -m http.server 8000
```

## 배포 (GitHub Pages)
저장소 Settings → Pages → Branch를 이 브랜치(또는 main)의 `/ (root)`로 지정하면 됩니다.
