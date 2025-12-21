import { useState, useEffect } from 'react';
import { X, User, UserPlus } from 'lucide-react';

const ProfileModal = ({ isOpen, onClose, onSaveProfile, currentUser, isNewUser }) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setName(currentUser || '');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentUser]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName) {
      onSaveProfile(trimmedName);
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
              {isNewUser ? '환영합니다!' : '사용자 전환'}
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
        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-gray-600 mb-4 text-center">
            {isNewUser
              ? '학습을 시작하기 전에 이름을 입력해주세요.'
              : '새로운 사용자 이름을 입력해주세요.'}
          </p>

          <div className="mb-6">
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700 mb-2">
              이름
            </label>
            <input
              type="text"
              id="userName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 홍길동"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors text-lg"
              autoFocus
              maxLength={20}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
          >
            {isNewUser ? '학습 시작하기' : '사용자 전환'}
          </button>

          {!isNewUser && (
            <p className="text-xs text-gray-400 text-center mt-4">
              새 이름 입력 시 해당 사용자의 학습 기록이 적용됩니다.
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
