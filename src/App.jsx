import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Info, RotateCcw, Search, Menu } from 'lucide-react';
import Flashcard from './components/Flashcard';
import Controls from './components/Controls';
import SearchModal from './components/SearchModal';
import AuthModal from './components/AuthModal';
import questionsData from './data/questions.json';

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('parkgolf_auth') === 'true';
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const FREE_LIMIT = 10; // First 10 questions are free

  useEffect(() => {
    setQuestions(questionsData);
    
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('parkgolf_favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    localStorage.setItem('parkgolf_auth', 'true');
    setIsAuthModalOpen(false);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      // Check for lock
      if (!isAuthenticated && currentIndex >= FREE_LIMIT - 1) {
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
    // Random also needs to be restricted or allowed within range?
    // Let's restrict random to full set only if authenticated
    if (!isAuthenticated) {
      // If not auth, random only within free limit
      const randomIndex = Math.floor(Math.random() * FREE_LIMIT);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(randomIndex), 200);
    } else {
      const randomIndex = Math.floor(Math.random() * questions.length);
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(randomIndex), 200);
    }
  };

  const handleSelectQuestion = (id) => {
    // Check if selected question is within limit or auth
    const index = questions.findIndex(q => q.id === id);
    if (!isAuthenticated && index >= FREE_LIMIT) {
      setIsAuthModalOpen(true);
      return;
    }
    if (index !== -1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(index), 200);
    }
  };

  const toggleFavorite = (id) => {
    let newFavorites;
    if (favorites.includes(id)) {
      newFavorites = favorites.filter(fid => fid !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    setFavorites(newFavorites);
    localStorage.setItem('parkgolf_favorites', JSON.stringify(newFavorites));
  };

  if (questions.length === 0) return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <div className="animate-pulse text-green-600 font-bold text-xl">
        문제를 불러오는 중...
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center py-8 px-4 font-sans select-none overflow-hidden">
      
      {/* Header */}
      <header className="w-full max-w-md flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-primary-600 p-2.5 rounded-xl shadow-lg shrink-0">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs text-primary-600 font-bold mb-0.5">국가자격스포츠지도사</p>
            <h1 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">파크골프 한권으로 마스터</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 bg-white rounded-full text-gray-600 shadow-sm active:scale-95 transition-transform"
            aria-label="문제 검색"
          >
            <Search className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 text-base font-bold text-gray-600 bg-white px-4 py-2 rounded-full shadow-sm">
            <BookOpen className="w-4 h-4" />
            <span>{currentIndex + 1} / {questions.length}</span>
          </div>
        </div>
      </header>

      {/* Main Card Area */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center perspective-1000 mb-8">
        <Flashcard 
          question={questions[currentIndex]} 
          isFlipped={isFlipped} 
          setIsFlipped={setIsFlipped}
          isFavorite={favorites.includes(questions[currentIndex].id)}
          onToggleFavorite={toggleFavorite}
        />
      </main>

      {/* Controls */}
      <Controls 
        onNext={handleNext} 
        onPrev={handlePrev} 
        onRandom={handleRandom}
        isFirst={currentIndex === 0}
        isLast={currentIndex === questions.length - 1}
      />

      <SearchModal 
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        questions={questions}
        onSelectQuestion={handleSelectQuestion}
      />

      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthenticate={handleAuthSuccess}
      />
    </div>
  );
};

export default App;
