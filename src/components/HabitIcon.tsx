/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Droplet, 
  BookOpen, 
  Dumbbell, 
  Brain, 
  Flame, 
  Check, 
  Sparkles, 
  User, 
  Trash2, 
  Pencil, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Calendar, 
  Heart,
  History,
  X,
  Compass,
  PlusCircle,
  ArrowLeft
} from 'lucide-react';

interface HabitIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const HabitIcon: React.FC<HabitIconProps> = ({ name, className = '', size = 20 }) => {
  const iconProps = { className, size };

  switch (name.toLowerCase()) {
    case 'drop':
    case 'water_drop':
    case 'water':
      return <Droplet {...iconProps} />;
    case 'book':
    case 'menu_book':
      return <BookOpen {...iconProps} />;
    case 'dumbbell':
    case 'fitness_center':
    case 'fitness':
      return <Dumbbell {...iconProps} />;
    case 'brain':
    case 'self_improvement':
    case 'meditation':
      return <Brain {...iconProps} />;
    case 'flame':
    case 'fire':
      return <Flame {...iconProps} />;
    case 'check':
      return <Check {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'user':
    case 'account_circle':
      return <User {...iconProps} />;
    case 'trash':
    case 'delete':
      return <Trash2 {...iconProps} />;
    case 'edit':
    case 'pencil':
      return <Pencil {...iconProps} />;
    case 'plus':
    case 'add':
      return <Plus {...iconProps} />;
    case 'chevron_left':
    case 'arrow_back_ios':
      return <ChevronLeft {...iconProps} />;
    case 'chevron_right':
    case 'arrow_forward_ios':
      return <ChevronRight {...iconProps} />;
    case 'activity':
      return <Activity {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'heart':
      return <Heart {...iconProps} />;
    case 'history':
      return <History {...iconProps} />;
    case 'close':
    case 'x':
      return <X {...iconProps} />;
    case 'compass':
      return <Compass {...iconProps} />;
    case 'plus_circle':
    case 'add_circle':
      return <PlusCircle {...iconProps} />;
    case 'arrow_left':
    case 'arrow_back':
      return <ArrowLeft {...iconProps} />;
    default:
      return <Sparkles {...iconProps} />;
  }
};
