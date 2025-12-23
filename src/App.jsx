import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Search, Layers, BarChart3 } from 'lucide-react';
import KMYLogo from './components/KMYLogo';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import CategoryModal from './components/CategoryModal';
import StatsModal from './components/StatsModal';
import ProfileModal from './components/ProfileModal';
import WelcomeModal from './components/WelcomeModal';
import questionsData from './data/questions.json';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [favorites, setFavorites] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Category State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Stats Modal State
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('parkgolf_current_user') || '';
  });

  // User Profile (OKR)
  const [userProfile, setUserProfile] = useState(null);

  // Welcome Modal State
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);

  // Self Evaluation State (3단계)
  const [knownQuestions, setKnownQuestions] = useState(new Set());
  const [unknownQuestions, setUnknownQuestions] = useState(new Set());

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('parkgolf_auth') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const FREE_LIMIT = 10;

  // Helper function for user-specific localStorage keys
  const getStorageKey = (key) => {
    return currentUser ? `parkgolf_${currentUser}_${key}` : `parkgolf_${key}`;
  };

  // Calculate categories
  const categories = useMemo(() => {
    const cats = {};
    questionsData.forEach(q => {
      if (!cats[q.category]) {
        cats[q.category] = 0;
      }
      cats[q.category]++;
    });
    return Object.entries(cats).map(([name, count]) => ({
      id: name,
      name,
      count
    }));
  }, []);

  // Load data when user changes
  useEffect(() => {
    setQuestions(questionsData);
    setFilteredQuestions(questionsData);

    // Show profile modal if no user is set
    if (!currentUser) {
      setIsProfileModalOpen(true);
      return;
    }

    // Load user profile
    const savedProfile = localStorage.getItem(getStorageKey('profile'));
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile);
        setUserProfile(profile);
        // Show welcome modal on app start (only if profile exists)
        setIsWelcomeModalOpen(true);
      } catch (e) {
        console.error('Failed to load profile:', e);
      }
    } else {
      // 기존 사용자지만 프로필이 없는 경우 - 프로필 설정 모달 표시
      setIsProfileModalOpen(true);
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem(getStorageKey('favorites'));
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Load progress from localStorage
    const savedProgress = localStorage.getItem(getStorageKey('progress'));
    if (savedProgress) {
      try {
        const { currentIndex: savedIndex, selectedCategory: savedCategory } = JSON.parse(savedProgress);
        setSelectedCategory(savedCategory);
        setTimeout(() => {
          setCurrentIndex(savedIndex || 0);
        }, 0);
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }

    // Load self evaluation from localStorage
    const savedEval = localStorage.getItem(getStorageKey('self_eval'));
    if (savedEval) {
      try {
        const { known, unknown } = JSON.parse(savedEval);
        setKnownQuestions(new Set(known || []));
        setUnknownQuestions(new Set(unknown || []));
      } catch (e) {
        console.error('Failed to load self evaluation:', e);
      }
    }
  }, [currentUser]);

  // Filter questions when category changes
  useEffect(() => {
    if (selectedCategory === 'unknown') {
      setFilteredQuestions(questions.filter(q => unknownQuestions.has(q.id)));
    } else if (!selectedCategory) {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.category === selectedCategory));
    }
  }, [selectedCategory, questions, unknownQuestions]);

  // Save progress to localStorage
  useEffect(() => {
    if (questions.length > 0 && currentUser) {
      localStorage.setItem(getStorageKey('progress'), JSON.stringify({
        currentIndex,
        selectedCategory,
        lastStudied: new Date().toISOString()
      }));
    }
  }, [currentIndex, selectedCategory, questions.length, currentUser]);

  // Save self evaluation to localStorage
  useEffect(() => {
    if (!currentUser) return;
    const data = {
      known: Array.from(knownQuestions),
      unknown: Array.from(unknownQuestions)
    };
    localStorage.setItem(getStorageKey('self_eval'), JSON.stringify(data));
  }, [knownQuestions, unknownQuestions, currentUser]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('parkgolf_auth', 'true');
    setIsAuthModalOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      const nextQuestion = filteredQuestions[currentIndex + 1];
      const globalIndex = questions.findIndex(q => q.id === nextQuestion.id);

      if (!isAuthenticated && globalIndex >= FREE_LIMIT) {
        setIsAuthModalOpen(true);
        return;
      }

      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const handleRandom = () => {
    let availableQuestions = filteredQuestions;

    if (!isAuthenticated) {
      // 미인증 시: 전역 인덱스 기준 FREE_LIMIT 이하만 랜덤 대상
      availableQuestions = filteredQuestions.filter(q => {
        const globalIndex = questions.findIndex(gq => gq.id === q.id);
        return globalIndex < FREE_LIMIT;
      });

      if (availableQuestions.length === 0) {
        setIsAuthModalOpen(true);
        return;
      }
    }

    if (availableQuestions.length === 0) return;

    const randomIdx = Math.floor(Math.random() * availableQuestions.length);
    const targetQuestion = availableQuestions[randomIdx];
    const newIndex = filteredQuestions.findIndex(q => q.id === targetQuestion.id);

    setTimeout(() => setCurrentIndex(newIndex), 200);
  };

  const handleSelectQuestion = (id) => {
    const globalIndex = questions.findIndex(q => q.id === id);
    if (globalIndex === -1) return;

    if (!isAuthenticated && globalIndex >= FREE_LIMIT) {
      setIsAuthModalOpen(true);
      return;
    }

    const indexInFiltered = filteredQuestions.findIndex(q => q.id === id);

    if (indexInFiltered !== -1) {
      setTimeout(() => setCurrentIndex(indexInFiltered), 200);
    } else {
      setSelectedCategory(null);
    }
  };

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    setCurrentIndex(0);
  };

  const toggleFavorite = (id) => {
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fid => fid !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    setFavorites(newFavorites);
    localStorage.setItem(getStorageKey('favorites'), JSON.stringify(newFavorites));
  };

  // Profile handlers
  const handleSaveProfile = (profileData) => {
    const { name, objective, examDate } = profileData;
    const isNewUserSetup = !currentUser;

    // Save current user
    localStorage.setItem('parkgolf_current_user', name);
    setCurrentUser(name);

    // Save profile data
    const profile = { name, objective, examDate };
    const profileKey = `parkgolf_${name}_profile`;
    localStorage.setItem(profileKey, JSON.stringify(profile));
    setUserProfile(profile);

    // Reset state if switching users (not editing)
    if (!isEditingProfile && !isNewUserSetup) {
      // Load existing user's data if any
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

    // Show welcome modal after profile setup
    if (isNewUserSetup || isEditingProfile) {
      setTimeout(() => setIsWelcomeModalOpen(true), 300);
    }
  };

  const handleSwitchUser = () => {
    setIsEditingProfile(false);
    setIsProfileModalOpen(true);
    setIsStatsModalOpen(false);
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setIsProfileModalOpen(true);
    setIsStatsModalOpen(false);
  };

  const handleResetProgress = () => {
    setKnownQuestions(new Set());
    setUnknownQuestions(new Set());
    setCurrentIndex(0);
    setSelectedCategory(null);
    localStorage.removeItem(getStorageKey('self_eval'));
    localStorage.removeItem(getStorageKey('progress'));
  };

  // Self evaluation handler
  const handleSelfEval = (questionId, result) => {
    if (result === 'known') {
      setKnownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.add(questionId);
        return newSet;
      });
      setUnknownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    } else {
      setUnknownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.add(questionId);
        return newSet;
      });
      setKnownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }

    if (currentIndex < filteredQuestions.length - 1) {
      setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
    }
  };

  if (questions.length === 0) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="animate-pulse text-green-600 font-bold text-xl">
        문제를 불러오는 중...
      </div>
    </div>
  );

  const currentQuestion = filteredQuestions[currentIndex];
  const studiedCount = knownQuestions.size + unknownQuestions.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center py-8 px-4 font-sans select-none overflow-hidden">

      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <KMYLogo className="w-10 h-10 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">건강증진교육개발KMY협회</span>
              {selectedCategory && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${
                  selectedCategory === 'unknown'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {selectedCategory === 'unknown'
                    ? '복습'
                    : categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
            <h1 className="text-sm font-bold text-gray-900 tracking-tight leading-tight whitespace-nowrap">파크골프 마스터</h1>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="p-1.5 bg-white rounded-full text-gray-600 shadow-sm active:scale-95 transition-transform"
            aria-label="학습 통계"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className={`p-1.5 rounded-full shadow-sm active:scale-95 transition-all ${
              selectedCategory
                ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                : 'bg-white text-gray-600'
            }`}
            aria-label="카테고리 선택"
          >
            <Layers className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1.5 bg-white rounded-full text-gray-600 shadow-sm active:scale-95 transition-transform"
            aria-label="문제 검색"
          >
            <Search className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1 text-sm font-bold text-gray-600 bg-white px-2 py-1.5 rounded-full shadow-sm">
            <BookOpen className="w-3 h-3" />
            <span>{currentIndex + 1}/{filteredQuestions.length}</span>
          </div>
        </div>
      </header>

      {/* Main Card Area */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center perspective-1000 mb-8">
        {currentQuestion ? (
          <Flashcard
            key={currentQuestion.id}
            question={currentQuestion}
            isFavorite={favorites.includes(currentQuestion.id)}
            onToggleFavorite={toggleFavorite}
            onSelfEval={handleSelfEval}
            evalStatus={
              knownQuestions.has(currentQuestion.id) ? 'known' :
              unknownQuestions.has(currentQuestion.id) ? 'unknown' : null
            }
          />
        ) : (
          <div className="flex flex-col items-center justify-center p-8 bg-white/50 rounded-3xl h-96">
            <p className="text-gray-500 font-medium">해당하는 문제가 없습니다.</p>
            <button
              onClick={() => handleCategorySelect(null)}
              className="mt-4 px-6 py-2 bg-primary-500 text-white rounded-xl font-bold hover:bg-primary-600 transition-colors"
            >
              전체 보기
            </button>
          </div>
        )}
      </main>

      {/* Controls */}
      <Controls
        onNext={handleNext}
        onPrev={handlePrev}
        onRandom={handleRandom}
        isFirst={currentIndex === 0}
        isLast={currentIndex === filteredQuestions.length - 1}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        questions={questions}
        onSelectQuestion={(id) => {
          // 항상 인증 체크를 먼저 수행
          const globalIdx = questions.findIndex(q => q.id === id);
          if (!isAuthenticated && globalIdx >= FREE_LIMIT) {
            setIsAuthModalOpen(true);
            return;
          }

          const filteredIdx = filteredQuestions.findIndex(q => q.id === id);
          if (filteredIdx !== -1) {
            handleSelectQuestion(id);
          } else {
            setSelectedCategory(null);
            setTimeout(() => {
                if (globalIdx !== -1) setCurrentIndex(globalIdx);
            }, 0);
          }
        }}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
        unknownCount={unknownQuestions.size}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthSuccess}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        questions={questions}
        categories={categories}
        knownQuestions={knownQuestions}
        unknownQuestions={unknownQuestions}
        onStartUnknownReview={() => handleCategorySelect('unknown')}
        profile={userProfile}
        onSwitchUser={handleSwitchUser}
        onEditProfile={handleEditProfile}
        onResetProgress={handleResetProgress}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setIsEditingProfile(false);
        }}
        onSaveProfile={handleSaveProfile}
        currentUser={currentUser}
        isNewUser={!currentUser}
        existingProfile={isEditingProfile ? userProfile : null}
      />

      <WelcomeModal
        isOpen={isWelcomeModalOpen}
        onClose={() => setIsWelcomeModalOpen(false)}
        profile={userProfile}
        totalQuestions={questions.length}
        studiedCount={studiedCount}
      />
    </div>
  );
};

export default App;
