import { useState } from 'react';

const FREE_LIMIT = 50;

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('parkgolf_auth') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('parkgolf_auth', 'true');
    setIsAuthModalOpen(false);
  };

  return {
    isAuthenticated,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleAuthSuccess,
    FREE_LIMIT,
  };
};

export default useAuth;
