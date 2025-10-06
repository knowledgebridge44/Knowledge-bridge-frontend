import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AuthProvider } from './providers/AuthProvider';
import { ThemeProvider } from './providers/ThemeProvider';
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
import { LessonDetailPage } from './pages/LessonDetail';
import { QuestionsPage } from './pages/Questions';
import { QuestionDetailPage } from './pages/QuestionDetail';

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
                  path="/courses/:id"
                  element={
                    <AuthGuard>
                      <CourseDetailPage />
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
                      <div className="container-custom py-8">
                        <h1 className="text-3xl font-bold">Profile (Coming Soon)</h1>
                      </div>
                    </AuthGuard>
                  }
                />

                {/* Admin Routes */}
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
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;

