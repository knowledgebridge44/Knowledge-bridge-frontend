import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { ToastProvider } from './providers/ToastProvider';
import { MainLayout } from './layouts/MainLayout';
import { AuthGuard, GuestGuard, RoleGuard } from './router/guards';
import { initializeAuth } from './api/axios';

// Pages
import { LandingPage } from './pages/Landing';
import { LoginPage } from './pages/Login';
import { RegisterPage } from './pages/Register';
import { DashboardPage } from './pages/Dashboard';
import { CoursesPage } from './pages/Courses';
import { CourseDetailPage } from './pages/CourseDetail';
import { CreateCoursePage } from './pages/CreateCourse';
import { LessonDetailPage } from './pages/LessonDetail';
import { CreateLessonPage } from './pages/CreateLesson';
import { QuestionsPage } from './pages/Questions';
import { QuestionDetailPage } from './pages/QuestionDetail';
import { PendingLessonsPage } from './pages/admin/PendingLessons';
import { AnalyticsPage } from './pages/admin/Analytics';
import { ReportsPage } from './pages/admin/Reports';
import { ProfilePage } from './pages/Profile';

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App: React.FC = () => {
  // Initialize CSRF token on app boot
  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <AuthProvider>
              <MainLayout>
                <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />

                {/* Guest Only Routes */}
                <Route
                  path="/login"
                  element={
                    <GuestGuard>
                      <LoginPage />
                    </GuestGuard>
                  }
                />
                <Route
                  path="/register"
                  element={
                    <GuestGuard>
                      <RegisterPage />
                    </GuestGuard>
                  }
                />

                {/* Authenticated Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <DashboardPage />
                    </AuthGuard>
                  }
                />

                {/* Courses Routes */}
                <Route
                  path="/courses"
                  element={
                    <AuthGuard>
                      <CoursesPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/courses/create"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={['teacher']}>
                        <CreateCoursePage />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/courses/:id"
                  element={
                    <AuthGuard>
                      <CourseDetailPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/lessons/create"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={['teacher']}>
                        <CreateLessonPage />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/lessons/:id"
                  element={
                    <AuthGuard>
                      <LessonDetailPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/questions"
                  element={
                    <AuthGuard>
                      <QuestionsPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/questions/:id"
                  element={
                    <AuthGuard>
                      <QuestionDetailPage />
                    </AuthGuard>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <AuthGuard>
                      <ProfilePage />
                    </AuthGuard>
                  }
                />

                {/* Admin Routes */}
                <Route
                  path="/admin/pending-lessons"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={['admin']}>
                        <PendingLessonsPage />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/analytics"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={['admin']}>
                        <AnalyticsPage />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/reports"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={['admin']}>
                        <ReportsPage />
                      </RoleGuard>
                    </AuthGuard>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <AuthGuard>
                      <RoleGuard allowedRoles={['admin']}>
                        <div className="container-custom py-8">
                          <h1 className="text-3xl font-bold">Admin Panel (Coming Soon)</h1>
                        </div>
                      </RoleGuard>
                    </AuthGuard>
                  }
                />

                {/* 404 */}
                <Route
                  path="*"
                  element={
                    <div className="container-custom py-20 text-center">
                      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
                      <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
                        The page you're looking for doesn't exist.
                      </p>
                      <a href="/" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
                        Go back home
                      </a>
                    </div>
                  }
                />
                </Routes>
              </MainLayout>
            </AuthProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

