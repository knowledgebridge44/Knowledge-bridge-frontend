import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/providers/AuthProvider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
          Here's what's happening with your learning today
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle as="h3">My Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-2">0</div>
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
              Enrolled courses
            </p>
            <Link to="/courses">
              <Button variant="secondary" size="sm" fullWidth>
                Browse Courses
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h3">Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">0</div>
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
              Questions asked
            </p>
            <Link to="/questions">
              <Button variant="secondary" size="sm" fullWidth>
                View Q&A
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h3">Badges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">
              {user?.badges?.length || 0}
            </div>
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
              Badges earned
            </p>
            <Link to="/profile">
              <Button variant="secondary" size="sm" fullWidth>
                View Profile
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {user?.role === 'teacher' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle as="h3">Teacher Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses/create">
                <Button>Create New Course</Button>
              </Link>
              <Link to="/lessons/create">
                <Button variant="secondary">Upload Lesson</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {user?.role === 'admin' && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle as="h3">Admin Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/admin/pending-lessons">
                <Button>Review Pending Lessons</Button>
              </Link>
              <Link to="/admin/reports">
                <Button variant="secondary">View Reports</Button>
              </Link>
              <Link to="/admin/analytics">
                <Button variant="secondary">Analytics</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle as="h3">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary text-center py-8">
              No recent activity yet
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle as="h3">Recent Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary text-center py-8">
              No recent questions yet
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

