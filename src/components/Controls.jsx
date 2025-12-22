import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react';

const Controls = ({ onNext, onPrev, onRandom, isFirst, isLast }) => {
  return (
    <div className="flex items-center justify-between w-full max-w-md mx-auto px-4 pb-safe">
      <button
        onClick={onPrev}
        disabled={isFirst}
        className={`p-3 rounded-full transition-all ${isFirst ? 'bg-gray-100 text-gray-300' : 'bg-white text-gray-700 shadow-lg hover:bg-gray-50 active:scale-95'}`}>
        <ArrowLeft className="w-6 h-6" />
      </button>

      <button
        onClick={onRandom}
        className="flex items-center gap-2 px-6 py-3 bg-primary-100 text-primary-700 rounded-full font-bold text-base hover:bg-primary-200 transition-colors">
        <Shuffle className="w-4 h-4" />
        랜덤
      </button>

      <button
        onClick={onNext}
        disabled={isLast}
        className={`p-3 rounded-full transition-all ${isLast ? 'bg-gray-100 text-gray-300' : 'bg-primary-600 text-white shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-95'}`}>
        <ArrowRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Controls;