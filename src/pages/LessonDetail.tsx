import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLesson } from '@/hooks/useLessons';
import { useMaterials, downloadMaterial } from '@/hooks/useMaterials';
import { useComments, useCreateComment, useDeleteComment } from '@/hooks/useComments';
import { useRatings, useCreateRating, useUpdateRating } from '@/hooks/useRatings';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { useAuth } from '@/providers/AuthProvider';
import { useToast } from '@/hooks/useToast';

export const LessonDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const toast = useToast();
  const lessonId = parseInt(id || '0');
  
  const { data: lesson, isLoading, isError, error } = useLesson(lessonId);
  const { data: materials } = useMaterials(lessonId);
  const { data: comments } = useComments(lessonId);
  const { data: ratings } = useRatings(lessonId);
  
  // Check if this is a preview lesson (first lesson of a course)
  const isPreviewLesson = lesson?.course && !lesson.course.enrolled;
  
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();
  const createRating = useCreateRating();
  const updateRating = useUpdateRating();

  const [commentContent, setCommentContent] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [downloadingMaterial, setDownloadingMaterial] = useState<number | null>(null);

  // Check if user has rated this lesson
  const userRating = ratings?.data?.find((r) => r.user_id === user?.id);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    createComment.mutate(
      { lessonId, content: commentContent },
      {
        onSuccess: () => {
          setCommentContent('');
        },
      }
    );
  };

  const handleRatingSubmit = () => {
    if (selectedRating < 1 || selectedRating > 5) {
      toast.error('Please select a rating between 1 and 5');
      return;
    }

    if (userRating) {
      updateRating.mutate({ id: userRating.id, rating: selectedRating, lessonId });
    } else {
      createRating.mutate({ lessonId, rating: selectedRating });
    }
    setSelectedRating(0);
  };

  const handleDownloadMaterial = async (materialId: number, filename: string) => {
    setDownloadingMaterial(materialId);
    try {
      await downloadMaterial(materialId, filename);
      toast.success('Material downloaded successfully');
    } catch (error) {
      toast.error('Failed to download material');
    } finally {
      setDownloadingMaterial(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Loading lesson...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Lesson not found</h2>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
            {(error as any)?.message || 'The lesson you are looking for does not exist'}
          </p>
          <Link to="/courses">
            <Button variant="primary">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = ratings?.data?.length
    ? ratings.data.reduce((sum, r) => sum + r.rating, 0) / ratings.data.length
    : 0;

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
        {lesson.course_id && (
          <>
            <Link to={`/courses/${lesson.course_id}`} className="hover:text-primary-600 dark:hover:text-primary-400">
              Course
            </Link>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </>
        )}
        <span className="text-academic-text dark:text-dark-academic-text">{lesson.title}</span>
      </div>

      {/* Preview Banner */}
      {isPreviewLesson && (
        <Card className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-blue-900 dark:text-blue-100">Preview Lesson</span>
            </div>
            <p className="text-blue-700 dark:text-blue-300 text-sm">
              This is a preview of the first lesson. Enroll in the course to access all lessons and materials.
            </p>
          </div>
        </Card>
      )}

      {/* Lesson Content */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-3xl font-bold">{lesson.title}</h1>
          
          {/* Rating Display */}
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-5 h-5 ${
                    star <= averageRating
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
            <p className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted">
              {averageRating.toFixed(1)} ({ratings?.data?.length || 0} ratings)
            </p>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary whitespace-pre-wrap">
            {lesson.content}
          </p>
        </div>
      </Card>

      {/* Materials */}
      {materials && materials.data && materials.data.length > 0 && (
        <Card className="mb-6">
          <h2 className="text-xl font-bold mb-4">Materials</h2>
          <div className="space-y-2">
            {materials.data.map((material) => (
              <div
                key={material.id}
                className="flex items-center justify-between p-3 bg-academic-bg-secondary dark:bg-dark-academic-bg-secondary rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-medium">{material.title}</div>
                    {material.description && (
                      <div className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary">
                        {material.description}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadMaterial(material.id, material.file_path || material.title)}
                  disabled={downloadingMaterial === material.id}
                  isLoading={downloadingMaterial === material.id}
                >
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Rating Section */}
      <Card className="mb-6">
        <h2 className="text-xl font-bold mb-4">Rate this Lesson</h2>
        {userRating ? (
          <div className="bg-academic-bg-secondary dark:bg-dark-academic-bg-secondary p-4 rounded-lg mb-4">
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-2">
              Your current rating:
            </p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-6 h-6 ${
                    star <= userRating.rating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        ) : null}
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                <svg
                  className={`w-8 h-8 ${
                    star <= selectedRating ? 'text-yellow-500' : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </button>
            ))}
          </div>
          <Button
            variant="primary"
            onClick={handleRatingSubmit}
            disabled={selectedRating === 0 || createRating.isPending || updateRating.isPending}
            isLoading={createRating.isPending || updateRating.isPending}
          >
            {userRating ? 'Update Rating' : 'Submit Rating'}
          </Button>
        </div>
      </Card>

      {/* Comments Section */}
      <Card>
        <h2 className="text-xl font-bold mb-4">Comments</h2>
        
        {/* Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-6">
          <TextArea
            label="Add a comment"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
          />
          <div className="mt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={!commentContent.trim() || createComment.isPending}
              isLoading={createComment.isPending}
            >
              Post Comment
            </Button>
          </div>
        </form>

        {/* Comments List */}
        {comments && comments.data && comments.data.length > 0 ? (
          <div className="space-y-4">
            {comments.data.map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-academic-bg-secondary dark:bg-dark-academic-bg-secondary rounded-lg"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium text-sm">{comment.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {comment.user_id === user?.id && (
                    <button
                      onClick={() => deleteComment.mutate({ id: comment.id, lessonId })}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                      disabled={deleteComment.isPending}
                    >
                      Delete
                    </button>
                  )}
                </div>
                <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-academic-text-muted dark:text-dark-academic-text-muted py-8">
            No comments yet. Be the first to comment!
          </p>
        )}
      </Card>

      {/* Enrollment CTA for Preview Users */}
      {isPreviewLesson && lesson.course && (
        <Card className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
          <div className="p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
                Enjoying this lesson?
              </h3>
            </div>
            <p className="text-blue-700 dark:text-blue-300 mb-6 max-w-2xl mx-auto">
              This is just the beginning! Enroll in <strong>{lesson.course.title}</strong> to access all lessons, 
              materials, and join the community discussion.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={`/courses/${lesson.course.id}`}>
                <Button variant="primary" size="lg">
                  Enroll in Course
                </Button>
              </Link>
              <Link to="/courses">
                <Button variant="outline" size="lg">
                  Browse More Courses
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};


