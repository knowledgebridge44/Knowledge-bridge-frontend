// Core entity types
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  teacher_id: number;
  teacher?: User;
  enrolled?: boolean;
  enrollment_count?: number;
  lessons_count?: number;
  lessons?: Lesson[];
  average_rating?: number;
  ratings_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  course?: Course;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  views: number;
  teacher_id: number;
  teacher?: User;
  materials?: Material[];
  ratings?: Rating[];
  comments?: Comment[];
  average_rating?: number;
  created_at: string;
  updated_at: string;
}

export interface Material {
  id: number;
  lesson_id: number;
  lesson?: Lesson;
  title: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
  updated_at: string;
}

export interface Question {
  id: number;
  user_id: number;
  user?: User;
  lesson_id: number;
  lesson?: Lesson;
  title: string;
  content: string;
  comments?: Comment[];
  comments_count?: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  user_id: number;
  user?: User;
  commentable_type: 'lesson' | 'question';
  commentable_id: number;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Rating {
  id: number;
  user_id: number;
  user?: User;
  lesson_id: number;
  lesson?: Lesson;
  rating: number;
  created_at: string;
  updated_at: string;
}

export interface Report {
  id: number;
  reporter_id: number;
  reporter?: User;
  reportable_type: 'lesson' | 'question' | 'comment';
  reportable_id: number;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: number;
  user_id: number;
  user?: User;
  course_id: number;
  course?: Course;
  enrolled_at: string;
  created_at: string;
  updated_at: string;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
}

export interface ApiResponse<T = any> {
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ValidationError {
  field: string;
  messages: string[];
}

// Form types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: 'teacher' | 'student';
}

export interface LessonFormData {
  title: string;
  content: string;
}

export interface QuestionFormData {
  lesson_id: number;
  title: string;
  content: string;
}

export interface CommentFormData {
  content: string;
}

export interface MaterialUploadData {
  title: string;
  file: File;
}

// Analytics types
export interface LessonViewStats {
  lesson_id: number;
  lesson_title: string;
  views: number;
  average_rating: number;
}

export interface StudentActivityStats {
  date: string;
  active_students: number;
  enrollments: number;
}

export interface TeacherEngagementStats {
  teacher_id: number;
  teacher_name: string;
  lessons_count: number;
  average_rating: number;
}

export interface PlatformStats {
  total_users: number;
  total_courses: number;
  total_lessons: number;
  total_enrollments: number;
  total_students: number;
  total_teachers: number;
  total_admins: number;
}

// Theme types
export type Theme = 'light' | 'dark';

// Route guard types
export type UserRole = 'admin' | 'teacher' | 'student';


