import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { useCourses } from '@/hooks/useCourses';
import { useQuestions } from '@/hooks/useQuestions';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';
import { calculateEarnedBadges } from '@/utils/badges';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { data: coursesData } = useCourses(1, 100); // Fetch all courses
  const { data: questionsData } = useQuestions(1, 100); // Fetch questions
  
  // For students: count enrolled courses
  // For teachers: count courses they created
  const coursesCount = user?.role === 'teacher'
    ? coursesData?.data?.filter(course => 
        course.teacher_id === user?.id || (course as any).created_by === user?.id
      )?.length || 0
    : coursesData?.data?.filter(course => course.enrolled)?.length || 0;
  
  // Count questions based on role
  // For teachers: count questions on their lessons + general questions
  // For students: count their own questions
  const userQuestionsCount = user?.role === 'teacher'
    ? questionsData?.data?.filter(q => {
        // General questions (no lesson association)
        if (!q.lesson_id) return true;
        
        // Questions on teacher's lessons
        if (q.lesson?.course) {
          const courseTeacherId = (q.lesson.course as any).teacher_id || (q.lesson.course as any).created_by;
          return courseTeacherId === user?.id;
        }
        
        return false;
      })?.length || 0
    : questionsData?.data?.filter(q => q.user_id === user?.id)?.length || 0;

  // Calculate badges
  const userCourses = useMemo(() => {
    if (user?.role === 'teacher') {
      return coursesData?.data?.filter(course => 
        course.teacher_id === user?.id || (course as any).created_by === user?.id
      ) || [];
    } else {
      return coursesData?.data?.filter(course => course.enrolled) || [];
    }
  }, [coursesData, user]);

  const userQuestions = useMemo(() => {
    return questionsData?.data?.filter(q => q.user_id === user?.id) || [];
  }, [questionsData, user]);

  const lessonsCount = useMemo(() => {
    if (user?.role !== 'teacher') return 0;
    return userCourses.reduce((acc, course) => acc + (course.lessons_count || 0), 0);
  }, [userCourses, user]);

  const badgesCount = user ? calculateEarnedBadges(user.role, {
    user,
    courses: userCourses,
    questions: userQuestions,
    comments: [], // We'll use commentsCount directly  
    lessonsCount,
  }).length : 0;

  // Recent questions
  const recentQuestions = questionsData?.data?.slice(0, 5) || [];

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
          {user?.role === 'teacher' 
            ? "Here's an overview of your teaching activity" 
            : user?.role === 'admin'
            ? "Here's your platform overview"
            : "Here's what's happening with your learning today"}
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle as="h3">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">{coursesCount}</div>
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
              {user?.role === 'teacher' ? 'Courses created' : 'Enrolled courses'}
            </p>
              <Link to={user?.role === 'teacher' ? '/courses?teacher=me' : '/courses'}>
                <Button variant="secondary" size="sm" fullWidth>
                  {user?.role === 'teacher' ? 'View My Courses' : 'Browse Courses'}
                </Button>
              </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h3">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">{userQuestionsCount}</div>
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
              {user?.role === 'teacher' ? 'Questions to answer' : 'Questions asked'}
            </p>
            <Link to="/questions?teacher=me">
              <Button variant="secondary" size="sm" fullWidth>
                {user?.role === 'teacher' ? 'Answer Questions' : 'View My Questions'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h3">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {badgesCount}
            </div>
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
              Badges earned
            </p>
            <Link to="/profile">
              <Button variant="secondary" size="sm" fullWidth>
                View Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {user?.role === 'teacher' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle as="h3">Teacher Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses/create">
                <Button>Create New Course</Button>
              </Link>
              <Link to="/lessons/create">
                <Button variant="secondary">Upload Lesson</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === 'admin' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle as="h3">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/admin/pending-lessons">
                <Button>Review Pending Lessons</Button>
              </Link>
              <Link to="/admin/reports">
                <Button variant="secondary">View Reports</Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="secondary">Analytics</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle as="h3">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {coursesData?.data && coursesData.data.length > 0 ? (
              <div className="space-y-3">
                {coursesData.data.slice(0, 5).map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="block p-3 rounded-lg hover:bg-academic-bg-secondary dark:hover:bg-dark-academic-bg-secondary transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-academic-text dark:text-dark-academic-text truncate">
                          {course.title}
                        </p>
                        <p className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">
                          {course.lessons_count || 0} lessons
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary text-center py-8">
                No courses yet. {user?.role === 'teacher' ? 'Create your first course!' : 'Enroll in a course to get started!'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h3">Recent Questions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentQuestions.length > 0 ? (
              <div className="space-y-3">
                {recentQuestions.map((question) => (
                  <Link
                    key={question.id}
                    to={`/questions/${question.id}`}
                    className="block p-3 rounded-lg hover:bg-academic-bg-secondary dark:hover:bg-dark-academic-bg-secondary transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-academic-text dark:text-dark-academic-text truncate">
                          {question.title}
                        </p>
                        <p className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">
                          {question.comments_count || 0} answers
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary text-center py-8">
                No questions yet. Visit the Q&A forum to ask or answer questions!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};




