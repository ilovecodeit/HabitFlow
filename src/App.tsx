/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Habit, ViewType } from './types';
import { createDefaultHabits, calculateStreak, getLocalDateString, generateRealisticDummyHistory } from './utils/habitUtils';

// Subcomponents matching core navigation tabs and panels
import { TodayView } from './components/TodayView';
import { ManageView } from './components/ManageView';
import { RecommendView } from './components/RecommendView';
import { HistoryView } from './components/HistoryView';
import { DetailView } from './components/DetailView';
import { AddEditView } from './components/AddEditView';
import { HabitIcon } from './components/HabitIcon';

export default function App() {
  // Application overarching habits state (initialized with hardcoded starter data)
  const [habits, setHabits] = useState<Habit[]>(() => createDefaultHabits());
  
  // App initialization/loading state
  const [loading] = useState(false);

  // Navigation current state routing
  const [currentView, setCurrentView] = useState<ViewType>('today');
  const [selectedHabitId, setSelectedHabitId] = useState<string | null>(null);

  // Flush fallback actions purely to React local state (no storage writing)
  const saveToStorage = (updatedHabits: Habit[]) => {
    setHabits(updatedHabits);
  };

  // Checkbox toggle habit completion date (purely in-memory)
  const handleToggleComplete = (id: string) => {
    const todayStr = getLocalDateString();
    const target = habits.find(h => h.id === id);
    if (!target) return;

    const exists = target.history.includes(todayStr);
    let valHistory: string[];

    if (exists) {
      valHistory = target.history.filter(d => d !== todayStr);
    } else {
      valHistory = [...target.history, todayStr];
    }

    const streakMetrics = calculateStreak(valHistory);
    const updatedHabit = {
      ...target,
      history: valHistory,
      streak: streakMetrics.currentStreak,
      maxStreak: Math.max(target.maxStreak, streakMetrics.maxStreak)
    };

    const updated = habits.map(h => h.id === id ? updatedHabit : h);
    saveToStorage(updated);
  };

  // Add recommend preset direct-completion helper (purely in-memory)
  const handleAddPresetHabit = (preset: { name: string; category: string; icon: string; frequency: string }) => {
    const isAlreadyAdded = habits.some(h => h.name.toLowerCase().trim() === preset.name.toLowerCase().trim());
    if (isAlreadyAdded) {
      alert(`"${preset.name}" 습관이 이미 등록되어 있습니다!`);
      setCurrentView('manage');
      return;
    }

    const uniqueId = `preset-${Date.now()}`;
    const newHabit: Habit = {
      id: uniqueId,
      name: preset.name,
      category: preset.category,
      icon: preset.icon,
      frequency: preset.frequency,
      createdAt: getLocalDateString(),
      history: [],
      streak: 0,
      maxStreak: 0
    };

    const updated = [...habits, newHabit];
    saveToStorage(updated);
    
    // Quick success redirect to manage center
    setCurrentView('manage');
  };

  // Form custom handler (both Addition and Modification saving) (purely in-memory)
  const handleSaveHabit = (formData: { id?: string; name: string; category: string; icon: string; frequency: string }) => {
    if (formData.id) {
      // Modification saving
      const target = habits.find(h => h.id === formData.id);
      if (!target) return;

      const updatedHabit = {
        ...target,
        name: formData.name,
        category: formData.category,
        icon: formData.icon,
        frequency: formData.frequency
      };

      const updated = habits.map(h => h.id === formData.id ? updatedHabit : h);
      saveToStorage(updated);
      setSelectedHabitId(null);
      setCurrentView('manage');
    } else {
      // Add custom unique item
      const isDuplicated = habits.some(
        h => h.name.toLowerCase().trim() === formData.name.toLowerCase().trim()
      );
      if (isDuplicated) {
        alert(`"${formData.name}" 습관이 이미 존재합니다.`);
        return;
      }

      const uniqueId = `custom-${Date.now()}`;
      const newHabit: Habit = {
        id: uniqueId,
        name: formData.name,
        category: formData.category,
        icon: formData.icon,
        frequency: formData.frequency,
        createdAt: getLocalDateString(),
        history: [],
        streak: 0,
        maxStreak: 0
      };

      const updated = [...habits, newHabit];
      saveToStorage(updated);
      setCurrentView('manage');
    }
  };

  // Detaching deletion (purely in-memory)
  const handleDeleteHabit = (id: string) => {
    const filtered = habits.filter(h => h.id !== id);
    saveToStorage(filtered);
    if (selectedHabitId === id) {
      setSelectedHabitId(null);
    }
  };

  // Universal navigation center
  const navigateTo = (view: ViewType, id?: string) => {
    if (id) {
      setSelectedHabitId(id);
    }
    setCurrentView(view);
  };

  // Map individual screen routing
  const renderViewContent = () => {
    switch (currentView) {
      case 'today':
        return (
          <TodayView 
            habits={habits}
            onToggleComplete={handleToggleComplete}
            onNavigate={navigateTo}
          />
        );
      case 'manage':
        return (
          <ManageView 
            habits={habits}
            onDeleteHabit={handleDeleteHabit}
            onNavigate={navigateTo}
          />
        );
      case 'recommend':
        return (
          <RecommendView 
            onAddPresetHabit={handleAddPresetHabit}
            onNavigate={navigateTo}
          />
        );
      case 'history':
        return (
          <HistoryView 
            habits={habits}
            onNavigate={navigateTo}
          />
        );
      case 'detail':
        const targetDetailHabit = habits.find(h => h.id === selectedHabitId);
        if (!targetDetailHabit) {
          // Fail-safe redirect
          return <TodayView habits={habits} onToggleComplete={handleToggleComplete} onNavigate={navigateTo} />;
        }
        return (
          <DetailView 
            habit={targetDetailHabit}
            onNavigate={navigateTo}
          />
        );
      case 'add':
        return (
          <AddEditView 
            habits={habits}
            onSaveHabit={handleSaveHabit}
            onNavigate={navigateTo}
          />
        );
      case 'edit':
        return (
          <AddEditView 
            habitIdToEdit={selectedHabitId}
            habits={habits}
            onSaveHabit={handleSaveHabit}
            onNavigate={navigateTo}
          />
        );
      default:
        return <TodayView habits={habits} onToggleComplete={handleToggleComplete} onNavigate={navigateTo} />;
    }
  };

  // Assess whether bottom utility navigation bar is explicitly suppressed
  const isTransactionalView = ['add', 'edit', 'recommend', 'detail'].includes(currentView);

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 min-h-screen flex flex-col items-start select-none font-sans overflow-x-auto">
      <div className="w-[760px] min-w-[760px] min-h-screen flex flex-col bg-white dark:bg-zinc-900 shadow-sm relative">
        
        {/* Dynamic rendering subview canvas */}
        <div className="flex-grow flex flex-col pt-safe">
          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center py-24 text-center">
              <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">루틴 불러오는 중...</p>
            </div>
          ) : (
            renderViewContent()
          )}
        </div>

        {/* Global Bottom Navigation Bar (Suppressed on transactional focus states) */}
        {!isTransactionalView && !loading && (
          <nav className="absolute bottom-0 left-0 w-[760px] z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 py-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.02)]">
            <div className="w-full flex justify-around items-center px-4">
              {/* Today Navigation button */}
              <button
                type="button"
                onClick={() => navigateTo('today')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl w-20 transition-all ${
                  currentView === 'today'
                    ? 'text-emerald-500 font-bold dark:text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-350'
                }`}
              >
                <HabitIcon 
                  name="sparkles" 
                  size={22} 
                  className={`mb-1 transition-transform ${currentView === 'today' ? 'scale-110 text-emerald-500' : ''}`} 
                />
                <span className="text-[10px] tracking-tight font-semibold">오늘</span>
              </button>

              {/* History Statistics Button tab */}
              <button
                type="button"
                onClick={() => navigateTo('history')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl w-20 transition-all ${
                  currentView === 'history'
                    ? 'text-emerald-500 font-bold dark:text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-350'
                }`}
              >
                <HabitIcon 
                  name="history" 
                  size={22} 
                  className={`mb-1 transition-transform ${currentView === 'history' ? 'scale-110 text-emerald-500' : ''}`} 
                />
                <span className="text-[10px] tracking-tight font-semibold">통계</span>
              </button>

              {/* Configure Add/Manage habits center */}
              <button
                type="button"
                onClick={() => navigateTo('manage')}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl w-20 transition-all ${
                  currentView === 'manage'
                    ? 'text-emerald-500 font-bold dark:text-emerald-400'
                    : 'text-zinc-400 hover:text-zinc-655 dark:hover:text-zinc-350'
                }`}
              >
                <HabitIcon 
                  name="add_circle" 
                  size={22} 
                  className={`mb-1 transition-transform ${currentView === 'manage' ? 'scale-110 text-emerald-500' : ''}`} 
                />
                <span className="text-[10px] tracking-tight font-semibold">습관관리</span>
              </button>
            </div>
          </nav>
        )}

      </div>
    </div>
  );
}
