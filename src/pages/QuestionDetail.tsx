import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuestion, useQuestionComments, useCreateQuestionComment, useDeleteQuestion } from '@/hooks/useQuestions';
import { useDeleteComment } from '@/hooks/useComments';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TextArea } from '@/components/TextArea';
import { ReportButton } from '@/components/ReportButton';
import { useAuth } from '@/providers/AuthProvider';
import { useNavigate } from 'react-router-dom';

export const QuestionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const questionId = parseInt(id || '0');
  
  const { data: question, isLoading, isError, error } = useQuestion(questionId);
  const { data: comments } = useQuestionComments(questionId);
  
  const createComment = useCreateQuestionComment();
  const deleteComment = useDeleteComment();
  const deleteQuestion = useDeleteQuestion();

  const [answerContent, setAnswerContent] = useState('');

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerContent.trim()) return;

    createComment.mutate(
      { questionId, content: answerContent },
      {
        onSuccess: () => {
          setAnswerContent('');
        },
      }
    );
  };

  const handleDeleteQuestion = async () => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    deleteQuestion.mutate(questionId, {
      onSuccess: () => {
        navigate('/questions');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Loading question...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !question) {
    return (
      <div className="container-custom py-8">
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-red-500 dark:text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold mb-2">Question not found</h2>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
            {(error as any)?.message || 'The question you are looking for does not exist'}
          </p>
          <Link to="/questions">
            <Button variant="primary">Back to Q&A</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary">
        <Link to="/questions" className="hover:text-primary-600 dark:hover:text-primary-400">
          Q&A Forum
        </Link>
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
        <span className="text-academic-text dark:text-dark-academic-text">Question</span>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <h1 className="text-3xl font-bold">{question.title}</h1>
            {question.user_id !== user?.id && (
              <ReportButton targetType="question" targetId={question.id} />
            )}
          </div>
          {question.user_id === user?.id && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeleteQuestion}
              disabled={deleteQuestion.isPending}
              className="text-red-600 dark:text-red-400 border-red-600 dark:border-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Delete
            </Button>
          )}
        </div>

        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6 whitespace-pre-wrap">
          {question.content}
        </p>

        <div className="flex flex-wrap items-center gap-4 text-sm border-t border-academic-border dark:border-dark-academic-border pt-4">
          {question.user && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white text-sm font-medium">
                {question.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">Asked by</div>
                <div className="font-medium">{question.user.name}</div>
              </div>
            </div>
          )}
          
          {question.lesson && (
            <Link to={`/lessons/${question.lesson.id}`} className="flex items-center gap-2 hover:text-primary-600 dark:hover:text-primary-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <div>
                <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">Related to</div>
                <div className="font-medium">{question.lesson.title}</div>
              </div>
            </Link>
          )}

          {question.created_at && (
            <div className="ml-auto text-academic-text-muted dark:text-dark-academic-text-muted">
              {new Date(question.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          )}
        </div>
      </Card>

      {/* Answers Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">
          {comments?.data?.length || 0} {comments?.data?.length === 1 ? 'Answer' : 'Answers'}
        </h2>

        {/* Answer Form */}
        <Card className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Your Answer</h3>
          <form onSubmit={handleAnswerSubmit}>
            <TextArea
              label=""
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="Write your answer here..."
              rows={4}
            />
            <div className="mt-3">
              <Button
                type="submit"
                variant="primary"
                disabled={!answerContent.trim() || createComment.isPending}
                isLoading={createComment.isPending}
              >
                Post Answer
              </Button>
            </div>
          </form>
        </Card>

        {/* Answers List */}
        {comments && comments.data && comments.data.length > 0 ? (
          <div className="space-y-4">
            {comments.data.map((comment) => (
              <Card key={comment.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-primary-600 dark:bg-primary-500 flex items-center justify-center text-white font-medium">
                      {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <div className="font-medium">{comment.user?.name || 'Unknown'}</div>
                      <div className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">
                        {new Date(comment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {comment.user_id !== user?.id && (
                      <ReportButton targetType="comment" targetId={comment.id} />
                    )}
                    {comment.user_id === user?.id && (
                      <button
                        onClick={() => deleteComment.mutate({ id: comment.id, lessonId: 0 })}
                        className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm"
                        disabled={deleteComment.isPending}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary whitespace-pre-wrap">
                  {comment.content}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="w-16 h-16 mx-auto text-academic-text-muted dark:text-dark-academic-text-muted mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-academic-text-muted dark:text-dark-academic-text-muted">
              No answers yet. Be the first to answer!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};


