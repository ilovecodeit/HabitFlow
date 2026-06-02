/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Habit {
  id: string;
  name: string;
  frequency: string; // '매일', '주 5회', '주 3회', etc.
  category: string;  // '건강', '운동', '학습', '마음챙김', etc.
  createdAt: string; // YYYY-MM-DD
  icon: string;      // 'drop' | 'book' | 'dumbbell' | 'brain' | etc.
  history: string[]; // List of YYYY-MM-DD strings of completion dates
  streak: number;    // Current consecutive days streak
  maxStreak: number; // Highest streak recorded
}

export type ViewType = 'today' | 'manage' | 'recommend' | 'history' | 'detail' | 'add' | 'edit';
