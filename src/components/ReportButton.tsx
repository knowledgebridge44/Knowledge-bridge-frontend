import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { TextArea } from './TextArea';
import { useCreateReport } from '@/hooks/useReports';

interface ReportButtonProps {
  targetType: 'lesson' | 'question' | 'comment';
  targetId: number;
  className?: string;
  variant?: 'icon' | 'text';
}

export const ReportButton: React.FC<ReportButtonProps> = ({
  targetType,
  targetId,
  className = '',
  variant = 'icon',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  
  const createReport = useCreateReport();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reason.trim()) {
      setError('Please provide a reason for reporting');
      return;
    }

    createReport.mutate(
      {
        target_type: targetType,
        target_id: targetId,
        reason: reason.trim(),
      },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setReason('');
          setError('');
        },
      }
    );
  };

  const targetLabel = targetType === 'lesson' ? 'lesson' : targetType === 'question' ? 'question' : 'comment';

  return (
    <>
      {variant === 'icon' ? (
        <button
          onClick={() => setIsModalOpen(true)}
          className={`text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors ${className}`}
          title="Report inappropriate content"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
            />
          </svg>
        </button>
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsModalOpen(true)}
          className={className}
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
            />
          </svg>
          Report
        </Button>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Report ${targetLabel}`}>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="text-sm text-academic-text-secondary dark:text-dark-academic-text-secondary mb-4">
              Please describe why you believe this {targetLabel} violates our community guidelines. Our moderation team will review your report.
            </p>
            
            <TextArea
              label="Reason for reporting"
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                setError('');
              }}
              placeholder="e.g., Contains spam, harassment, inappropriate content..."
              rows={4}
              error={error}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setReason('');
                setError('');
              }}
              disabled={createReport.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={createReport.isPending}
              isLoading={createReport.isPending}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};


