/**
 * API client barrel export
 * Provides a unified interface for all API operations
 */

export { api, initializeAuth } from './axios';
export { authApi } from './endpoints/auth';
export { coursesApi } from './endpoints/courses';
export { lessonsApi } from './endpoints/lessons';
export { questionsApi } from './endpoints/questions';
export { commentsApi } from './endpoints/comments';
export { materialsApi } from './endpoints/materials';
export { ratingsApi } from './endpoints/ratings';
export { analyticsApi } from './endpoints/analytics';

