const KMYLogo = ({ className = "w-8 h-8" }) => {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 배경 사각형 (라운드) */}
      <rect x="2" y="2" width="96" height="96" rx="12" fill="#2d2d2d" />

      {/* KMY 추상 로고 - 기하학적 삼각형 패턴 */}
      <g fill="white">
        {/* K - 왼쪽 삼각형 */}
        <polygon points="18,22 18,78 42,50" />

        {/* M - 중앙 아래 삼각형 */}
        <polygon points="44,78 54,42 64,78" />

        {/* Y - 오른쪽 위 삼각형 + 아래 막대 */}
        <polygon points="58,22 82,22 70,42" />
        <rect x="64" y="44" width="12" height="34" />
      </g>
    </svg>
  );
};

export default KMYLogo;
