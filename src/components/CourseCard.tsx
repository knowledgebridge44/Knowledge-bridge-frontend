import { Link } from 'react-router-dom';
import { Course } from '@/types';
import { Button } from './Button';
import { Card } from './Card';

interface CourseCardProps {
  course: Course;
  onEnroll?: (courseId: number) => void;
  onUnenroll?: (courseId: number) => void;
  isEnrolling?: boolean;
  isUnenrolling?: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onUnenroll,
  isEnrolling = false,
  isUnenrolling = false,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <div className="flex-1">
        <h3 className="text-xl font-bold mb-2 text-academic-text dark:text-dark-academic-text">
          {course.title}
        </h3>
        <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4 line-clamp-3">
          {course.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-academic-text-muted dark:text-dark-academic-text-muted mb-4">
          {course.teacher && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span>{course.teacher.name}</span>
            </div>
          )}
          {course.lessons_count !== undefined && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span>{course.lessons_count} lessons</span>
            </div>
          )}
        </div>

        {/* Rating Display */}
        {(course.average_rating !== undefined || course.ratings_count !== undefined) && (
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-1">
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
            <span className="text-sm">
              {course.average_rating?.toFixed(1) || '0.0'} ({course.ratings_count || 0})
            </span>
          </div>
        )}

        {course.enrolled !== undefined && (
          <div className="mb-4">
            {course.enrolled ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Enrolled
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                Not enrolled
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex gap-2 mt-4">
        <Link to={`/courses/${course.id}`} className="flex-1">
          <Button variant="secondary" size="sm" fullWidth>
            View Details
          </Button>
        </Link>
        
        {course.enrolled !== undefined && (
          <>
            {course.enrolled ? (
              onUnenroll && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUnenroll(course.id)}
                  disabled={isUnenrolling}
                  isLoading={isUnenrolling}
                >
                  Unenroll
                </Button>
              )
            ) : (
              onEnroll && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => onEnroll(course.id)}
                  disabled={isEnrolling}
                  isLoading={isEnrolling}
                >
                  Enroll
                </Button>
              )
            )}
          </>
        )}
      </div>
    </Card>
  );
};



