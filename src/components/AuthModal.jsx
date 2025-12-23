import { useState, useEffect, useRef } from 'react';
import { Lock, Unlock } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, onAuthenticate }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  // 인증 코드 (환경 변수 또는 기본값)
  const CORRECT_PASSWORD = import.meta.env.VITE_AUTH_CODE || 'parkgolf'; 

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password.toLowerCase() === CORRECT_PASSWORD) {
      onAuthenticate();
      onClose();
      setError(false);
    } else {
      setError(true);
      // Shake animation trigger could go here
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 sm:p-8 transform transition-all scale-100">
        
        <div className="text-center mb-6">
          <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">무료 체험 종료</h2>
          <p className="text-gray-600 leading-relaxed">
            여기까지 잘 보셨나요? 👏<br/>
            나머지 모든 문제를 풀려면<br/>
            <span className="font-bold text-primary-600">인증 코드</span>를 입력해주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              ref={inputRef}
              type="text" // text to avoid obscured view issues on mobile, or password? usually text for codes is fine if short
              placeholder="인증 코드를 입력하세요"
              className={`w-full text-center text-xl font-bold tracking-widest p-4 rounded-xl border-2 outline-none transition-colors
                ${error 
                  ? 'border-red-300 bg-red-50 text-red-600 placeholder:text-red-300' 
                  : 'border-gray-200 focus:border-primary-500 focus:bg-white bg-gray-50'
                }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 text-center font-medium animate-pulse">
                코드가 올바르지 않습니다.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 text-lg"
          >
            <span>모든 문제 잠금 해제</span>
            <Unlock className="w-5 h-5" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-gray-400">
          * 인증 코드는 책의 뒷표지를 확인해주세요.
        </p>
      </div>
    </div>
  );
};

export default AuthModal;
