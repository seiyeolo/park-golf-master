import { BookOpen, ExternalLink } from 'lucide-react';

const AdBanner = ({ type = 'book' }) => {
  if (type === 'book') {
    return (
      <a
        href="https://www.xn--2e0br5lxwk4rnnmg.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md block"
      >
        <div className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl p-3 shadow-lg flex items-center gap-3 hover:shadow-xl transition-shadow">
          <div className="bg-white/20 p-2 rounded-lg">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm">파크골프 완벽 가이드</p>
            <p className="text-white/80 text-xs">스포츠지도사 필독서 | 지금 구매하기</p>
          </div>
          <ExternalLink className="w-4 h-4 text-white/70 shrink-0" />
        </div>
      </a>
    );
  }

  if (type === 'sponsor') {
    return (
      <a
        href="https://smartstore.naver.com/3puttkiller/products/12286351110"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md block"
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-3 shadow-lg flex items-center gap-3 hover:shadow-xl transition-shadow">
          <div className="bg-white rounded-lg p-1.5">
            <svg viewBox="0 0 40 40" className="w-7 h-7">
              {/* PUTTIST 로고 - 골프공 모양 */}
              <circle cx="20" cy="20" r="18" fill="#10b981" />
              <circle cx="14" cy="14" r="2" fill="white" opacity="0.6" />
              <circle cx="20" cy="12" r="2" fill="white" opacity="0.6" />
              <circle cx="26" cy="14" r="2" fill="white" opacity="0.6" />
              <circle cx="12" cy="20" r="2" fill="white" opacity="0.6" />
              <circle cx="28" cy="20" r="2" fill="white" opacity="0.6" />
              <text x="20" y="28" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">P</text>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-400 font-bold text-sm">PUTTIST</span>
              <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded-full font-medium">협찬</span>
            </div>
            <p className="text-gray-300 text-xs">퍼티스트 파크골프 | puttist.com</p>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
        </div>
      </a>
    );
  }

  return null;
};

export default AdBanner;
