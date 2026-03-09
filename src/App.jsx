import { useState, useEffect, useMemo } from 'react';
import { BookOpen, Search, Layers, BarChart3 } from 'lucide-react';
import KMYLogo from './components/KMYLogo';
import AdBanner from './components/AdBanner';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import CategoryModal from './components/CategoryModal';
import StatsModal from './components/StatsModal';
import ProfileModal from './components/ProfileModal';
import WelcomeModal from './components/WelcomeModal';
import useAuth from './hooks/useAuth';
import useUserData from './hooks/useUserData';
import questionsData from './data/questions.json';

const App = () => {
  const [questions] = useState(questionsData);
  const [filteredQuestions, setFilteredQuestions] = useState(questionsData);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);

  const auth = useAuth();
  const userData = useUserData();

  // Calculate categories
  const categories = useMemo(() => {
    const cats = {};
    questionsData.forEach(q => {
      if (!cats[q.category]) cats[q.category] = 0;
      cats[q.category]++;
    });
    return Object.entries(cats).map(([name, count]) => ({ id: name, name, count }));
  }, []);

  // ID → global index Map for O(1) lookup (P1-3 성능 개선)
  const questionIndexMap = useMemo(() =>
    new Map(questions.map((q, i) => [q.id, i])),
    [questions]
  );

  // Keyboard navigation (좌우 화살표)
  useEffect(() => {
    const anyModalOpen = isSearchOpen || isCategoryModalOpen || isStatsModalOpen ||
      auth.isAuthModalOpen || userData.isProfileModalOpen || userData.isWelcomeModalOpen;

    const handleKeyDown = (e) => {
      if (anyModalOpen) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Filter questions when category changes
  useEffect(() => {
    if (userData.selectedCategory === 'unknown') {
      setFilteredQuestions(questions.filter(q => userData.unknownQuestions.has(q.id)));
    } else if (!userData.selectedCategory) {
      setFilteredQuestions(questions);
    } else {
      setFilteredQuestions(questions.filter(q => q.category === userData.selectedCategory));
    }
  }, [userData.selectedCategory, questions, userData.unknownQuestions]);

  const handleNext = () => {
    if (userData.currentIndex < filteredQuestions.length - 1) {
      const nextQuestion = filteredQuestions[userData.currentIndex + 1];
      const globalIndex = questionIndexMap.get(nextQuestion.id) ?? -1;

      if (!auth.isAuthenticated && globalIndex >= auth.FREE_LIMIT) {
        auth.setIsAuthModalOpen(true);
        return;
      }
      setTimeout(() => userData.setCurrentIndex(prev => prev + 1), 200);
    }
  };

  const handlePrev = () => {
    if (userData.currentIndex > 0) {
      setTimeout(() => userData.setCurrentIndex(prev => prev - 1), 200);
    }
  };

  const handleRandom = () => {
    let availableQuestions = filteredQuestions;

    if (!auth.isAuthenticated) {
      availableQuestions = filteredQuestions.filter(q =>
        (questionIndexMap.get(q.id) ?? Infinity) < auth.FREE_LIMIT
      );
      if (availableQuestions.length === 0) {
        auth.setIsAuthModalOpen(true);
        return;
      }
    }

    if (availableQuestions.length === 0) return;

    const randomIdx = Math.floor(Math.random() * availableQuestions.length);
    const targetQuestion = availableQuestions[randomIdx];
    const newIndex = filteredQuestions.findIndex(q => q.id === targetQuestion.id);
    setTimeout(() => userData.setCurrentIndex(newIndex), 200);
  };

  const handleSelectQuestion = (id) => {
    const globalIndex = questionIndexMap.get(id) ?? -1;
    if (globalIndex === -1) return;

    if (!auth.isAuthenticated && globalIndex >= auth.FREE_LIMIT) {
      auth.setIsAuthModalOpen(true);
      return;
    }

    const indexInFiltered = filteredQuestions.findIndex(q => q.id === id);
    if (indexInFiltered !== -1) {
      setTimeout(() => userData.setCurrentIndex(indexInFiltered), 200);
    } else {
      userData.setSelectedCategory(null);
    }
  };

  const handleCategorySelect = (catId) => {
    userData.setSelectedCategory(catId);
    userData.setCurrentIndex(0);
  };

  if (questions.length === 0) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="animate-pulse text-green-600 font-bold text-xl">
        문제를 불러오는 중...
      </div>
    </div>
  );

  const currentQuestion = filteredQuestions[userData.currentIndex];
  const studiedCount = userData.knownQuestions.size + userData.unknownQuestions.size;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center py-8 px-4 font-sans select-none overflow-hidden">

      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <KMYLogo className="w-10 h-10 shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-1 mb-0.5">
              <span className="text-[9px] text-gray-500 font-medium whitespace-nowrap">건강증진교육개발KMY협회</span>
              {userData.selectedCategory && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold whitespace-nowrap ${
                  userData.selectedCategory === 'unknown'
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-primary-100 text-primary-700'
                }`}>
                  {userData.selectedCategory === 'unknown'
                    ? '복습'
                    : categories.find(c => c.id === userData.selectedCategory)?.name}
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
              userData.selectedCategory
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
            <span>{userData.currentIndex + 1}/{filteredQuestions.length}</span>
          </div>
        </div>
      </header>

      {/* Main Card Area */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center perspective-1000 mb-8">
        {currentQuestion ? (
          <Flashcard
            key={currentQuestion.id}
            question={currentQuestion}
            isFavorite={userData.favorites.includes(currentQuestion.id)}
            onToggleFavorite={userData.toggleFavorite}
            onSelfEval={(qId, result) => userData.handleSelfEval(qId, result, filteredQuestions.length)}
            evalStatus={
              userData.knownQuestions.has(currentQuestion.id) ? 'known' :
              userData.unknownQuestions.has(currentQuestion.id) ? 'unknown' : null
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
        isFirst={userData.currentIndex === 0}
        isLast={userData.currentIndex === filteredQuestions.length - 1}
      />

      {/* Ad Banners */}
      <div className="w-full max-w-md mt-6 space-y-3">
        <AdBanner type="book" />
        <AdBanner type="sponsor" />
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        questions={questions}
        onSelectQuestion={(id) => {
          const globalIdx = questionIndexMap.get(id) ?? -1;
          if (!auth.isAuthenticated && globalIdx >= auth.FREE_LIMIT) {
            auth.setIsAuthModalOpen(true);
            return;
          }

          const filteredIdx = filteredQuestions.findIndex(q => q.id === id);
          if (filteredIdx !== -1) {
            handleSelectQuestion(id);
          } else {
            userData.setSelectedCategory(null);
            setTimeout(() => {
              if (globalIdx !== -1) userData.setCurrentIndex(globalIdx);
            }, 0);
          }
        }}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        categories={categories}
        selectedCategory={userData.selectedCategory}
        onSelectCategory={handleCategorySelect}
        unknownCount={userData.unknownQuestions.size}
      />

      <AuthModal
        isOpen={auth.isAuthModalOpen}
        onClose={() => auth.setIsAuthModalOpen(false)}
        onAuthenticate={auth.handleAuthSuccess}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        questions={questions}
        categories={categories}
        knownQuestions={userData.knownQuestions}
        unknownQuestions={userData.unknownQuestions}
        onStartUnknownReview={() => handleCategorySelect('unknown')}
        profile={userData.userProfile}
        onSwitchUser={() => { userData.handleSwitchUser(); setIsStatsModalOpen(false); }}
        onEditProfile={() => { userData.handleEditProfile(); setIsStatsModalOpen(false); }}
        onResetProgress={userData.handleResetProgress}
      />

      <ProfileModal
        isOpen={userData.isProfileModalOpen}
        onClose={() => {
          userData.setIsProfileModalOpen(false);
          userData.setIsEditingProfile(false);
        }}
        onSaveProfile={userData.handleSaveProfile}
        currentUser={userData.currentUser}
        isNewUser={!userData.currentUser}
        existingProfile={userData.isEditingProfile ? userData.userProfile : null}
      />

      <WelcomeModal
        isOpen={userData.isWelcomeModalOpen}
        onClose={() => userData.setIsWelcomeModalOpen(false)}
        profile={userData.userProfile}
        totalQuestions={questions.length}
        studiedCount={studiedCount}
      />
    </div>
  );
};

export default App;
