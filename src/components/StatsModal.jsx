import { useEffect, useState } from 'react';
import { X, BarChart3, CheckCircle, XCircle, BookOpen, RotateCcw, User, Trash2, UserCog } from 'lucide-react';

const StatsModal = ({
  isOpen,
  onClose,
  questions,
  categories,
  knownQuestions,
  unknownQuestions,
  onStartUnknownReview,
  currentUser,
  onSwitchUser,
  onResetProgress
}) => {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // 전체 학습 통계 계산
  const totalQuestions = questions.length;
  const studiedCount = knownQuestions.size + unknownQuestions.size;
  const studiedPercent = totalQuestions > 0 ? Math.round((studiedCount / totalQuestions) * 100) : 0;

  // 자기평가 통계
  const knownCount = knownQuestions.size;
  const unknownCount = unknownQuestions.size;
  const knownPercent = studiedCount > 0 ? Math.round((knownCount / studiedCount) * 100) : 0;
  const unknownPercent = studiedCount > 0 ? Math.round((unknownCount / studiedCount) * 100) : 0;

  // 카테고리별 통계 계산
  const categoryStats = categories.map(cat => {
    const categoryQuestions = questions.filter(q => q.category === cat.name);
    const categoryKnown = categoryQuestions.filter(q => knownQuestions.has(q.id)).length;
    const categoryUnknown = categoryQuestions.filter(q => unknownQuestions.has(q.id)).length;
    const categoryStudied = categoryKnown + categoryUnknown;
    const categoryTotal = categoryQuestions.length;
    const percent = categoryTotal > 0 ? Math.round((categoryStudied / categoryTotal) * 100) : 0;

    return {
      ...cat,
      total: categoryTotal,
      studied: categoryStudied,
      known: categoryKnown,
      unknown: categoryUnknown,
      percent
    };
  });

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">학습 통계</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-4 custom-scrollbar bg-gray-50/50 space-y-4">

          {/* 전체 진행률 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-gray-800">전체 진행률</h3>
            </div>
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">총 {totalQuestions}문제 중 {studiedCount}문제 학습</span>
                <span className="font-bold text-primary-600">{studiedPercent}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-primary-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${studiedPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* 자기평가 결과 */}
          {studiedCount > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-3">자기평가 결과</h3>
              <div className="space-y-3">
                {/* 알았어요 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">알았어요</span>
                    </div>
                    <span className="text-sm font-bold text-green-600">{knownCount}개 ({knownPercent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${knownPercent}%` }}
                    />
                  </div>
                </div>

                {/* 몰랐어요 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-gray-700">몰랐어요</span>
                    </div>
                    <span className="text-sm font-bold text-orange-600">{unknownCount}개 ({unknownPercent}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${unknownPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 카테고리별 통계 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 mb-3">카테고리별 진행률</h3>
            <div className="space-y-3">
              {categoryStats.map(cat => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700">{cat.name}</span>
                    <span className="text-xs text-gray-500">
                      <span className="font-bold text-primary-600">{cat.studied}</span>/{cat.total}
                      {cat.unknown > 0 && (
                        <span className="ml-1 text-orange-500">({cat.unknown}개 복습필요)</span>
                      )}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 flex overflow-hidden">
                    <div
                      className="bg-green-500 h-2 transition-all duration-500"
                      style={{ width: `${cat.total > 0 ? (cat.known / cat.total) * 100 : 0}%` }}
                    />
                    <div
                      className="bg-orange-500 h-2 transition-all duration-500"
                      style={{ width: `${cat.total > 0 ? (cat.unknown / cat.total) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 몰랐던 문제 복습하기 버튼 */}
          {unknownCount > 0 && (
            <button
              onClick={() => {
                onStartUnknownReview();
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 p-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold shadow-lg active:scale-[0.98] transition-all"
            >
              <RotateCcw className="w-5 h-5" />
              몰랐던 문제 {unknownCount}개 복습하기
            </button>
          )}

          {/* 학습 시작 안내 */}
          {studiedCount === 0 && (
            <div className="text-center py-6 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>아직 학습 기록이 없습니다.</p>
              <p className="text-sm mt-1">문제를 풀고 자기평가를 해보세요!</p>
            </div>
          )}

          {/* 사용자 및 초기화 섹션 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
            {/* 현재 사용자 표시 */}
            {currentUser && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 font-medium">{currentUser}</span>
                </div>
                <button
                  onClick={onSwitchUser}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <UserCog className="w-4 h-4" />
                  사용자 전환
                </button>
              </div>
            )}

            {/* 학습 기록 초기화 버튼 */}
            {studiedCount > 0 && !showResetConfirm && (
              <button
                onClick={() => setShowResetConfirm(true)}
                className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors border border-red-200"
              >
                <Trash2 className="w-4 h-4" />
                학습 기록 초기화
              </button>
            )}

            {/* 초기화 확인 */}
            {showResetConfirm && (
              <div className="bg-red-50 rounded-xl p-4 border border-red-200">
                <p className="text-red-700 font-medium text-center mb-3">
                  정말 초기화하시겠습니까?
                </p>
                <p className="text-red-500 text-sm text-center mb-4">
                  모든 학습 기록이 삭제됩니다.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="flex-1 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      onResetProgress();
                      setShowResetConfirm(false);
                      onClose();
                    }}
                    className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                  >
                    초기화
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsModal;
