/**
 * ✏️  여기만 수정하면 사이트 전체가 바뀝니다.
 *
 * link   : 앱인토스 콘솔에서 발급받은 공유 링크(또는 intoss:// 딥링크)
 * emoji  : 아이콘 이미지가 없을 때 보여줄 이모지
 * icon   : (선택) 아이콘 이미지 경로. 예: "assets/icons/my-app.png"
 * colors : 카드 그라디언트 두 색
 * tag    : 카테고리 (필터 버튼이 자동으로 만들어집니다)
 * badge  : (선택) "NEW", "HOT" 등
 */
window.SITE = {
  name: "MY APPS",
  tagline: "토스에서 바로 여는 작은 앱들",
  description:
    "설치 없이, 토스 안에서 바로. 매일 쓰고 싶은 미니앱을 만들고 있어요.",
  contact: "", // 예: "mailto:hello@example.com" (비워두면 숨김)
};

window.APPS = [
  {
    name: "오늘의 운세",
    desc: "매일 아침 30초, 오늘 하루를 미리 들여다보세요.",
    tag: "라이프",
    emoji: "🔮",
    colors: ["#7c3aed", "#ec4899"],
    link: "https://toss.im/",
    badge: "HOT",
  },
  {
    name: "가계부 한 줄",
    desc: "한 줄이면 끝나는 초간단 지출 기록.",
    tag: "금융",
    emoji: "💸",
    colors: ["#0ea5e9", "#22d3ee"],
    link: "https://toss.im/",
  },
  {
    name: "물 마시기",
    desc: "하루 8잔, 귀여운 알림이 대신 챙겨드려요.",
    tag: "건강",
    emoji: "💧",
    colors: ["#06b6d4", "#3b82f6"],
    link: "https://toss.im/",
    badge: "NEW",
  },
  {
    name: "점심 룰렛",
    desc: "오늘 뭐 먹지? 고민은 룰렛에게 맡기세요.",
    tag: "라이프",
    emoji: "🍜",
    colors: ["#f97316", "#facc15"],
    link: "https://toss.im/",
  },
  {
    name: "1분 퀴즈",
    desc: "출근길 1분, 상식 퀴즈로 두뇌 깨우기.",
    tag: "게임",
    emoji: "🧠",
    colors: ["#22c55e", "#a3e635"],
    link: "https://toss.im/",
  },
  {
    name: "더치페이 계산기",
    desc: "N빵도, 메뉴별 정산도 한 번에.",
    tag: "금융",
    emoji: "🧾",
    colors: ["#6366f1", "#a855f7"],
    link: "https://toss.im/",
  },
];
