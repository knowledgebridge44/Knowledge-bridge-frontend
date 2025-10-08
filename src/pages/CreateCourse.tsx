import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCourse } from '@/hooks/useCourses';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { TextArea } from '@/components/TextArea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

export const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const createCourse = useCreateCourse();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const [errors, setErrors] = useState({
    title: '',
    description: '',
  });

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
    };

    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Course title must be at least 3 characters';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Course description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Course description must be at least 10 characters';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    createCourse.mutate(
      {
        title: formData.title,
        description: formData.description,
      },
      {
        onSuccess: (course) => {
          navigate(`/courses/${course.id}`);
        },
      }
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create New Course</h1>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            Create a new course to share your knowledge with students. After creating the course, you can add lessons.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle as="h2">Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Course Title */}
              <Input
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter course title"
                error={errors.title}
                required
              />

              {/* Course Description */}
              <TextArea
                label="Course Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what students will learn in this course..."
                rows={8}
                error={errors.description}
                helperText="Provide a detailed description of the course content, objectives, and what students will learn."
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
                    <p className="font-medium mb-1">Next Steps</p>
                    <p>
                      After creating your course, you'll be able to add lessons and materials. Students can
                      then enroll and start learning!
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  disabled={createCourse.isPending}
                  isLoading={createCourse.isPending}
                >
                  Create Course
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate(-1)}
                  disabled={createCourse.isPending}
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

