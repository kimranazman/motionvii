import { X, User, Calendar, Building2, DollarSign, FileText, AlertCircle } from 'lucide-react';
import { useAppStore } from '@/store';
import { cn, formatDate, getStatusColor } from '@/lib/utils';
import { InitiativeStatus } from '@/types';

const STATUSES: InitiativeStatus[] = [
  'Not Started',
  'In Progress',
  'On Hold',
  'At Risk',
  'Completed',
];

export function InitiativeModal() {
  const { selectedInitiative, isInitiativeModalOpen, closeInitiativeModal } =
    useAppStore();

  if (!isInitiativeModalOpen || !selectedInitiative) return null;

  const initiative = selectedInitiative;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={closeInitiativeModal}
      />

      {/* Modal */}
      <div className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-2xl sm:max-h-[90vh] z-50 overflow-hidden">
        <div className="glass rounded-xl h-full flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-6 border-b border-border">
            <div className="flex-1 pr-4">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full text-white',
                    getStatusColor(initiative.status)
                  )}
                >
                  {initiative.status}
                </span>
                {initiative.department && (
                  <span className="px-2 py-1 text-xs rounded bg-surface text-text-muted">
                    {initiative.department}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-text-primary">
                {initiative.initiative}
              </h2>
            </div>
            <button
              onClick={closeInitiativeModal}
              className="p-2 rounded-lg hover:bg-surface transition-colors"
            >
              <X className="w-5 h-5 text-text-secondary" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Objective & Key Result */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg bg-surface">
                <h3 className="text-sm font-medium text-text-muted mb-2">
                  Objective
                </h3>
                <p className="text-text-primary">
                  {initiative.objective || '-'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-surface">
                <h3 className="text-sm font-medium text-text-muted mb-2">
                  Key Result
                </h3>
                <p className="text-text-primary">
                  {initiative.keyResult || '-'}
                </p>
              </div>
            </div>

            {/* Tasks */}
            {(initiative.monthlyObjective || initiative.weeklyTasks) && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-text-muted flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Tasks
                </h3>
                {initiative.monthlyObjective && (
                  <div className="p-4 rounded-lg bg-surface">
                    <p className="text-xs text-text-muted mb-1">
                      Monthly Objective
                    </p>
                    <p className="text-text-secondary">
                      {initiative.monthlyObjective}
                    </p>
                  </div>
                )}
                {initiative.weeklyTasks && (
                  <div className="p-4 rounded-lg bg-surface">
                    <p className="text-xs text-text-muted mb-1">Weekly Tasks</p>
                    <p className="text-text-secondary whitespace-pre-wrap">
                      {initiative.weeklyTasks}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Meta Grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Timeline */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs text-text-muted">Timeline</p>
                  <p className="text-text-primary">
                    {formatDate(initiative.startDate)} -{' '}
                    {formatDate(initiative.endDate)}
                  </p>
                </div>
              </div>

              {/* Person in Charge */}
              <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                <User className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-text-muted">Person in Charge</p>
                  <p className="text-text-primary">
                    {initiative.personInCharge || '-'}
                  </p>
                </div>
              </div>

              {/* Accountable */}
              {initiative.accountable && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                  <User className="w-5 h-5 text-secondary" />
                  <div>
                    <p className="text-xs text-text-muted">Accountable</p>
                    <p className="text-text-primary">{initiative.accountable}</p>
                  </div>
                </div>
              )}

              {/* Resources */}
              {initiative.resourcesFinancial && (
                <div className="flex items-center gap-3 p-4 rounded-lg bg-surface">
                  <DollarSign className="w-5 h-5 text-status-on-hold" />
                  <div>
                    <p className="text-xs text-text-muted">Financial Resources</p>
                    <p className="text-text-primary">
                      {initiative.resourcesFinancial}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Remarks */}
            {initiative.remarks && (
              <div className="p-4 rounded-lg bg-surface border border-status-on-hold/30">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-status-on-hold" />
                  <h3 className="text-sm font-medium text-text-muted">Remarks</h3>
                </div>
                <p className="text-text-secondary">{initiative.remarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
