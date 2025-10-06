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

              {course.lessons_count !== undefined && (
                <div>
                  <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">Lessons</div>
                  <div className="font-medium">{course.lessons_count}</div>
                </div>
              )}

              {/* Rating Display */}
              {(course.average_rating !== undefined || course.ratings_count !== undefined) && (
                <div>
                  <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">Rating</div>
                  <div className="flex items-center gap-1">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${
                            star <= (course.average_rating || 0)
                              ? 'text-yellow-500'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-medium">
                      {course.average_rating?.toFixed(1) || '0.0'} ({course.ratings_count || 0})
                    </span>
                  </div>
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
                  variant="secondary"
                  onClick={handleUnenroll}
                  disabled={unenrollMutation.isPending}
                  isLoading={unenrollMutation.isPending}
                >
                  Unenroll from Course
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  isLoading={enrollMutation.isPending}
                >
                  Enroll in Course
                </Button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Lessons List */}
      {course.lessons && course.lessons.length > 0 ? (
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
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{lesson.title}</h3>
                        {!course.enrolled && index === 0 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                            Preview
                          </span>
                        )}
                      </div>
                      {lesson.content && (
                        <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary line-clamp-2">
                          {lesson.content}
                        </p>
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
          
          {/* Show enrollment CTA for non-enrolled users */}
          {!course.enrolled && user?.role === 'student' && (
            <Card className="mt-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <div className="p-6 text-center">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Want to see more lessons?
                </h3>
                <p className="text-blue-700 dark:text-blue-300 mb-4">
                  Enroll in this course to access all lessons and materials
                </p>
                <Button
                  variant="primary"
                  onClick={handleEnroll}
                  disabled={enrollMutation.isPending}
                  isLoading={enrollMutation.isPending}
                >
                  Enroll Now
                </Button>
              </div>
            </Card>
          )}
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold mb-4">Course Lessons</h2>
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
        </div>
      )}
    </div>
  );
};



