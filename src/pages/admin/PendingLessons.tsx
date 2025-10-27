import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePendingLessons, useApproveLesson } from '@/hooks/useLessons';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Modal } from '@/components/Modal';

export const PendingLessonsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const perPage = 20;
  const { data, isLoading, isError, error } = usePendingLessons(page, perPage);
  const approveLesson = useApproveLesson();

  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const lessons = data?.data || [];
  const meta = data;

  const handleApprove = (lessonId: number) => {
    if (confirm('Are you sure you want to approve this lesson?')) {
      approveLesson.mutate(lessonId);
    }
  };

  const handlePreview = (lessonId: number) => {
    setSelectedLesson(lessonId);
    setPreviewModalOpen(true);
  };

  const selectedLessonData = lessons.find((l) => l.id === selectedLesson);

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Loading pending lessons...
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
          <svg
            className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Error Loading Lessons</h2>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
            {(error as any)?.message || 'Failed to load pending lessons'}
          </p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Pending Lesson Approvals</h1>
        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
          Review and approve lessons submitted by teachers
        </p>
      </div>

      {lessons.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-green-500 dark:text-green-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold mb-2">All Caught Up!</h2>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              No pending lessons to review at the moment.
            </p>
          </div>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-yellow-600 dark:text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-1">{lesson.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-academic-text-muted dark:text-dark-academic-text-muted mb-2">
                          {lesson.teacher && (
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span>{lesson.teacher.name}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                            </svg>
                            <span>Course ID: {lesson.course_id}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span>{new Date(lesson.created_at).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary line-clamp-2 mb-3">
                          {lesson.content}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 md:flex-shrink-0">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleApprove(lesson.id)}
                      disabled={approveLesson.isPending}
                      isLoading={approveLesson.isPending}
                    >
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Approve
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePreview(lesson.id)}
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      Preview
                    </Button>
                    <Link to={`/courses/${lesson.course_id}`}>
                      <Button variant="secondary" size="sm" fullWidth>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                        </svg>
                        View Course
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                variant="secondary"
              >
                Previous
              </Button>
              <span className="flex items-center text-academic-text dark:text-dark-academic-text">
                Page {page} of {meta.last_page}
              </span>
              <Button
                onClick={() => setPage((prev) => Math.min(prev + 1, meta.last_page))}
                disabled={page === meta.last_page}
                variant="secondary"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {selectedLessonData && (
        <Modal
          isOpen={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          title="Lesson Preview"
        >
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold mb-2">{selectedLessonData.title}</h3>
              <div className="flex items-center gap-4 text-sm text-academic-text-muted dark:text-dark-academic-text-muted mb-4">
                {selectedLessonData.teacher && (
                  <span>Teacher: {selectedLessonData.teacher.name}</span>
                )}
                <span>
                  Submitted: {new Date(selectedLessonData.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="prose dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap">{selectedLessonData.content}</p>
            </div>
            <div className="flex gap-3 pt-4 border-t border-academic-border dark:border-dark-academic-border">
              <Button
                variant="primary"
                onClick={() => {
                  handleApprove(selectedLessonData.id);
                  setPreviewModalOpen(false);
                }}
                disabled={approveLesson.isPending}
                isLoading={approveLesson.isPending}
              >
                Approve Lesson
              </Button>
              <Button variant="secondary" onClick={() => setPreviewModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

