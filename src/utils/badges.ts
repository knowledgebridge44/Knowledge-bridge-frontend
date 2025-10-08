import { User, Course, Question, Comment } from '@/types';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  role?: 'student' | 'teacher' | 'all';
}

// Student badges
export const STUDENT_BADGES: Badge[] = [
  {
    id: 'first_enrollment',
    name: 'First Step',
    description: 'Enrolled in your first course',
    icon: '🎯',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    role: 'student',
  },
  {
    id: 'active_learner',
    name: 'Active Learner',
    description: 'Enrolled in 5 or more courses',
    icon: '📚',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    role: 'student',
  },
  {
    id: 'dedicated_student',
    name: 'Dedicated Student',
    description: 'Enrolled in 10 or more courses',
    icon: '🌟',
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    role: 'student',
  },
  {
    id: 'curious_mind',
    name: 'Curious Mind',
    description: 'Asked 5 questions',
    icon: '🤔',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    role: 'student',
  },
  {
    id: 'discussion_starter',
    name: 'Discussion Starter',
    description: 'Asked 10 questions',
    icon: '💬',
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    role: 'student',
  },
  {
    id: 'helpful_peer',
    name: 'Helpful Peer',
    description: 'Posted 10 comments',
    icon: '🤝',
    color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400',
    role: 'student',
  },
];

// Teacher badges
export const TEACHER_BADGES: Badge[] = [
  {
    id: 'first_course',
    name: 'Course Creator',
    description: 'Created your first course',
    icon: '👨‍🏫',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    role: 'teacher',
  },
  {
    id: 'prolific_educator',
    name: 'Prolific Educator',
    description: 'Created 5 or more courses',
    icon: '📖',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    role: 'teacher',
  },
  {
    id: 'master_teacher',
    name: 'Master Teacher',
    description: 'Created 10 or more courses',
    icon: '🎓',
    color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    role: 'teacher',
  },
  {
    id: 'lesson_builder',
    name: 'Lesson Builder',
    description: 'Created 10 lessons',
    icon: '📝',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    role: 'teacher',
  },
  {
    id: 'content_creator',
    name: 'Content Creator',
    description: 'Created 25 lessons',
    icon: '✨',
    color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400',
    role: 'teacher',
  },
  {
    id: 'helpful_mentor',
    name: 'Helpful Mentor',
    description: 'Answered 10 student questions',
    icon: '💡',
    color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    role: 'teacher',
  },
  {
    id: 'question_master',
    name: 'Question Master',
    description: 'Answered 50 student questions',
    icon: '🏆',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
    role: 'teacher',
  },
];

// Common badges for all users
export const COMMON_BADGES: Badge[] = [
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'One of the first 100 users',
    icon: '🐦',
    color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400',
    role: 'all',
  },
  {
    id: 'veteran',
    name: 'Veteran',
    description: 'Member for over 6 months',
    icon: '⏰',
    color: 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400',
    role: 'all',
  },
];

export interface BadgeCalculationData {
  user: User;
  courses: Course[];
  questions: Question[];
  comments: Comment[];
  lessonsCount?: number;
}

export function calculateEarnedBadges(
  role: 'student' | 'teacher' | 'admin',
  data: BadgeCalculationData
): Badge[] {
  const { user, courses, questions, comments, lessonsCount = 0 } = data;
  const badges: Badge[] = role === 'teacher' ? TEACHER_BADGES : STUDENT_BADGES;
  const allBadges = [...badges, ...COMMON_BADGES];

  const earnedBadges = allBadges.filter((badge) => {
    switch (badge.id) {
      // Student badges
      case 'first_enrollment':
        return courses.length >= 1;
      case 'active_learner':
        return courses.length >= 5;
      case 'dedicated_student':
        return courses.length >= 10;
      case 'curious_mind':
        return questions.length >= 5;
      case 'discussion_starter':
        return questions.length >= 10;
      case 'helpful_peer':
        return comments.length >= 10;

      // Teacher badges
      case 'first_course':
        return courses.length >= 1;
      case 'prolific_educator':
        return courses.length >= 5;
      case 'master_teacher':
        return courses.length >= 10;
      case 'lesson_builder':
        return lessonsCount >= 10;
      case 'content_creator':
        return lessonsCount >= 25;
      case 'helpful_mentor':
        return comments.length >= 10;
      case 'question_master':
        return comments.length >= 50;

      // Common badges
      case 'early_bird':
        return user.id <= 100;
      case 'veteran': {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return new Date(user.created_at) < sixMonthsAgo;
      }

      default:
        return false;
    }
  });

  return earnedBadges;
}

export function getAvailableBadges(role: 'student' | 'teacher' | 'admin'): Badge[] {
  const badges: Badge[] = role === 'teacher' ? TEACHER_BADGES : STUDENT_BADGES;
  return [...badges, ...COMMON_BADGES];
}


