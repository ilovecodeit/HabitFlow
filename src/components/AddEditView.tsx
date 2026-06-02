/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Habit, ViewType } from '../types';
import { HabitIcon } from './HabitIcon';

interface AddEditViewProps {
  habitIdToEdit?: string | null;
  habits: Habit[];
  onSaveHabit: (habitData: {
    id?: string;
    name: string;
    category: string;
    icon: string;
    frequency: string;
  }) => void;
  onNavigate: (view: ViewType) => void;
}

export const AddEditView: React.FC<AddEditViewProps> = ({ 
  habitIdToEdit, 
  habits, 
  onSaveHabit, 
  onNavigate 
}) => {
  const isEditMode = !!habitIdToEdit;
  const existingHabit = isEditMode ? habits.find(h => h.id === habitIdToEdit) : null;

  // Form Fields State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('건강');
  const [frequency, setFrequency] = useState('매일');
  const [icon, setIcon] = useState('drop');

  // Load existing data in edit mode
  useEffect(() => {
    if (isEditMode && existingHabit) {
      setName(existingHabit.name);
      setCategory(existingHabit.category);
      setFrequency(existingHabit.frequency);
      setIcon(existingHabit.icon);
    } else {
      setName('');
      setCategory('건강');
      setFrequency('매일');
      setIcon('drop');
    }
  }, [habitIdToEdit, isEditMode, existingHabit]);

  const categories = ['건강', '운동', '학습', '마음챙김'];
  const frequencies = ['매일', '주 5회', '주 3회', '주 1회'];
  
  // Icon presets mapping icon-keys to lucide representations
  const iconsList = [
    { key: 'drop', iconName: 'water_drop', label: '물마시기' },
    { key: 'book', iconName: 'menu_book', label: '독서' },
    { key: 'dumbbell', iconName: 'fitness_center', label: '운동' },
    { key: 'brain', iconName: 'self_improvement', label: '마음챙김' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('습관 이름을 입력해주세요!');
      return;
    }

    onSaveHabit({
      id: habitIdToEdit || undefined,
      name: name.trim(),
      category,
      icon,
      frequency
    });
  };

  return (
    <div className="flex flex-col flex-grow w-full max-w-[800px] mx-auto px-5 py-4">
      {/* Top Header with Close and Suppress typical bottom navigation behavior */}
      <header className="sticky top-0 z-10 bg-white dark:bg-zinc-900 px-1 py-4 w-full flex items-center mb-6">
        <button 
          onClick={() => onNavigate(isEditMode ? 'manage' : 'recommend')}
          aria-label="뒤로가기"
          className="p-2 -ml-2 rounded-full hover:bg-zinc-150 dark:hover:bg-zinc-800 text-zinc-850 dark:text-zinc-200 flex items-center justify-center transition-transform active:scale-95 duration-100"
        >
          <HabitIcon name="arrow_left" size={24} />
        </button>
        <h1 className="ml-3 text-lg font-bold text-zinc-900 dark:text-zinc-50">
          {isEditMode ? '습관 수정하기' : '습관 추가'}
        </h1>
      </header>

      {/* Main Form Fields Container */}
      <main className="w-full flex flex-col items-center pb-12">
        <form 
          onSubmit={handleSubmit}
          className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-zinc-100 dark:border-zinc-800/60 flex flex-col gap-6"
        >
          {/* Input field */}
          <div className="flex flex-col gap-2 w-full">
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest" htmlFor="habit-name">
              어떤 습관을 만들고 싶나요?
            </label>
            <input 
              id="habit-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="예: 물 2L 마시기"
              maxLength={25}
              className="w-full bg-zinc-50 focus:bg-white dark:bg-zinc-800/40 dark:focus:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700/50 rounded-2xl px-4 py-4 text-base text-zinc-900 dark:text-zinc-50 placeholder-zinc-300 dark:placeholder-zinc-650 transition-all outline-none focus:border-emerald-500/80 focus:ring-0"
            />
            <p className="text-xs text-zinc-400 dark:text-zinc-500 ml-1 mt-1">구체적이고 달성 가능한 목표를 설정해보세요.</p>
          </div>

          {/* Icon Choice Selectable tag row */}
          <div className="flex flex-col gap-2 w-full">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-widest">
              습관 아이콘
            </span>
            <div className="grid grid-cols-4 gap-3">
              {iconsList.map((icoItem) => {
                const isSelected = icon === icoItem.key;
                return (
                  <button
                    key={icoItem.key}
                    type="button"
                    onClick={() => setIcon(icoItem.key)}
                    className={`p-3 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'border-zinc-100 bg-zinc-50 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-800/40 dark:text-zinc-400'
                    }`}
                  >
                    <HabitIcon name={icoItem.iconName} size={24} />
                    <span className="text-[10px] font-bold mt-1.5">{icoItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Recommended category buttons selection list */}
          <div className="flex flex-col gap-2.5 w-full">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">
              추천 카테고리
            </span>
            <div className="flex flex-wrap gap-2">
              {categories.map((catItem) => {
                const isSelected = category === catItem;
                return (
                  <button
                    key={catItem}
                    type="button"
                    onClick={() => setCategory(catItem)}
                    className={`px-4 py-2.5 rounded-full border-2 text-sm font-semibold transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-1000/20 dark:text-emerald-400'
                        : 'border-zinc-100 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                    }`}
                  >
                    {catItem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Frequencies Selector buttons row */}
          <div className="flex flex-col gap-2.5 w-full">
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-502 uppercase tracking-widest">
              성공 주기 설정
            </span>
            <div className="grid grid-cols-4 gap-2">
              {frequencies.map((freqItem) => {
                const isSelected = frequency === freqItem;
                return (
                  <button
                    key={freqItem}
                    type="button"
                    onClick={() => setFrequency(freqItem)}
                    className={`py-2 rounded-xl border-2 text-xs font-bold transition-all ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400'
                        : 'border-zinc-100 bg-zinc-50 dark:border-zinc-850 dark:bg-zinc-800/40 text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {freqItem}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Action Big Green Button */}
          <button
            type="submit"
            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-emerald-500/10 transition-transform active:scale-[0.98] duration-150 flex items-center justify-center gap-1.5 focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2"
          >
            <HabitIcon name={isEditMode ? 'check' : 'plus'} size={18} className="stroke-[3]" />
            {isEditMode ? '수정된 정보 저장 수락' : '습관 추가하기'}
          </button>
        </form>
      </main>
    </div>
  );
};
