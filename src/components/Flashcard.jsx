import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Star } from 'lucide-react';

const Flashcard = ({ question, isFavorite, onToggleFavorite }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  React.useEffect(() => {
    setIsFlipped(false);
  }, [question.id]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="w-full max-w-md aspect-[4/5] mx-auto perspective-1000 relative cursor-pointer" onClick={handleFlip}>
      <motion.div
        className="w-full h-full relative preserve-3d transition-transform duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}>
        {/* Front Face (Question) */}
        <div className="absolute w-full h-full backface-hidden bg-white rounded-3xl shadow-xl border-2 border-primary-100 p-6 flex flex-col items-center justify-center text-center">
          
          {/* Top Elements */}
          <span className="absolute top-6 left-6 text-base font-bold text-primary-600 bg-primary-50 px-4 py-1.5 rounded-full uppercase tracking-wider">
            {question.category}
          </span>
          
          {/* High Contrast Q number (text-gray-400 with 100% opacity) */}
          <span className="absolute top-7 left-1/2 -translate-x-1/2 text-3xl font-black text-gray-400 tracking-tighter select-none z-0">
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

          <div className="flex-1 flex flex-col items-center justify-center w-full mt-12 px-2 z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 leading-snug break-keep">
              {question.question}
            </h2>
            <p className="mt-8 text-lg text-primary-400 font-medium animate-pulse">
              터치하여 정답 👆
            </p>
          </div>
        </div>

        {/* Back Face (Answer) */}
        <div className="absolute w-full h-full backface-hidden bg-primary-600 rounded-3xl shadow-xl p-8 flex flex-col items-center justify-center text-center rotate-y-180 text-white">
          <span className="absolute top-7 left-1/2 -translate-x-1/2 text-3xl font-black text-primary-200 tracking-tighter select-none opacity-50">
            A {question.id}
          </span>

          <div className="flex-1 flex flex-col items-center justify-center w-full overflow-y-auto max-h-[65vh] px-4 custom-scrollbar mt-10">
            <h3 className="text-xl md:text-2xl font-medium leading-loose break-keep whitespace-pre-line text-left w-full">
              {question.answer}
            </h3>
          </div>
          <div className="absolute bottom-6 flex items-center gap-2 text-primary-100 text-lg">
             <RefreshCw className="w-5 h-5" /> 다시 터치하여 문제 보기
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Flashcard;