/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Habit, ViewType } from '../types';
import { HabitIcon } from './HabitIcon';
import { getLocalDateString } from '../utils/habitUtils';

interface DetailViewProps {
  habit: Habit;
  onNavigate: (view: ViewType, selectedHabitId?: string) => void;
}

export const DetailView: React.FC<DetailViewProps> = ({ habit, onNavigate }) => {
  const [navDate, setNavDate] = useState<Date>(new Date());
  
  const selectedYear = navDate.getFullYear();
  const selectedMonth = navDate.getMonth(); // 0-indexed

  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  // Month navigation
  const prevMonth = () => {
    const d = new Date(selectedYear, selectedMonth - 1, 1);
    setNavDate(d);
  };

  const nextMonth = () => {
    const d = new Date(selectedYear, selectedMonth + 1, 1);
    setNavDate(d);
  };

  // Days in month calculation
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfWeek = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(selectedYear, selectedMonth);
  const firstDayOfWeek = getFirstDayOfWeek(selectedYear, selectedMonth);

  // Pad layout values
  const daysArray = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Find metrics
  const todayStr = getLocalDateString();
  const monthPrefixStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;
  const monthlyChecks = habit.history.filter(date => date.startsWith(monthPrefixStr)).length;
  const completionPercentage = Math.round((monthlyChecks / daysInMonth) * 100);

  return (
    <div className="flex flex-col flex-grow w-full max-w-[800px] mx-auto px-5 py-4 pb-20">
      {/* Top Bar with Center Brand */}
      <header className="bg-white dark:bg-zinc-900 flex justify-between items-center py-4 w-full sticky top-0 z-10 border-b border-zinc-100 dark:border-zinc-800">
        <button 
          onClick={() => onNavigate('today')}
          aria-label="Back" 
          className="p-2 -ml-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors flex items-center justify-center"
        >
          <HabitIcon name="arrow_left" size={24} />
        </button>
        <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
          HabitFlow
        </div>
        <div className="w-10"></div> {/* Center alignment spacer */}
      </header>

      {/* Habit Heading Banner */}
      <section className="py-8 text-center flex flex-col items-center">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/20 text-emerald-650 flex items-center justify-center">
            <HabitIcon name={habit.icon} size={18} />
          </div>
          <span className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">{habit.category}</span>
        </div>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">{habit.name}</h1>
        
        {/* Streak card (Material Design) */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800/60 shadow-[0_4px_12px_rgba(0,0,0,0.02)] w-full max-w-sm flex flex-col items-center">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-1.5">현재 스트릭</span>
          <div className="flex items-center justify-center gap-1.5">
            <HabitIcon name="flame" size={32} className="text-emerald-500 fill-emerald-505" />
            <span className="text-4xl font-extrabold text-emerald-500 tracking-tight">{habit.streak}일</span>
            <span className="text-zinc-500 dark:text-zinc-400 font-bold ml-1 text-base">연속 완료중!</span>
          </div>
        </div>
      </section>

      {/* Calendar View Box */}
      <section className="mt-2 bg-white dark:bg-zinc-900 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.02)] border border-rose-50 border-zinc-100 dark:border-zinc-800/60 p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
            {selectedYear}년 {monthNames[selectedMonth]}
          </h2>
          <div className="flex space-x-1">
            <button 
              onClick={prevMonth}
              aria-label="Previous Month" 
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <HabitIcon name="chevron_left" size={18} />
            </button>
            <button 
              onClick={nextMonth}
              aria-label="Next Month" 
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            >
              <HabitIcon name="chevron_right" size={18} />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-y-3 gap-x-2 text-center text-xs font-bold text-zinc-400 mb-4">
          <div>일</div>
          <div>월</div>
          <div>화</div>
          <div>수</div>
          <div>목</div>
          <div>금</div>
          <div>토</div>
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
          {daysArray.map((dayNum, i) => {
            if (dayNum === null) {
              return <div key={`padded-${i}`} className="h-10 w-10"></div>;
            }

            const cellDateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isChecked = habit.history.includes(cellDateStr);
            const isToday = cellDateStr === todayStr;

            // Checked styling highlights
            let cellStyle = 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800';
            let dotStyle = 'bg-transparent';

            if (isChecked) {
              dotStyle = 'bg-emerald-500';
              if (isToday) {
                cellStyle = 'bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-500/25';
                dotStyle = 'bg-emerald-120'; // hide or light inside active today
              } else {
                cellStyle = 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-semibold';
              }
            } else if (isToday) {
              cellStyle = 'border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-extrabold';
            }

            return (
              <div 
                key={`grid-cell-${dayNum}`}
                className={`text-sm flex flex-col items-center justify-center relative h-10 w-10 mx-auto rounded-full transition-transform duration-100 cursor-pointer ${cellStyle}`}
              >
                {dayNum}
                {/* Visual Dot on bottom */}
                <div className={`w-1.5 h-1.5 rounded-full absolute bottom-1 ${dotStyle}`}></div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stats Mini cards on Bottom */}
      <section className="mt-6 grid grid-cols-2 gap-4">
        {/* Monthly Attendance card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800/60 flex flex-col shadow-sm">
          <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-505 uppercase tracking-wide mb-1.5">이번 달 달성률</span>
          <span className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50">{completionPercentage}%</span>
          <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full mt-3">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Max Streak Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800/60 flex flex-col shadow-sm justify-between">
          <div>
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-520 uppercase tracking-wide mb-1.5">최장 스트릭</span>
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {habit.maxStreak}일
            </div>
          </div>
          <span className="text-[10px] text-zinc-400 dark:text-zinc-400 font-medium leading-none mt-2">
            기록 달성을 축하드려요!
          </span>
        </div>
      </section>
    </div>
  );
};
