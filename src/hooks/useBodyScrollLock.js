import { useEffect } from 'react';

/**
 * 모달 열림 시 body 스크롤을 잠그는 커스텀 훅
 */
const useBodyScrollLock = (isLocked) => {
  useEffect(() => {
    if (isLocked) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLocked]);
};

export default useBodyScrollLock;
