import React, { useEffect } from 'react';
import { Trophy, Check, X, Layers, AlertCircle } from 'lucide-react';

const CategoryModal = ({ isOpen, onClose, categories, selectedCategory, onSelectCategory, unknownCount = 0 }) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center sm:p-4 animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in slide-in-from-bottom-5 duration-300">
        
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-bold text-gray-900">학습 카테고리</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Categories List */}
        <div className="overflow-y-auto p-4 custom-scrollbar bg-gray-50/50">
          <div className="grid grid-cols-1 gap-3">
            {/* All Questions Option */}
            <button
              onClick={() => {
                onSelectCategory(null);
                onClose();
              }}
              className={`relative flex items-center p-4 rounded-xl border-2 transition-all ${
                selectedCategory === null
                  ? 'bg-primary-50 border-primary-500 shadow-sm'
                  : 'bg-white border-white hover:border-primary-200 shadow-sm'
              }`}
            >
              <div className={`p-3 rounded-full mr-4 ${
                selectedCategory === null ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                <Trophy className="w-6 h-6" />
              </div>
              <div className="flex-1 text-left">
                <h3 className={`font-bold text-lg ${
                  selectedCategory === null ? 'text-primary-700' : 'text-gray-700'
                }`}>전체 학습</h3>
                <p className={`text-sm ${
                  selectedCategory === null ? 'text-primary-600' : 'text-gray-500'
                }`}>모든 문제를 학습합니다</p>
              </div>
              {selectedCategory === null && (
                <div className="absolute top-4 right-4 text-primary-500">
                  <Check className="w-6 h-6" />
                </div>
              )}
            </button>

            {/* 몰랐던 문제만 옵션 */}
            {unknownCount > 0 && (
              <button
                onClick={() => {
                  onSelectCategory('unknown');
                  onClose();
                }}
                className={`relative flex items-center p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === 'unknown'
                    ? 'bg-orange-50 border-orange-500 shadow-sm'
                    : 'bg-white border-white hover:border-orange-200 shadow-sm'
                }`}
              >
                <div className={`p-3 rounded-full mr-4 ${
                  selectedCategory === 'unknown' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-500'
                }`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className={`font-bold text-lg ${
                      selectedCategory === 'unknown' ? 'text-orange-700' : 'text-gray-700'
                    }`}>몰랐던 문제</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      selectedCategory === 'unknown'
                        ? 'bg-orange-200 text-orange-700'
                        : 'bg-orange-100 text-orange-600'
                    }`}>
                      {unknownCount}문제
                    </span>
                  </div>
                  <p className={`text-sm ${
                    selectedCategory === 'unknown' ? 'text-orange-600' : 'text-gray-500'
                  }`}>다시 복습이 필요한 문제</p>
                </div>
                {selectedCategory === 'unknown' && (
                  <div className="absolute top-4 right-4 text-orange-500">
                    <Check className="w-6 h-6" />
                  </div>
                )}
              </button>
            )}

            {/* Individual Categories */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`relative flex items-center p-4 rounded-xl border-2 transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-primary-50 border-primary-500 shadow-sm'
                    : 'bg-white border-white hover:border-primary-200 shadow-sm'
                }`}
              >
                <div className="flex-1 text-left pl-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-bold text-lg ${
                      selectedCategory === cat.id ? 'text-primary-700' : 'text-gray-700'
                    }`}>{cat.name}</h3>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      selectedCategory === cat.id 
                        ? 'bg-primary-200 text-primary-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {cat.count}문제
                    </span>
                  </div>
                </div>
                {selectedCategory === cat.id && (
                  <div className="absolute top-1/2 -translate-y-1/2 right-4 text-primary-500">
                    <Check className="w-6 h-6" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
