/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Habit, ViewType } from '../types';
import { HabitIcon } from './HabitIcon';
import { getLocalDateString } from '../utils/habitUtils';
import { motion } from 'motion/react';

interface TodayViewProps {
  habits: Habit[];
  onToggleComplete: (id: string) => void;
  onNavigate: (view: ViewType, selectedHabitId?: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({ 
  habits, 
  onToggleComplete, 
  onNavigate
}) => {
  const todayStr = getLocalDateString();
  const completedHabits = habits.filter(h => h.history.includes(todayStr));
  const totalCount = habits.length;
  const completedCount = completedHabits.length;
  
  // Calculate completion percentage
  const percent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="flex flex-col flex-1 pb-[100px]">
      {/* TopAppBar & Progress Indicator */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 sticky top-0 z-10">
        <div className="flex justify-between items-center px-5 py-4 w-full max-w-[800px] mx-auto">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">HabitFlow</span>
          </div>
        </div>
        
        {/* Progress Sub-header */}
        <div className="px-5 pb-5 pt-2 max-w-[800px] mx-auto">
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
            {totalCount > 0 
              ? `오늘 ${totalCount}개 중 ${completedCount}개 완료` 
              : '추가된 습관이 없습니다.'}
          </h1>
          <div className="h-[6px] w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-emerald-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </header>

      {/* Main Content (Habit Cards) */}
      <main className="flex-1 flex flex-col gap-4 px-5 pt-6 max-w-[800px] mx-auto w-full">
        {habits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <HabitIcon name="sparkles" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1">나만의 건강한 루틴을 시작해봐요!</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm">
              매일 실천하기 쉬운 작은 습관부터 등록해서 기록해나갈 수 있습니다.
            </p>
            <button
              onClick={() => onNavigate('recommend')}
              className="px-5 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl text-sm transition-transform hover:scale-105 active:scale-95"
            >
              습관 추천받기
            </button>
          </div>
        ) : (
          habits.map((habit) => {
            const isCompleted = habit.history.includes(todayStr);

            return (
              <motion.div
                key={habit.id}
                layoutId={`habit-card-${habit.id}`}
                className={`border p-4 rounded-2xl flex justify-between items-center transition-all cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-50/75 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40 shadow-sm'
                    : 'bg-white dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)]'
                }`}
                onClick={() => onNavigate('detail', habit.id)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-4">
                  {/* Category Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-100 dark:border-zinc-700/50'
                  }`}>
                    <HabitIcon name={habit.icon} size={24} />
                  </div>

                  <div className="flex flex-col gap-0.5">
                    <h2 className={`font-semibold text-base transition-colors ${
                      isCompleted 
                        ? 'text-emerald-900 dark:text-emerald-300' 
                        : 'text-zinc-900 dark:text-zinc-100'
                    }`}>
                      {habit.name}
                    </h2>
                    <span className={`text-xs font-semibold flex items-center gap-1.5 ${
                      isCompleted 
                        ? 'text-emerald-600/90 dark:text-emerald-400' 
                        : 'text-zinc-500 dark:text-zinc-400'
                    }`}>
                      <HabitIcon name="flame" size={13} className="text-orange-500" />
                      {habit.streak}일째 연속
                      <span className="text-zinc-300 dark:text-zinc-600">•</span>
                      <span className="opacity-80">{habit.frequency}</span>
                    </span>
                  </div>
                </div>

                {/* Check Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleComplete(habit.id);
                  }}
                  className={`px-2.5 py-1 rounded text-[11px] font-medium transition-all focus:outline-none border ${
                    isCompleted
                      ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400 border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200'
                      : 'bg-zinc-50 dark:bg-zinc-850 text-zinc-500 border-zinc-100 dark:border-zinc-800 hover:bg-zinc-100'
                  }`}
                  aria-label={isCompleted ? "체크 해제" : "완료 체크"}
                >
                  <span className="flex items-center gap-1">
                    <HabitIcon name="check" size={10} className={isCompleted ? "text-zinc-400" : "text-zinc-300"} />
                    {isCompleted ? "완료됨" : "체크"}
                  </span>
                </button>
              </motion.div>
            );
          })
        )}
      </main>
    </div>
  );
};
