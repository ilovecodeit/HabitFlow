/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Habit, ViewType } from '../types';
import { HabitIcon } from './HabitIcon';

interface RecommendViewProps {
  onAddPresetHabit: (preset: { name: string; category: string; icon: string; frequency: string }) => void;
  onNavigate: (view: ViewType) => void;
}

export const RecommendView: React.FC<RecommendViewProps> = ({ onAddPresetHabit, onNavigate }) => {
  const presets = [
    {
      name: '하루 30분 운동하기',
      description: '건강과 활력을 위해',
      category: '운동',
      icon: 'dumbbell',
      frequency: '매일',
      bgClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20'
    },
    {
      name: '책 10페이지 읽기',
      description: '마음의 양식 쌓기',
      category: '학습',
      icon: 'book',
      frequency: '매일',
      bgClass: 'bg-neutral-50 text-neutral-600 dark:bg-neutral-800/40'
    },
    {
      name: '물 2L 마시기',
      description: '수분 보충으로 생기있게',
      category: '건강',
      icon: 'drop',
      frequency: '매일',
      bgClass: 'bg-sky-50 text-sky-600 dark:bg-sky-950/20'
    },
    {
      name: '명상 10분',
      description: '스트레스 완화와 집중력',
      category: '마음챙김',
      icon: 'brain',
      frequency: '매일',
      bgClass: 'bg-teal-50 text-teal-600 dark:bg-teal-950/20'
    }
  ];

  return (
    <div className="flex flex-col flex-grow w-full max-w-[800px] mx-auto px-5 py-6">
      {/* Top App Bar with back button */}
      <header className="flex justify-between items-center py-4 mb-4">
        <button 
          onClick={() => onNavigate('manage')}
          className="text-zinc-600 dark:text-zinc-300 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          aria-label="돌아가기"
        >
          <HabitIcon name="arrow_left" size={24} />
        </button>
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">HabitFlow</div>
        <div className="w-10"></div> {/* Spacer to center the logo */}
      </header>

      {/* Heading */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-1">
          이런 습관은 어때요?
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          많은 사람들이 실천하고 있는 건강한 습관들입니다.
        </p>
      </div>

      {/* Preset Suggestions list */}
      <div className="flex flex-col gap-4">
        {presets.map((preset, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-zinc-900 rounded-2xl p-4 flex items-center justify-between shadow-sm border border-zinc-100 dark:border-zinc-800/60 hover:border-emerald-200 dark:hover:border-emerald-800/40 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${preset.bgClass}`}>
                <HabitIcon name={preset.icon} size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 text-base">{preset.name}</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{preset.description}</p>
              </div>
            </div>
            <button 
              onClick={() => onAddPresetHabit({
                name: preset.name,
                category: preset.category,
                icon: preset.icon,
                frequency: preset.frequency
              })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-zinc-50 hover:bg-emerald-500 text-emerald-600 hover:text-white dark:bg-zinc-800 dark:hover:bg-emerald-600 dark:text-emerald-400 dark:hover:text-white transition-all font-semibold text-xs"
            >
              <HabitIcon name="plus" size={14} className="stroke-[2.5]" />
              추가
            </button>
          </div>
        ))}
      </div>

      {/* Custom input button link */}
      <div className="mt-12 flex justify-center">
        <button 
          onClick={() => onNavigate('add')}
          className="text-zinc-500 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-405 font-medium text-sm underline underline-offset-4 decoration-zinc-300 hover:decoration-emerald-400 transition-colors"
        >
          원하는 습관이 없나요? 직접 등록하기
        </button>
      </div>
    </div>
  );
};
