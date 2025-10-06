import { useState } from 'react';
import { useCourses, useEnrollCourse, useUnenrollCourse } from '@/hooks/useCourses';
import { CourseCard } from '@/components/CourseCard';
import { Button } from '@/components/Button';
import { useAuth } from '@/providers/AuthProvider';

export const CoursesPage = () => {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useCourses(page, 12);
  const enrollMutation = useEnrollCourse();
  const unenrollMutation = useUnenrollCourse();

  const handleEnroll = (courseId: number) => {
    enrollMutation.mutate(courseId);
  };

  const handleUnenroll = (courseId: number) => {
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
              Loading courses...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Failed to load courses</h2>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            {(error as any)?.message || 'An error occurred while fetching courses'}
          </p>
        </div>
      </div>
    );
  }

  const courses = data?.data || [];
  const pagination = data?.meta;

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Browse Courses</h1>
        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
          Explore our collection of courses and start learning today
        </p>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-academic-text-muted dark:text-dark-academic-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No courses available</h3>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            Check back later for new courses
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={user?.role === 'student' ? handleEnroll : undefined}
                onUnenroll={user?.role === 'student' ? handleUnenroll : undefined}
                isEnrolling={enrollMutation.isPending}
                isUnenrolling={unenrollMutation.isPending}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.last_page > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                {pagination.last_page > 5 && (
                  <>
                    <span className="text-academic-text-muted dark:text-dark-academic-text-muted">...</span>
                    <Button
                      variant={page === pagination.last_page ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => setPage(pagination.last_page)}
                    >
                      {pagination.last_page}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.last_page}
              >
                Next
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

