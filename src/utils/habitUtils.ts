/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Habit } from '../types';

// Helper to format date as YYYY-MM-DD in local time
export function getLocalDateString(date: Date = new Date()): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

// Generate sequential array of dates
export function getPastDates(count: number): string[] {
  const dates: string[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(getLocalDateString(d));
  }
  return dates;
}

// Calculate streaks
export function calculateStreak(history: string[]): { currentStreak: number; maxStreak: number } {
  if (history.length === 0) {
    return { currentStreak: 0, maxStreak: 0 };
  }

  const sortedHistory = [...new Set(history)].sort();
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 0;

  // Track max streak dynamically
  if (sortedHistory.length > 0) {
    tempStreak = 1;
    maxStreak = 1;
    for (let i = 1; i < sortedHistory.length; i++) {
      const prevDate = new Date(sortedHistory[i - 1]);
      const currDate = new Date(sortedHistory[i]);
      const diffTime = Math.abs(currDate.getTime() - prevDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
    }
  }

  // Calculate current streak
  const todayStr = getLocalDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  const hasToday = sortedHistory.includes(todayStr);
  const hasYesterday = sortedHistory.includes(yesterdayStr);

  if (!hasToday && !hasYesterday) {
    currentStreak = 0;
  } else {
    // Count backwards from starting point
    let checkDate = hasToday ? new Date() : yesterday;
    let consecutive = 0;
    while (true) {
      const checkStr = getLocalDateString(checkDate);
      if (sortedHistory.includes(checkStr)) {
        consecutive++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    currentStreak = consecutive;
  }

  // Ensure maxStreak is at least currentStreak
  maxStreak = Math.max(maxStreak, currentStreak);

  return { currentStreak, maxStreak };
}

// Generate seed habits
export function createDefaultHabits(): Habit[] {
  // Let's create dates dynamically based on current date for realistic rendering
  const today = new Date();
  const getPastDateStr = (daysAgo: number) => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return getLocalDateString(d);
  };

  // Habit 1: 물 2L 마시기 (Has today checked inside standard 12-day streak)
  // Let's say checked: today, and 11 past consecutive days
  const h1History: string[] = [];
  for (let i = 0; i < 12; i++) {
    h1History.push(getPastDateStr(i));
  }
  // And some occasional check-ins in the farther past
  h1History.push(getPastDateStr(14));
  h1History.push(getPastDateStr(15));
  h1History.push(getPastDateStr(18));
  h1History.push(getPastDateStr(20));
  h1History.push(getPastDateStr(21));
  h1History.push(getPastDateStr(22));

  // Habit 2: 30분 독서하기 (Not checked today, streak is 3 because checked yesterday, 2 days ago, 3 days ago)
  const h2History: string[] = [];
  h2History.push(getPastDateStr(1)); // yesterday
  h2History.push(getPastDateStr(2));
  h2History.push(getPastDateStr(3));
  // casual past history
  h2History.push(getPastDateStr(6));
  h2History.push(getPastDateStr(7));
  h2History.push(getPastDateStr(10));
  h2History.push(getPastDateStr(12));

  // Habit 3: 매일 스쿼트 50개 (Workout - Not checked today, 12-day streak simulation as on capture)
  // Streaks: 12 days streak (1 to 12 days ago)
  const h3History: string[] = [];
  for (let i = 1; i <= 12; i++) {
    h3History.push(getPastDateStr(i));
  }
  h3History.push(getPastDateStr(15));
  h3History.push(getPastDateStr(16));

  const def1 = calculateStreak(h1History);
  const def2 = calculateStreak(h2History);
  const def3 = calculateStreak(h3History);

  return [
    {
      id: 'water-2l',
      name: '물 2L 마시기',
      frequency: '매일',
      category: '건강',
      createdAt: getPastDateStr(30),
      icon: 'drop',
      history: h1History,
      streak: def1.currentStreak,
      maxStreak: Math.max(def1.maxStreak, 21), // Force 21 for gorgeous fidelity with detail panel
    },
    {
      id: 'read-30min',
      name: '30분 독서하기',
      frequency: '주 5회',
      category: '학습',
      createdAt: getPastDateStr(30),
      icon: 'book',
      history: h2History,
      streak: def2.currentStreak,
      maxStreak: Math.max(def2.maxStreak, 10),
    },
    {
      id: 'squat-50',
      name: '새 습관',
      frequency: '매일',
      category: '운동',
      createdAt: getPastDateStr(30),
      icon: 'drop',
      history: h3History,
      streak: def3.currentStreak,
      maxStreak: Math.max(def3.maxStreak, 15),
    }
  ];
}

// Generate a natural-looking mock history list for past 15 days
export function generateRealisticDummyHistory(): string[] {
  const history: string[] = [];
  const today = new Date();
  
  // Create natural completions for the last 15 days
  for (let i = 1; i <= 15; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    // 65% chance of completion
    if (Math.random() < 0.65) {
      history.push(getLocalDateString(d));
    }
  }
  
  // Guarantee a beautiful current streak by ensuring active completions on yesterday and 2 days ago
  const yest = new Date(today);
  yest.setDate(today.getDate() - 1);
  const yestStr = getLocalDateString(yest);
  if (!history.includes(yestStr)) {
    history.push(yestStr);
  }
  
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);
  const twoDaysAgoStr = getLocalDateString(twoDaysAgo);
  if (!history.includes(twoDaysAgoStr)) {
    history.push(twoDaysAgoStr);
  }
  
  return history.sort();
}

