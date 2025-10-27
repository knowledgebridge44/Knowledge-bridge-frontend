import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuestions } from '@/hooks/useQuestions';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAuth } from '@/providers/AuthProvider';

export const QuestionsPage = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const filterTeacher = searchParams.get('teacher'); // 'me' means current teacher's questions
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, error } = useQuestions(page, 100); // Fetch more for client-side filtering

  // Filter questions based on query parameter
  const filteredQuestions = useMemo(() => {
    const allQuestions = data?.data || [];
    
    if (filterTeacher === 'me' && user?.role === 'teacher') {
      // For teachers: show questions on their lessons + general questions
      return allQuestions.filter(q => {
        // General questions (no lesson association)
        if (!q.lesson_id) return true;
        
        // Questions on teacher's lessons
        if (q.lesson?.course) {
          const courseTeacherId = (q.lesson.course as any).teacher_id || (q.lesson.course as any).created_by;
          return courseTeacherId === user?.id;
        }
        
        return false;
      });
    } else if (filterTeacher === 'me' && user?.role === 'student') {
      // For students: show their own questions + general questions
      return allQuestions.filter(q => {
        // Their own questions
        if (q.user_id === user.id) return true;
        
        // General questions (no lesson association)
        if (!q.lesson_id) return true;
        
        return false;
      });
    }
    
    return allQuestions;
  }, [data?.data, filterTeacher, user]);

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Loading questions...
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
          <h2 className="text-2xl font-bold mb-2">Failed to load questions</h2>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            {(error as any)?.message || 'An error occurred while fetching questions'}
          </p>
        </div>
      </div>
    );
  }

  const questions = filteredQuestions;
  const pagination = data;

  const pageTitle = filterTeacher === 'me' 
    ? (user?.role === 'teacher' ? 'My Students\' Questions' : 'My Questions')
    : 'Q&A Forum';
  const pageDescription = filterTeacher === 'me' 
    ? (user?.role === 'teacher' ? 'Answer questions from students in your courses' : 'Your questions and general forum questions')
    : 'Ask questions and help others learn';

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{pageTitle}</h1>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            {pageDescription}
          </p>
        </div>
      </div>

      {/* Questions List */}
      {questions.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-academic-text-muted dark:text-dark-academic-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No questions yet</h3>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            Be the first to ask a question!
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {questions.map((question) => (
              <Link key={question.id} to={`/questions/${question.id}`}>
                <Card className="hover:shadow-lg transition-shadow">
                  <div className="flex gap-4">
                    {/* Stats sidebar */}
                    <div className="flex-shrink-0 flex flex-col items-center gap-3 text-center min-w-[80px] py-2">
                      <div>
                        <div className="text-2xl font-bold text-academic-text dark:text-dark-academic-text">
                          {question.comments_count || 0}
                        </div>
                        <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">
                          answers
                        </div>
                      </div>
                    </div>

                    {/* Question content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold mb-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {question.title}
                      </h3>
                      {question.content && (
                        <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary line-clamp-2 mb-3">
                          {question.content}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        {question.user && (
                          <div className="flex items-center gap-1 text-academic-text-muted dark:text-dark-academic-text-muted">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                            <span>{question.user.name}</span>
                          </div>
                        )}
                        {question.lesson && (
                          <div className="flex items-center gap-1 text-academic-text-muted dark:text-dark-academic-text-muted">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                            </svg>
                            <span>{question.lesson.title}</span>
                          </div>
                        )}
                        {question.created_at && (
                          <div className="flex items-center gap-1 text-academic-text-muted dark:text-dark-academic-text-muted">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{new Date(question.created_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
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


