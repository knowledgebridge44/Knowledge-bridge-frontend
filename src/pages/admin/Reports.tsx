import React, { useState } from 'react';
import { useReports, useUpdateReport, useDeleteReport } from '@/hooks/useReports';
import { Card, CardContent } from '@/components/Card';
import { Button } from '@/components/Button';

export const ReportsPage: React.FC = () => {
  const { data: reports, isLoading, isError, error } = useReports();
  const updateReport = useUpdateReport();
  const deleteReport = useDeleteReport();
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'open' | 'resolved' | 'dismissed'>('all');

  if (isLoading) {
    return (
      <div className="container-custom py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 dark:border-primary-400 mx-auto mb-4"></div>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Loading reports...
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
          <h2 className="text-2xl font-bold mb-2">Failed to load reports</h2>
          <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
            {(error as any)?.message || 'An error occurred while fetching reports'}
          </p>
        </div>
      </div>
    );
  }

  const filteredReports = selectedStatus === 'all' 
    ? reports 
    : reports?.filter(report => report.status === selectedStatus);

  const handleStatusChange = (reportId: number, status: 'open' | 'resolved' | 'dismissed') => {
    updateReport.mutate({ id: reportId, status });
  };

  const handleDelete = (reportId: number) => {
    if (confirm('Are you sure you want to delete this report?')) {
      deleteReport.mutate(reportId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  const getTargetTypeIcon = (targetType: string) => {
    switch (targetType) {
      case 'lesson':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
          </svg>
        );
      case 'question':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'comment':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container-custom py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Content Reports</h1>
        <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
          Review and moderate user-reported content
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex gap-2 border-b border-academic-border dark:border-dark-academic-border">
        {(['all', 'open', 'resolved', 'dismissed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 font-medium transition-colors ${
              selectedStatus === status
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-academic-text-muted dark:text-dark-academic-text-muted hover:text-academic-text dark:hover:text-dark-academic-text'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            {status !== 'all' && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-academic-bg-secondary dark:bg-dark-academic-bg-secondary">
                {reports?.filter(r => r.status === status).length || 0}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {!filteredReports || filteredReports.length === 0 ? (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No {selectedStatus !== 'all' ? selectedStatus : ''} reports</h3>
            <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
              {selectedStatus === 'all' 
                ? 'There are no reports to review' 
                : `There are no ${selectedStatus} reports`}
            </p>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    {/* Target Type Icon */}
                    <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400 flex-shrink-0">
                      {getTargetTypeIcon(report.target_type)}
                    </div>

                    {/* Report Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-academic-text-muted dark:text-dark-academic-text-muted">
                          {report.target_type.charAt(0).toUpperCase() + report.target_type.slice(1)} #{report.target_id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                      </div>

                      <p className="text-sm text-academic-text dark:text-dark-academic-text mb-2">
                        <span className="font-medium">Reported by:</span> {report.user?.name || 'Unknown User'}
                      </p>

                      <div className="bg-academic-bg-secondary dark:bg-dark-academic-bg-secondary rounded-lg p-3 mb-3">
                        <p className="text-sm font-medium text-academic-text-muted dark:text-dark-academic-text-muted mb-1">
                          Reason:
                        </p>
                        <p className="text-sm text-academic-text dark:text-dark-academic-text whitespace-pre-wrap">
                          {report.reason}
                        </p>
                      </div>

                      <p className="text-xs text-academic-text-muted dark:text-dark-academic-text-muted">
                        Reported on {new Date(report.created_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 ml-4">
                    {report.status === 'open' && (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(report.id, 'resolved')}
                          disabled={updateReport.isPending}
                        >
                          Resolve
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusChange(report.id, 'dismissed')}
                          disabled={updateReport.isPending}
                        >
                          Dismiss
                        </Button>
                      </>
                    )}
                    {report.status !== 'open' && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusChange(report.id, 'open')}
                        disabled={updateReport.isPending}
                      >
                        Reopen
                      </Button>
                    )}
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(report.id)}
                      disabled={deleteReport.isPending}
                      className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};


