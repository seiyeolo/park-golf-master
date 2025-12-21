import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, Star, Check, X } from 'lucide-react';

const Flashcard = ({ question, isFavorite, onToggleFavorite, onSelfEval, evalStatus }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  React.useEffect(() => {
    setIsFlipped(false);
  }, [question.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSelfEvalClick = (result) => {
    console.log(`${result === 'known' ? '알았어요' : '몰랐어요'} 클릭:`, question.id);
    if (onSelfEval) {
      onSelfEval(question.id, result);
    }
  };

  return (
    <div className="w-full max-w-md aspect-[4/5] mx-auto relative">
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          /* Front Face (Question) */
          <motion.div
            key="front"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full h-full bg-white rounded-3xl shadow-xl border-[3px] border-gray-200 p-6 flex flex-col items-center justify-center text-center cursor-pointer"
            onClick={handleFlip}
          >
            {/* Top Elements */}
            <span className="absolute top-6 left-6 text-base font-bold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full uppercase tracking-wider">
              {question.category}
            </span>
            
            {/* High Contrast Q number */}
            <span className="absolute top-7 left-1/2 -translate-x-1/2 text-3xl font-black text-gray-400 tracking-tighter select-none">
              Q {question.id}
            </span>

            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(question.id);
              }}
              className={`absolute top-6 right-6 p-2 rounded-full transition-colors z-10 ${isFavorite ? 'text-yellow-400 bg-yellow-50' : 'text-gray-300 hover:bg-gray-50'}`}>
              <Star className={`w-8 h-8 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <div className="flex-1 flex flex-col items-center justify-center w-full mt-12 px-2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug break-keep">
                {question.question}
              </h2>
              <p className="mt-8 text-lg text-primary-400 font-medium animate-pulse">
                터치하여 정답 👆
              </p>
            </div>
          </motion.div>
        ) : (
          /* Back Face (Answer) */
          <motion.div
            key="back"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute w-full h-full bg-primary-600 rounded-3xl shadow-xl border-[3px] border-primary-500 p-8 flex flex-col items-center justify-center text-center text-white"
          >
            <span className="absolute top-7 left-1/2 -translate-x-1/2 text-3xl font-black text-primary-200 tracking-tighter select-none opacity-50">
              A {question.id}
            </span>

            {/* 현재 평가 상태 표시 */}
            {evalStatus && (
              <div className={`absolute top-6 right-6 px-3 py-1 rounded-full text-sm font-bold ${
                evalStatus === 'known' ? 'bg-green-400 text-green-900' : 'bg-orange-400 text-orange-900'
              }`}>
                {evalStatus === 'known' ? '✓ 알았음' : '✗ 몰랐음'}
              </div>
            )}

            {/* 정답 내용 - 클릭하면 뒤집기 */}
            <div 
              className="flex-1 flex flex-col items-center justify-center w-full overflow-y-auto max-h-[50vh] px-4 custom-scrollbar mt-10 cursor-pointer"
              onClick={handleFlip}
            >
              <h3 className="text-xl md:text-2xl font-medium leading-loose break-keep whitespace-pre-line text-left w-full">
                {question.answer}
              </h3>
            </div>

            {/* 자기평가 버튼 */}
            <div className="absolute bottom-20 flex gap-4">
              <button
                type="button"
                onClick={() => handleSelfEvalClick('known')}
                className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <Check className="w-5 h-5" />
                알았어요
              </button>
              <button
                type="button"
                onClick={() => handleSelfEvalClick('unknown')}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-400 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                <X className="w-5 h-5" />
                몰랐어요
              </button>
            </div>

            <div 
              className="absolute bottom-6 flex items-center gap-2 text-primary-100 text-sm cursor-pointer"
              onClick={handleFlip}
            >
               <RefreshCw className="w-4 h-4" /> 터치하여 문제 보기
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Flashcard;
