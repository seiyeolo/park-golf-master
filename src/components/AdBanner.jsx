import { ExternalLink } from 'lucide-react';

const AdBanner = ({ type = 'book' }) => {
  if (type === 'book') {
    return (
      <a
        href="https://www.xn--2e0br5lxwk4rnnmg.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md block"
      >
        <div className="relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow group">
          {/* 책 표지 이미지 */}
          <img
            src="/images/book-cover.jpg"
            alt="파크골프 한권으로 마스터 - 국가자격스포츠지도사"
            className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ maxHeight: '220px', objectPosition: 'top' }}
          />
          {/* 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          {/* 하단 텍스트 */}
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <div>
              <p className="text-white font-bold text-sm drop-shadow">지금 구매하기</p>
              <p className="text-white/80 text-xs drop-shadow">northkms.com</p>
            </div>
            <div className="bg-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              구매 <ExternalLink className="w-3 h-3" />
            </div>
          </div>
        </div>
      </a>
    );
  }

  if (type === 'sponsor') {
    return (
      <a
        href="https://smartstore.naver.com/3puttkiller"
        target="_blank"
        rel="noopener noreferrer"
        className="w-full max-w-md block"
      >
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-3 shadow-lg flex items-center gap-3 hover:shadow-xl transition-shadow">
          <div className="bg-white rounded-lg p-1.5">
            <svg viewBox="0 0 40 40" className="w-7 h-7">
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
