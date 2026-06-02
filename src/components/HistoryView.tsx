/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Habit, ViewType } from '../types';
import { HabitIcon } from './HabitIcon';
import { getLocalDateString } from '../utils/habitUtils';

interface HistoryViewProps {
  habits: Habit[];
  onNavigate: (view: ViewType, selectedHabitId?: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ habits, onNavigate }) => {
  // Option: 'grid' (이번 달 모아보기) or 'summary' (기록 통계 요약)
  const [subMode, setSubMode] = useState<'grid' | 'summary'>('grid');

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed

  // Month rendering constants
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // Dynamic helper: get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Dynamic helper: get starting day of week
  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay(); // 0 is Sunday
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const startDayOfWeek = getFirstDayOfWeek(currentYear, currentMonth);

  // Generate date list with padding
  const calendarCells = [];
  // Lead space
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }
  // Days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  const todayStr = getLocalDateString();
  const todayDateNum = today.getDate();

  return (
    <div className="flex flex-col flex-grow w-full max-w-[800px] mx-auto px-5 py-6 pb-24">
      {/* Top Header Bar */}
      <header className="flex justify-between items-center py-4 mb-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('today')}
            className="text-zinc-600 dark:text-zinc-300 p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="뒤로가기"
          >
            <HabitIcon name="arrow_left" size={24} />
          </button>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">HabitFlow</div>
        </div>
        
        {/* Toggle Grid vs Summary */}
        <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setSubMode('grid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subMode === 'grid'
                ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            모아보기
          </button>
          <button
            onClick={() => setSubMode('summary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              subMode === 'summary'
                ? 'bg-white dark:bg-zinc-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700 dark:text-zinc-400'
            }`}
          >
            달성 통계
          </button>
        </div>
      </header>

      {/* Main Contents based on SubMode */}
      {subMode === 'grid' ? (
        // Grid view: "이번 달 모아보기"
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">이번 달 모아보기</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              {currentYear}년 {monthNames[currentMonth]}의 습관 기록입니다.
            </p>
          </div>

          {habits.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">
              <p className="text-zinc-400 text-sm">기록을 표시할 습관이 없습니다. 습관을 먼저 등록해주세요!</p>
            </div>
          ) : (
            // Mini Calendars Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habits.map((habit) => {
                // Count current month completions
                const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
                const checkedThisMonth = habit.history.filter(dateStr => dateStr.startsWith(currentMonthPrefix));

                return (
                  <div 
                    key={habit.id}
                    onClick={() => onNavigate('detail', habit.id)}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-zinc-100 dark:border-zinc-800/60 cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800/40 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5">
                        <HabitIcon name={habit.icon} size={16} className="text-emerald-500" />
                        <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 text-sm">{habit.name}</h3>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                        {checkedThisMonth.length}회 완료
                      </span>
                    </div>

                    {/* S M T W T F S header */}
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-[9px] text-zinc-400 mb-2">
                      <div>S</div><div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div>
                    </div>

                    {/* Check cells */}
                    <div className="grid grid-cols-7 gap-1">
                      {calendarCells.map((dayNum, i) => {
                        if (dayNum === null) {
                          return <div key={`empty-${i}`} className="w-full aspect-square bg-transparent"></div>;
                        }

                        const cellDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                        const isChecked = habit.history.includes(cellDateStr);
                        const isToday = cellDateStr === todayStr;

                        const dateKey = `${habit.id}-day-${dayNum}`;

                        return (
                          <div 
                            key={dateKey}
                            className={`w-full aspect-square rounded-full flex items-center justify-center text-[10px] transition-all ${
                              isChecked
                                ? 'bg-emerald-500 text-white font-bold'
                                : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500'
                            } ${isToday ? 'ring-[1.5px] ring-emerald-500 ring-offset-1 dark:ring-offset-zinc-900 font-bold' : ''}`}
                          >
                            {isChecked ? (
                              <HabitIcon name="check" size={10} className="stroke-[3]" />
                            ) : (
                              dayNum
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        // Summary stats view: "달성 통계 (기록 화면)"
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">기록 통계 요약</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">습관별 진행 성과와 연속 달성일수(스트릭)를 확인해 보세요.</p>
          </div>

          <div className="flex flex-col gap-6">
            {habits.length === 0 ? (
              <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-10 text-center shadow-sm">
                <p className="text-zinc-400 text-sm">분석할 습관이 아직 추가되지 않았습니다.</p>
              </div>
            ) : (
              habits.map((habit) => {
                // Calculate actual performance metrics
                const daysInThisMonth = getDaysInMonth(currentYear, currentMonth);
                const currentMonthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
                
                // Monthly checks count
                const monthlyChecks = habit.history.filter(d => d.startsWith(currentMonthPrefix)).length;
                const progressPercent = Math.min(100, Math.round((monthlyChecks / daysInThisMonth) * 100));

                return (
                  <article 
                    onClick={() => onNavigate('detail', habit.id)}
                    key={habit.id}
                    className="bg-white dark:bg-zinc-900 rounded-2xl p-5 shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-zinc-100 dark:border-zinc-800/60 flex flex-col gap-4 cursor-pointer hover:border-emerald-200 dark:hover:border-emerald-800/40 transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{habit.name}</h2>
                        <span className="inline-block bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs px-2.5 py-1 rounded-lg mt-1.5 font-medium">
                          {habit.frequency}
                        </span>
                      </div>
                      <div className="w-12 h-12 rounded-full border border-emerald-100 dark:border-emerald-900/30 flex items-center justify-center bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400">
                        <HabitIcon name={habit.icon} size={22} />
                      </div>
                    </div>

                    <div>
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{habit.streak}일 연속</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">이번 달 {monthlyChecks}일 체크 ({progressPercent}%)</p>
                    </div>

                    {/* Thin Progress Bar */}
                    <div className="w-full h-1 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 rounded-full transition-all" 
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
