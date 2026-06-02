/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Habit, ViewType } from '../types';
import { HabitIcon } from './HabitIcon';
import { motion } from 'motion/react';

interface ManageViewProps {
  habits: Habit[];
  onDeleteHabit: (id: string) => void;
  onNavigate: (view: ViewType, selectedHabitId?: string) => void;
}

export const ManageView: React.FC<ManageViewProps> = ({ 
  habits, 
  onDeleteHabit, 
  onNavigate
}) => {
  return (
    <div className="flex flex-col flex-grow w-full max-w-[800px] mx-auto px-5 py-6 pb-28 md:pb-6">
      {/* Top App Bar inside main */}
      <div className="flex justify-between items-center pb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">HabitFlow</h1>
        </div>
      </div>

      {/* Section Title Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">내 습관 관리</h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">현재 진행 중인 습관을 수정하거나 삭제할 수 있습니다.</p>
      </div>

      {/* Habits List */}
      <div className="flex flex-col gap-4">
        {habits.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-8 text-center shadow-sm">
            <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-4">등록된 습관이 없습니다. 새로 만들어보세요!</p>
            <button
              onClick={() => onNavigate('add')}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 font-semibold rounded-xl text-sm transition-transform hover:scale-105 active:scale-95"
            >
              <HabitIcon name="plus" size={16} />
              새로운 습관 만들기
            </button>
          </div>
        ) : (
          habits.map((habit) => (
            <motion.div
              layoutId={`habit-card-${habit.id}`}
              key={habit.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl p-4 flex items-center justify-between border border-zinc-100 dark:border-zinc-800/80 shadow-[0_4px_12px_rgba(0,0,0,0.02)] group transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <HabitIcon name={habit.icon} size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base">{habit.name}</h3>
                  <p className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase mt-0.5">{habit.frequency}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onNavigate('edit', habit.id)}
                  aria-label="Edit Habit"
                  className="p-2.5 rounded-full text-zinc-400 dark:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
                >
                  <HabitIcon name="edit" size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const confirmDelete = window.confirm(`"${habit.name}" 습관을 삭제하시겠습니까?\n모든 기록과 스트릭이 삭제됩니다.`);
                    if (confirmDelete) {
                      onDeleteHabit(habit.id);
                    }
                  }}
                  aria-label="Delete Habit"
                  className="p-2.5 rounded-full text-zinc-400 dark:text-zinc-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
                >
                  <HabitIcon name="trash" size={18} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Habit Button (Floating / Stick bottom on mobile, inline on desktop) */}
      <div className="fixed bottom-[80px] md:bottom-auto left-0 w-full md:w-auto px-5 md:px-0 md:mt-8 z-30 md:relative">
        <button
          onClick={() => onNavigate('recommend')}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-base py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/10 active:scale-[0.98] duration-150"
        >
          <HabitIcon name="plus" size={20} />
          습관 추가하기
        </button>
      </div>
    </div>
  );
};
