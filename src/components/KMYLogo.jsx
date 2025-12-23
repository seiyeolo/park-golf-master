const KMYLogo = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 배경 원 (흰색) */}
      <circle cx="50" cy="50" r="48" fill="white" />

      {/* 테두리 원 (네이비) - 3/4 원호 */}
      <path
        d="M 50 2 A 48 48 0 1 1 2 50"
        fill="none"
        stroke="#3b4b8c"
        strokeWidth="2"
      />

      {/* KMY 로고 - 파란색 다이아몬드/삼각형 패턴 */}
      <g fill="#4a5ba8">
        {/* 왼쪽 삼각형 (K) - 왼쪽을 향한 화살표 */}
        <path d="M 18 50 L 32 36 L 32 64 Z" />

        {/* 중앙 상단 다이아몬드 */}
        <rect x="36" y="28" width="18" height="18" rx="3" transform="rotate(45 45 37)" />

        {/* 중앙 하단 다이아몬드 */}
        <rect x="36" y="50" width="18" height="18" rx="3" transform="rotate(45 45 59)" />

        {/* 오른쪽 다이아몬드 */}
        <rect x="54" y="39" width="18" height="18" rx="3" transform="rotate(45 63 48)" />
      </g>
    </svg>
  );
};

export default KMYLogo;
