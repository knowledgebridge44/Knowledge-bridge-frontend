import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useCourses } from '@/hooks/useCourses';
import { useQuestions } from '@/hooks/useQuestions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { calculateEarnedBadges, getAvailableBadges } from '@/utils/badges';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { data: coursesData } = useCourses(1, 100);
  const { data: questionsData } = useQuestions(1, 100);

  if (!user) {
    return null;
  }

  // Calculate user statistics based on role
  const userCourses = useMemo(() => {
    if (user.role === 'teacher') {
      // For teachers: courses they created
      return coursesData?.data?.filter(
        (course) => course.teacher_id === user.id || (course as any).created_by === user.id
      ) || [];
    } else {
      // For students: enrolled courses
      return coursesData?.data?.filter((course) => course.enrolled) || [];
    }
  }, [coursesData, user]);

  // Questions: for students - their questions, for teachers - questions they answered
  const userQuestions = useMemo(() => {
    return questionsData?.data?.filter((q) => q.user_id === user.id) || [];
  }, [questionsData, user]);

  // For teachers: count questions answered (comments on questions related to their courses)
  const answeredQuestionsCount = useMemo(() => {
    if (user.role !== 'teacher') return 0;
    
    // Count questions on teacher's lessons + general questions
    const teacherQuestions = questionsData?.data?.filter(q => {
      // General questions (no lesson association)
      if (!q.lesson_id) return true;
      
      // Questions on teacher's lessons
      if (q.lesson?.course) {
        const courseTeacherId = (q.lesson.course as any).teacher_id || (q.lesson.course as any).created_by;
        return courseTeacherId === user.id;
      }
      
      return false;
    }) || [];
    
    // Count questions that have comments (answered)
    return teacherQuestions.filter(q => q.comments && q.comments.length > 0).length;
  }, [questionsData, user]);

  // Get lessons count for teachers
  const lessonsCount = useMemo(() => {
    if (user.role !== 'teacher') return 0;
    return userCourses.reduce((acc, course) => acc + (course.lessons_count || 0), 0);
  }, [userCourses, user]);

  // Determine which badges the user has earned
  const AVAILABLE_BADGES = getAvailableBadges(user.role);
  const earnedBadges = calculateEarnedBadges(user.role, {
    user,
    courses: userCourses,
    questions: userQuestions,
    comments: [], // We'll use commentsCount directly
    lessonsCount,
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'teacher':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'student':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(
                      user.role
                    )}`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </div>
                <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
                  {user.email}
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="text-academic-text-muted dark:text-dark-academic-text-muted">
                      Member since:
                    </span>{' '}
                    <span className="font-medium">
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-academic-text-muted dark:text-dark-academic-text-muted">
                      Badges:
                    </span>{' '}
                    <span className="font-medium">{earnedBadges.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                  {userCourses.length}
                </div>
                <div className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted">
                  {user.role === 'teacher' ? 'Courses Created' : 'Enrolled Courses'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {user.role === 'teacher' ? answeredQuestionsCount : userQuestions.length}
                </div>
                <div className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted">
                  {user.role === 'teacher' ? 'Questions Answered' : 'Questions Asked'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
                  {earnedBadges.length}
                </div>
                <div className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted">
                  Badges Earned
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle as="h2">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {AVAILABLE_BADGES.map((badge) => {
                const isEarned = earnedBadges.some((eb) => eb.id === badge.id);
                return (
                  <div
                    key={badge.id}
                    className={`p-4 rounded-lg border-2 ${
                      isEarned
                        ? 'border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-academic-border dark:border-dark-academic-border opacity-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-12 h-12 rounded-full ${badge.color} flex items-center justify-center text-2xl flex-shrink-0`}
                      >
                        {badge.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-sm">{badge.name}</h3>
                          {isEarned && (
                            <svg
                              className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </div>
                        <p className="text-xs text-academic-text-secondary dark:text-dark-academic-text-secondary">
                          {badge.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle as="h2">
                {user.role === 'teacher' ? 'My Created Courses' : 'My Enrolled Courses'}
              </CardTitle>
              <Link to={user.role === 'teacher' ? '/courses?teacher=me' : '/courses'}>
                <Button variant="secondary" size="sm">
                  {user.role === 'teacher' ? 'View All' : 'Browse More'}
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {userCourses.length === 0 ? (
                <div className="text-center py-8">
                  <svg
                    className="w-16 h-16 mx-auto text-academic-text-muted dark:text-dark-academic-text-muted mb-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
                    {user.role === 'teacher' 
                      ? "You haven't created any courses yet" 
                      : "You haven't enrolled in any courses yet"}
                  </p>
                  <Link to={user.role === 'teacher' ? '/courses/create' : '/courses'}>
                    <Button>{user.role === 'teacher' ? 'Create Course' : 'Explore Courses'}</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {userCourses.slice(0, 5).map((course) => (
                    <Link
                      key={course.id}
                      to={`/courses/${course.id}`}
                      className="block p-4 rounded-lg border border-academic-border dark:border-dark-academic-border hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-semibold mb-1">{course.title}</h3>
                      <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary line-clamp-1">
                        {course.description}
                      </p>
                      {course.lessons_count !== undefined && (
                        <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted mt-2">
                          {course.lessons_count} lessons
                        </div>
                      )}
                    </Link>
                  ))}
                  {userCourses.length > 5 && (
                    <Link to={user.role === 'teacher' ? '/courses?teacher=me' : '/courses'}>
                      <Button variant="secondary" size="sm" fullWidth>
                        View All ({userCourses.length} courses)
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  );
};

