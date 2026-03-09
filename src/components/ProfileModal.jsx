import { useState, useEffect } from 'react';
import { X, User, UserPlus, Target, Calendar } from 'lucide-react';
import useBodyScrollLock from '../hooks/useBodyScrollLock';

// 시험 연도 자동 계산 (매년 5월 시험 기준)
const getExamYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return month > 5 ? year + 1 : year;
};

const getDefaultExamDate = () => {
  const year = getExamYear();
  return `${year}-05-15`;
};

const ProfileModal = ({ isOpen, onClose, onSaveProfile, currentUser, isNewUser, existingProfile }) => {
  const [name, setName] = useState('');
  const [objective, setObjective] = useState('');
  const [examDate, setExamDate] = useState('');

  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      if (existingProfile) {
        setName(existingProfile.name || currentUser || '');
        setObjective(existingProfile.objective || `${getExamYear()}년 파크골프 지도사 합격`);
        setExamDate(existingProfile.examDate || getDefaultExamDate());
      } else {
        setName(currentUser || '');
        setObjective(`${getExamYear()}년 파크골프 지도사 합격`);
        setExamDate(getDefaultExamDate());
      }
    }
  }, [isOpen, currentUser, existingProfile]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onSaveProfile({
        name: trimmedName,
        objective: objective.trim() || `${getExamYear()}년 파크골프 지도사 합격`,
        examDate: examDate || getDefaultExamDate()
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="flex items-center gap-2">
            {isNewUser ? <UserPlus className="w-6 h-6" /> : <User className="w-6 h-6" />}
            <h2 className="text-xl font-bold">
              {isNewUser ? '환영합니다!' : existingProfile ? '프로필 수정' : '사용자 전환'}
            </h2>
          </div>
          {!isNewUser && (
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <p className="text-gray-600 text-center text-sm">
            {isNewUser
              ? '학습을 시작하기 전에 정보를 입력해주세요.'
              : '프로필 정보를 수정할 수 있습니다.'}
          </p>

          {/* 이름 입력 */}
          <div>
            <label htmlFor="userName" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <User className="w-4 h-4" />
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              autoFocus
              maxLength={20}
            />
          </div>

          {/* 목표 입력 */}
          <div>
            <label htmlFor="objective" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Target className="w-4 h-4" />
              학습 목표
            </label>
            <input
              type="text"
              id="objective"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder={`${getExamYear()}년 파크골프 지도사 합격`}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              maxLength={50}
            />
          </div>

          {/* 시험 예정일 */}
          <div>
            <label htmlFor="examDate" className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
              <Calendar className="w-4 h-4" />
              시험 예정일
            </label>
            <input
              type="date"
              id="examDate"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors mt-2"
          >
            {isNewUser ? '🏆 학습 시작하기' : '저장하기'}
          </button>

          {!isNewUser && !existingProfile && (
            <p className="text-xs text-gray-400 text-center">
              새 이름 입력 시 해당 사용자의 학습 기록이 적용됩니다.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
