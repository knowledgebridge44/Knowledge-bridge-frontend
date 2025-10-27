import React from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  useMostViewedLessons,
  useStudentActivity,
  useTeacherEngagement,
  usePlatformStats,
} from '@/hooks/useAnalytics';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/Card';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export const AnalyticsPage: React.FC = () => {
  const { data: platformStats, isLoading: platformLoading } = usePlatformStats();
  const { data: mostViewed, isLoading: viewedLoading } = useMostViewedLessons(10);
  const { data: studentActivity, isLoading: activityLoading } = useStudentActivity(30);
  const { data: teacherEngagement, isLoading: engagementLoading } = useTeacherEngagement();

  const isLoading = platformLoading || viewedLoading || activityLoading || engagementLoading;

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Loading analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Prepare user distribution data for pie chart
  const userDistribution = platformStats
    ? [
        { name: 'Students', value: platformStats.total_students },
        { name: 'Teachers', value: platformStats.total_teachers },
        { name: 'Admins', value: platformStats.total_admins },
      ]
    : [];

  return (
    <div className="container-custom py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Platform Analytics</h1>
        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
          Overview of platform activity and engagement metrics
        </p>
      </div>

      {/* Platform Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted mb-1">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                  {platformStats?.total_users || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted mb-1">
                  Total Courses
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {platformStats?.total_courses || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted mb-1">
                  Total Lessons
                </p>
                <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {platformStats?.total_lessons || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-yellow-600 dark:text-yellow-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-academic-text-muted dark:text-dark-academic-text-muted mb-1">
                  Total Enrollments
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {platformStats?.total_enrollments || 0}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* User Distribution Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle as="h2">User Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={userDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {userDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Most Viewed Lessons */}
        <Card>
          <CardHeader>
            <CardTitle as="h2">Most Viewed Lessons</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostViewed || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="lesson_title" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="views" fill="#3B82F6" name="Views" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Student Activity Over Time */}
        <Card>
          <CardHeader>
            <CardTitle as="h2">Student Activity (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentActivity || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="active_students"
                  stroke="#3B82F6"
                  name="Active Students"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="enrollments"
                  stroke="#10B981"
                  name="New Enrollments"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Teacher Engagement */}
        <Card>
          <CardHeader>
            <CardTitle as="h2">Teacher Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={teacherEngagement || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="teacher_name" angle={-45} textAnchor="end" height={100} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="lessons_count" fill="#10B981" name="Lessons" />
                <Bar dataKey="average_rating" fill="#F59E0B" name="Avg Rating" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

