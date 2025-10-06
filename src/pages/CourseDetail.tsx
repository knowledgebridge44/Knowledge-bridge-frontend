import { useParams, Link } from 'react-router-dom';
import { useCourse, useEnrollCourse, useUnenrollCourse } from '@/hooks/useCourses';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuth } from '@/providers/AuthProvider';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const courseId = parseInt(id || '0');
  const { data: course, isLoading, isError, error } = useCourse(courseId, true);
  const enrollMutation = useEnrollCourse();
  const unenrollMutation = useUnenrollCourse();

  const handleEnroll = () => {
    enrollMutation.mutate(courseId);
  };

  const handleUnenroll = () => {
    if (confirm('Are you sure you want to unenroll from this course?')) {
      unenrollMutation.mutate(courseId);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Loading course...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Course not found</h2>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
            {(error as any)?.message || 'The course you are looking for does not exist'}
          </p>
          <Link to="/courses">
            <Button variant="primary">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary">
        <Link to="/courses" className="hover:text-primary-600 dark:hover:text-primary-400">
          Courses
        </Link>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-academic-text dark:text-dark-academic-text">{course.title}</span>
      </div>

      {/* Course Header */}
      <Card className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
              {course.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-4">
              {course.teacher && (
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white font-medium">
                    {course.teacher.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">Instructor</div>
                    <div className="font-medium">{course.teacher.name}</div>
                  </div>
                </div>
              )}

              {course.lessons && (
                <div>
                  <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">Lessons</div>
                  <div className="font-medium">{course.lessons.length}</div>
                </div>
              )}

              {course.enrolled !== undefined && (
                <div>
                  {course.enrolled ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Enrolled
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      Not enrolled
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Enrollment Actions */}
          {user?.role === 'student' && course.enrolled !== undefined && (
            <div className="flex flex-col gap-2">
              {course.enrolled ? (
                <Button
                  variant="outline"
                  onClick={handleUnenroll}
                  disabled={unenrollMutation.isPending}
                  loading={unenrollMutation.isPending}
                >
                  Unenroll from Course
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  loading={enrollMutation.isPending}
                >
                  Enroll in Course
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Lessons List */}
      {course.enrolled && course.lessons && course.lessons.length > 0 ? (
        <div>
          <h2 className="text-2xl font-bold mb-4">Course Lessons</h2>
          <div className="space-y-3">
            {course.lessons.map((lesson, index) => (
              <Link key={lesson.id} to={`/lessons/${lesson.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{lesson.title}</h3>
                      {lesson.content && (
                        <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary line-clamp-2">
                          {lesson.content}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      {lesson.status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            lesson.status === 'approved'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                              : lesson.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {lesson.status}
                        </span>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-academic-text-muted dark:text-dark-academic-text-muted" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ) : !course.enrolled && user?.role === 'student' ? (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-primary-600 dark:text-primary-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Enroll to access lessons</h3>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
              You need to enroll in this course to view its lessons and materials
            </p>
            <Button
              variant="primary"
              onClick={handleEnroll}
              disabled={enrollMutation.isPending}
              loading={enrollMutation.isPending}
            >
              Enroll Now
            </Button>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-academic-text-muted dark:text-dark-academic-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              No lessons available yet
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

