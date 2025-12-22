import { useState, useEffect, useRef } from 'react';
import { Search, X, ChevronRight } from 'lucide-react';

const SearchModal = ({ isOpen, onClose, questions, onSelectQuestion }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 100);
    }
  }, [isOpen]);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setResults([]);
      return;
    }

    const filtered = questions.filter(q =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.id.toString().includes(searchTerm)
    );
    setResults(filtered);
  }, [searchTerm, questions]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-10 px-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Search Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <Search className="w-6 h-6 text-primary-500" />
          <input 
            ref={inputRef}
            type="text" 
            placeholder="단어 또는 번호를 입력하세요 (예: OB, 89)"
            className="flex-1 text-lg font-medium outline-none placeholder:text-gray-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          {searchTerm === '' ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
              <Search className="w-12 h-12 mb-3 opacity-20" />
              <p>검색어를 입력하시면<br/>관련된 문제를 찾아드려요.</p>
            </div>
          ) : results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center">
              <p>검색 결과가 없어요 😢</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((q) => (
                <button
                  key={q.id}
                  onClick={() => {
                    onSelectQuestion(q.id);
                    onClose();
                  }}
                  className="w-full text-left p-4 rounded-xl hover:bg-primary-50 transition-colors group border border-transparent hover:border-primary-100"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-primary-600 bg-primary-100 px-2 py-0.5 rounded-full">
                          {q.category}
                        </span>
                        <span className="text-xs text-gray-400">Q.{q.id}</span>
                      </div>
                      <p className="font-medium text-gray-800 line-clamp-2 leading-relaxed">
                        {q.question}
                      </p>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-1">
                        답: {q.answer}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-400 mt-2 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer Info */}
        {results.length > 0 && (
          <div className="p-3 bg-gray-50 border-t border-gray-100 text-center text-xs text-gray-400">
            총 {results.length}개의 문제를 찾았습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchModal;
