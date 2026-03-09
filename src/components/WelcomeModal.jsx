import { Target, Clock, TrendingUp } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';
import { calculateDday } from '../utils/date';

const WelcomeModal = ({ isOpen, onClose, profile, totalQuestions, studiedCount }) => {
  useBodyScrollLock(isOpen);

  if (!isOpen || !profile) return null;

  const dday = calculateDday(profile.examDate);
  const progressPercent = totalQuestions > 0 ? Math.round((studiedCount / totalQuestions) * 100) : 0;
  const isUrgent = dday !== null && dday <= 7 && dday > 0;
  const isPast = dday !== null && dday < 0;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with gradient */}
        <div className="bg-gradient-to-br from-primary-500 via-primary-600 to-emerald-600 p-6 text-white text-center">
          <div className="text-4xl mb-2">🏆</div>
          <h2 className="text-xl font-bold mb-1">
            {profile.name}님, 오늘도 화이팅!
          </h2>
          <p className="text-primary-100 text-sm">꾸준한 학습이 합격의 비결입니다</p>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* 목표 */}
          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
            <Target className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-amber-600 font-medium">🎯 나의 목표</p>
              <p className="text-amber-900 font-bold">{profile.objective}</p>
            </div>
          </div>

          {/* D-day */}
          {dday !== null && (
            <div className={`flex items-center justify-between p-3 rounded-xl ${
              isPast ? 'bg-gray-100' : isUrgent ? 'bg-red-50' : 'bg-blue-50'
            }`}>
              <div className="flex items-center gap-2">
                <Clock className={`w-5 h-5 ${isPast ? 'text-gray-500' : isUrgent ? 'text-red-600' : 'text-blue-600'}`} />
                <span className={`text-sm ${isPast ? 'text-gray-600' : isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
                  ⏰ 시험까지
                </span>
              </div>
              <span className={`text-xl font-black ${isPast ? 'text-gray-500' : isUrgent ? 'text-red-600' : 'text-blue-600'}`}>
                {isPast ? '시험 완료' : dday === 0 ? 'D-Day!' : `D-${dday}`}
              </span>
            </div>
          )}

          {/* 진행률 */}
          <div className="p-3 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary-600" />
                <span className="text-sm text-gray-600">📊 학습 진행률</span>
              </div>
              <span className="text-lg font-black text-primary-600">{progressPercent}%</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-400 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1.5 text-right">
              {studiedCount} / {totalQuestions} 문제 학습 완료
            </p>
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white rounded-xl font-bold text-lg transition-all active:scale-[0.98] shadow-lg shadow-primary-200"
          >
            💪 학습 시작
          </button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeModal;
