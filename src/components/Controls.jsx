import React from 'react';
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';

const Controls = ({ onNext, onPrev, onRandom, isFirst, isLast }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto mt-8 px-4">
      <button 
        onClick={onPrev}
        disabled={isFirst}
        className={`p-4 rounded-full transition-all ${isFirst ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-700 shadow-lg hover:bg-gray-50 active:scale-95'}`}>
        <ArrowLeft className="w-8 h-8" />
      </button>

      <button 
        onClick={onRandom}
        className="flex items-center gap-2 px-8 py-4 bg-primary-100 text-primary-700 rounded-full font-bold text-lg hover:bg-primary-200 transition-colors">
        <Shuffle className="w-5 h-5" />
        랜덤
      </button>

      <button 
        onClick={onNext}
        disabled={isLast}
        className={`p-4 rounded-full transition-all ${isLast ? 'bg-gray-100 text-gray-300' : 'bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95'}`}>
        <ArrowRight className="w-8 h-8" />
      </button>
    </div>
  );
};

export default Controls;