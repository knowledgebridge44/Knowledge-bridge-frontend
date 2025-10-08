import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '@/hooks/useCourses';
import { useCreateLesson } from '@/hooks/useLessons';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { useAuth } from '@/providers/AuthProvider';

export const CreateLessonPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: coursesData, isLoading: coursesLoading } = useCourses(1, 100);
  const createLesson = useCreateLesson();

  const [formData, setFormData] = useState({
    courseId: '',
    title: '',
    content: '',
  });

  const [errors, setErrors] = useState({
    courseId: '',
    title: '',
    content: '',
  });

  // Filter courses to only show teacher's own courses
  const teacherCourses = coursesData?.data?.filter(
    (course) => course.teacher_id === user?.id
  ) || [];

  const validateForm = () => {
    const newErrors = {
      courseId: '',
      title: '',
      content: '',
    };

    if (!formData.courseId) {
      newErrors.courseId = 'Please select a course';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Lesson title must be at least 3 characters';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Lesson content is required';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Lesson content must be at least 10 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const courseId = parseInt(formData.courseId);
    createLesson.mutate(
      {
        courseId,
        data: {
          title: formData.title,
          content: formData.content,
        },
      },
      {
        onSuccess: () => {
          navigate(`/courses/${courseId}`);
        },
      }
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Show loading state
  if (coursesLoading) {
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

  // Only check for empty courses after loading is complete
  if (!coursesLoading && teacherCourses.length === 0) {
    return (
      <div className="container-custom py-8">
        <Card>
          <div className="text-center py-12">
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
            <h2 className="text-2xl font-bold mb-2">No Courses Found</h2>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary mb-6">
              You need to create a course first before adding lessons.
            </p>
            <Button onClick={() => navigate('/courses/create')}>
              Create a Course
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Lesson</h1>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            Add a new lesson to one of your courses. Lessons will be reviewed by an admin before being published.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle as="h2">Lesson Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Selection */}
              <div>
                <label
                  htmlFor="courseId"
                  className="block text-sm font-medium mb-1.5 text-academic-text dark:text-dark-academic-text"
                >
                  Select Course <span className="text-red-500">*</span>
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleChange}
                  className="input w-full"
                  aria-invalid={errors.courseId ? 'true' : 'false'}
                >
                  <option value="">Choose a course...</option>
                  {teacherCourses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.lessons_count || 0} lessons)
                    </option>
                  ))}
                </select>
                {errors.courseId && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
                    {errors.courseId}
                  </p>
                )}
              </div>

              {/* Lesson Title */}
              <Input
                label="Lesson Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter lesson title"
                error={errors.title}
                required
              />

              {/* Lesson Content */}
              <TextArea
                label="Lesson Content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="Write your lesson content here... You can include explanations, examples, and instructions."
                rows={12}
                error={errors.content}
                required
              />

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="text-sm text-blue-700 dark:text-blue-300">
                    <p className="font-medium mb-1">Lesson Review Process</p>
                    <p>
                      Your lesson will be submitted for admin review. Once approved, it will be visible to
                      students enrolled in this course.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={createLesson.isPending}
                  isLoading={createLesson.isPending}
                >
                  Create Lesson
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  disabled={createLesson.isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

