import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Trophy, Search, Layers, BarChart3 } from 'lucide-react';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import CategoryModal from './components/CategoryModal';
import StatsModal from './components/StatsModal';
import ProfileModal from './components/ProfileModal';
import questionsData from './data/questions.json';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Category State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Stats Modal State
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  // Profile Modal State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('parkgolf_current_user') || '';
  });

  // Self Evaluation State (3단계)
  const [knownQuestions, setKnownQuestions] = useState(new Set());
  const [unknownQuestions, setUnknownQuestions] = useState(new Set());

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('parkgolf_auth') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const FREE_LIMIT = 10; // First 10 questions are free

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

  useEffect(() => {
    setQuestions(questionsData);
    setFilteredQuestions(questionsData);

    // Show profile modal if no user is set
    if (!currentUser) {
      setIsProfileModalOpen(true);
      return; // Don't load data until user is set
    }

    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem(getStorageKey('favorites'));
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // 2단계: Load progress from localStorage
    const savedProgress = localStorage.getItem(getStorageKey('progress'));
    if (savedProgress) {
      try {
        const { currentIndex: savedIndex, selectedCategory: savedCategory } = JSON.parse(savedProgress);
        setSelectedCategory(savedCategory);
        // Delay setting index to allow category filter to apply
        setTimeout(() => {
          setCurrentIndex(savedIndex || 0);
        }, 0);
      } catch (e) {
        console.error('Failed to load progress:', e);
      }
    }

    // 3단계: Load self evaluation from localStorage
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
      // 3단계: 몰랐던 문제만 필터링
      setFilteredQuestions(questions.filter(q => unknownQuestions.has(q.id)));
    } else if (!selectedCategory) {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.category === selectedCategory));
    }
    // Note: currentIndex reset is handled in handleCategorySelect to avoid conflicts with search
  }, [selectedCategory, questions, unknownQuestions]);

  // 2단계: Save progress to localStorage
  useEffect(() => {
    if (questions.length > 0 && currentUser) {
      localStorage.setItem(getStorageKey('progress'), JSON.stringify({
        currentIndex,
        selectedCategory,
        lastStudied: new Date().toISOString()
      }));
    }
  }, [currentIndex, selectedCategory, questions.length, currentUser]);

  // 3단계: Save self evaluation to localStorage
  useEffect(() => {
    if (!currentUser) return;
    const data = {
      known: Array.from(knownQuestions),
      unknown: Array.from(unknownQuestions)
    };
    console.log('localStorage 저장:', data);
    localStorage.setItem(getStorageKey('self_eval'), JSON.stringify(data));
  }, [knownQuestions, unknownQuestions, currentUser]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('parkgolf_auth', 'true');
    setIsAuthModalOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < filteredQuestions.length - 1) {
      // Check for lock (only if using full list or if specific logic needed per category)
      // If authenticating based on global ID, we need to check the global ID of the next question?
      // Or just simple count based? The requirement says "First 10 questions free". 
      // Assuming this means the first 10 VALID questions in the current view? 
      // Or first 10 valid questions in ALL questions?
      // Usually "First 10 questions" means questions with ID 1-10.
      
      const nextQuestion = filteredQuestions[currentIndex + 1];
      const globalIndex = questions.findIndex(q => q.id === nextQuestion.id);

      if (!isAuthenticated && globalIndex >= FREE_LIMIT) {
        setIsAuthModalOpen(true);
        return;
      }

      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const handleRandom = () => {
    // If not authenticated, we need to ensure the random question is within free limit
    let availableQuestions = filteredQuestions;
    
    if (!isAuthenticated) {
      // Filter available to only those within free limit (globally first 10)
      // Assuming questionsData is sorted by ID 1..N
      if (selectedCategory) {
        // This might result in empty list if category has no free questions
         availableQuestions = filteredQuestions.filter(q => {
           const globalIndex = questions.findIndex(gq => gq.id === q.id);
           return globalIndex < FREE_LIMIT;
         });
      } else {
         // for all
         availableQuestions = filteredQuestions.filter((_, idx) => idx < FREE_LIMIT);
      }
      
      if (availableQuestions.length === 0) {
        setIsAuthModalOpen(true);
        return;
      }
    }

    const randomIdx = Math.floor(Math.random() * availableQuestions.length);
    const targetQuestion = availableQuestions[randomIdx];
    // Find index in current filtered list
    const newIndex = filteredQuestions.findIndex(q => q.id === targetQuestion.id);
    
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(newIndex), 200);
  };

  const handleSelectQuestion = (id) => {
    // If selecting a question, it might switch categories if we were strictly enforcing category view?
    // Current design: Search can select any question. 
    // If we select a question NOT in current category -> Switch to All or that Category?
    // Let's switch to All if not found in current category, or just force switch category.
    // Simplest: Switch to "All" to show it.
    
    const globalIndex = questions.findIndex(q => q.id === id);
    if (globalIndex === -1) return;

    if (!isAuthenticated && globalIndex >= FREE_LIMIT) {
      setIsAuthModalOpen(true);
      return;
    }

    // Check if in current filtered list
    const indexInFiltered = filteredQuestions.findIndex(q => q.id === id);
    
    if (indexInFiltered !== -1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(indexInFiltered), 200);
    } else {
      // Not in current category, switch to All (or find category)
      setSelectedCategory(null);
      // We need to wait for effect to update filteredQuestions to All
      // BUT effect is async-ish. 
      // We can force it or separate the index setting.
      // For now: Just clear category, and effect will reset index to 0. 
      // We want to jump to specific index. 
      // Solution: Add a transient effect or generic state?
      // Let's just set timeout to wait for category switch?
      // Or better: pass a targetId to the effect.
      // Let's keep it simple: Reset category, user loses context but finds question.
      // Better: find which category it belongs to and switch to that? 
      // Or just switch to NULL (All) and then set index.
      
      // Since setting state is batched/async, complex.
      // Let's just set SelectedCategory(null) and rely on the fact that the effect 
      // sets index to 0. We want index to be `globalIndex`.
      
      // We can just set SelectedCategory(null) and handle the index jump in a separate flow?
      // Let's modify the effect to NOT reset index if we have a pending target? 
      // Or just:
      setSelectedCategory(null);
      // Wait for re-render with all questions? 
      // Actually, if we set SelectedCategory(null), next render `filteredQuestions` will be `questions`.
      // But we can't set `currentIndex` immediately to `globalIndex` because `filteredQuestions` is stale in this closure?
      // Actually `questions` is available.
      
      // Workaround: Use a ref or just accept that searching outside category resets view to All and 1st question for now?
      // Better Workaround: We can't easily jump to it without more complex state. 
      // Let's just switch to ALL and let user search again? No that's duplicate.
      
      // Let's try to set it. 
      // We can chain it? 
      // Actually, if we use `search` we expect to go to that question.
      // Let's implement a `pendingQuestionId` state if needed, or:
      // Just set `selectedCategory` to null, and `currentIndex` to `globalIndex`.
      // The effect `[selectedCategory]` resets `currentIndex` to 0. This conflicts.
      // We should change the effect to only reset if we don't have a specific target.
      // But `currentIndex` is simple number.
      
      // Let's change the effect dependencies or logic.
      // If we remove `setCurrentIndex(0)` from effect, we must handle it elsewhere.
      // Let's do that. Move reset logic to `onSelectCategory`.
    }
  };
  
  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    // Logic to reset index is moved here to avoid conflict with Search jump
    setCurrentIndex(0);
    setIsFlipped(false);
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
  const handleSaveProfile = (name) => {
    localStorage.setItem('parkgolf_current_user', name);
    setCurrentUser(name);
    // Reset state to load new user's data
    setKnownQuestions(new Set());
    setUnknownQuestions(new Set());
    setFavorites([]);
    setCurrentIndex(0);
    setSelectedCategory(null);
  };

  const handleSwitchUser = () => {
    setIsProfileModalOpen(true);
    setIsStatsModalOpen(false);
  };

  const handleResetProgress = () => {
    // Clear all learning data for current user
    setKnownQuestions(new Set());
    setUnknownQuestions(new Set());
    setCurrentIndex(0);
    setSelectedCategory(null);
    // Clear from localStorage
    localStorage.removeItem(getStorageKey('self_eval'));
    localStorage.removeItem(getStorageKey('progress'));
  };

  // 3단계: 자기평가 핸들러
  const handleSelfEval = (questionId, result) => {
    console.log('handleSelfEval 호출:', questionId, result);

    if (result === 'known') {
      setKnownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.add(questionId);
        console.log('knownQuestions 업데이트:', Array.from(newSet));
        return newSet;
      });
      // unknown에서 제거
      setUnknownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    } else {
      setUnknownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.add(questionId);
        console.log('unknownQuestions 업데이트:', Array.from(newSet));
        return newSet;
      });
      // known에서 제거
      setKnownQuestions(prev => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
    // 자동으로 다음 문제로 이동
    if (currentIndex < filteredQuestions.length - 1) {
      setIsFlipped(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center py-8 px-4 font-sans select-none overflow-hidden">
      
      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2.5 rounded-xl shadow-lg shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-xs text-primary-600 font-bold">국가자격스포츠지도사</span>
              {selectedCategory && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  selectedCategory === 'unknown'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {selectedCategory === 'unknown'
                    ? '몰랐던 문제'
                    : categories.find(c => c.id === selectedCategory)?.name}
                </span>
              )}
            </div>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">파크골프 한권으로 마스터</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="p-2 bg-white rounded-full text-gray-600 shadow-sm active:scale-95 transition-transform"
            aria-label="학습 통계"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className={`p-2 rounded-full shadow-sm active:scale-95 transition-all ${
              selectedCategory
                ? 'bg-primary-100 text-primary-600 ring-2 ring-primary-500'
                : 'bg-white text-gray-600'
            }`}
            aria-label="카테고리 선택"
          >
            <Layers className="w-5 h-5" />
          </button>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-2 bg-white rounded-full text-gray-600 shadow-sm active:scale-95 transition-transform"
            aria-label="문제 검색"
          >
            <Search className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-base font-bold text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm min-w-[80px] justify-center">
            <BookOpen className="w-4 h-4" />
            <span>{currentIndex + 1} / {filteredQuestions.length}</span>
          </div>
        </div>
      </header>

      {/* Main Card Area */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center perspective-1000 mb-8">
        {currentQuestion ? (
          <Flashcard
            question={currentQuestion}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
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
          // If in current category, just jump
          // If not, switch to all and jump
          
          const filteredIdx = filteredQuestions.findIndex(q => q.id === id);
          if (filteredIdx !== -1) {
            handleSelectQuestion(id);
          } else {
            // Need to switch to All -> then Jump
            // Or find which category it is in? 
            // Simplest UX: Just switch to All.
            setSelectedCategory(null);
            // We need to set index AFTER render or effect update. 
            // This is tricky in React without extra state.
            // As a simple fix for now, we will perform a 'hack' by not resetting index in effect if we are jumping.
            // BUT easier: Just set the logic to find global index and set it.
            // Since we set selectedCategory(null), filteredQuestions will become questions in next render.
            // We can use a requestAnimationFrame or setTimeout to set index? 
            // Or just force it?
            
            // Let's try:
            setSelectedCategory(null);
            setTimeout(() => {
                const globalIdx = questions.findIndex(q => q.id === id);
                if (globalIdx !== -1) setCurrentIndex(globalIdx);
                setIsFlipped(false);
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
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onResetProgress={handleResetProgress}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={handleSaveProfile}
        currentUser={currentUser}
        isNewUser={!currentUser}
      />
    </div>
  );
};

export default App;
