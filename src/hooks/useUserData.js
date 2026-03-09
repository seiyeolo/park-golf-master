import { useState, useEffect } from 'react';
import { safeGetJSON, safeSetJSON } from '../utils/storage';

const useUserData = () => {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('parkgolf_current_user') || '';
  });
  const [userProfile, setUserProfile] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [knownQuestions, setKnownQuestions] = useState(new Set());
  const [unknownQuestions, setUnknownQuestions] = useState(new Set());

  // Profile modal states
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  // Progress states (returned for App to manage)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const getStorageKey = (key) => {
    return currentUser ? `parkgolf_${currentUser}_${key}` : `parkgolf_${key}`;
  };

  // Load all user data when user changes
  useEffect(() => {
    if (!currentUser) {
      setIsProfileModalOpen(true);
      return;
    }

    // Load user profile
    const savedProfile = safeGetJSON(getStorageKey('profile'));
    if (savedProfile) {
      setUserProfile(savedProfile);
      setIsWelcomeModalOpen(true);
    } else {
      setIsProfileModalOpen(true);
    }

    // Load favorites
    const savedFavorites = safeGetJSON(getStorageKey('favorites'), []);
    setFavorites(savedFavorites);

    // Load progress
    const savedProgress = safeGetJSON(getStorageKey('progress'));
    if (savedProgress) {
      setSelectedCategory(savedProgress.selectedCategory);
      setTimeout(() => {
        setCurrentIndex(savedProgress.currentIndex || 0);
      }, 0);
    }

    // Load self evaluation
    const savedEval = safeGetJSON(getStorageKey('self_eval'));
    if (savedEval) {
      setKnownQuestions(new Set(savedEval.known || []));
      setUnknownQuestions(new Set(savedEval.unknown || []));
    }
  }, [currentUser]);

  // Save progress
  useEffect(() => {
    if (currentUser) {
      safeSetJSON(getStorageKey('progress'), {
        currentIndex,
        selectedCategory,
        lastStudied: new Date().toISOString()
      });
    }
  }, [currentIndex, selectedCategory, currentUser]);

  // Save self evaluation
  useEffect(() => {
    if (!currentUser) return;
    safeSetJSON(getStorageKey('self_eval'), {
      known: Array.from(knownQuestions),
      unknown: Array.from(unknownQuestions)
    });
  }, [knownQuestions, unknownQuestions, currentUser]);

  const toggleFavorite = (id) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter(fid => fid !== id)
      : [...favorites, id];
    setFavorites(newFavorites);
    safeSetJSON(getStorageKey('favorites'), newFavorites);
  };

  const handleSelfEval = (questionId, result, filteredQuestionsLength) => {
    if (result === 'known') {
      setKnownQuestions(prev => { const s = new Set(prev); s.add(questionId); return s; });
      setUnknownQuestions(prev => { const s = new Set(prev); s.delete(questionId); return s; });
    } else {
      setUnknownQuestions(prev => { const s = new Set(prev); s.add(questionId); return s; });
      setKnownQuestions(prev => { const s = new Set(prev); s.delete(questionId); return s; });
    }

    if (currentIndex < filteredQuestionsLength - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  const handleSaveProfile = (profileData) => {
    const { name, objective, examDate } = profileData;
    const isNewUserSetup = !currentUser;

    localStorage.setItem('parkgolf_current_user', name);
    setCurrentUser(name);

    const profile = { name, objective, examDate };
    safeSetJSON(`parkgolf_${name}_profile`, profile);
    setUserProfile(profile);

    if (!isEditingProfile && !isNewUserSetup) {
      const existingProfile = localStorage.getItem(`parkgolf_${name}_profile`);
      if (!existingProfile) {
        setKnownQuestions(new Set());
        setUnknownQuestions(new Set());
        setFavorites([]);
        setCurrentIndex(0);
        setSelectedCategory(null);
      }
    }

    setIsEditingProfile(false);

    if (isNewUserSetup || isEditingProfile) {
      setTimeout(() => setIsWelcomeModalOpen(true), 300);
    }
  };

  const handleSwitchUser = () => {
    setIsEditingProfile(false);
    setIsProfileModalOpen(true);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setIsProfileModalOpen(true);
  };

  const handleResetProgress = () => {
    setKnownQuestions(new Set());
    setUnknownQuestions(new Set());
    setCurrentIndex(0);
    setSelectedCategory(null);
    localStorage.removeItem(getStorageKey('self_eval'));
    localStorage.removeItem(getStorageKey('progress'));
  };

  return {
    currentUser,
    userProfile,
    favorites,
    knownQuestions,
    unknownQuestions,
    currentIndex,
    setCurrentIndex,
    selectedCategory,
    setSelectedCategory,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isEditingProfile,
    setIsEditingProfile,
    isWelcomeModalOpen,
    setIsWelcomeModalOpen,
    toggleFavorite,
    handleSelfEval,
    handleSaveProfile,
    handleSwitchUser,
    handleEditProfile,
    handleResetProgress,
  };
};

export default useUserData;
