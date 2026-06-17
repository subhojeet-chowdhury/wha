import React from 'react';
import { useDemoState } from '../../store/DemoContext';
import { CheckCircle, Clock } from 'lucide-react';

const steps = [
  { id: 'draft', label: 'Draft' },
  { id: 'submitted', label: 'Submitted' },
  { id: 'hr_ops_approved', label: 'HR Ops Approved' },
  { id: 'comp_approved', label: 'Comp Approved' },
  { id: 'payroll_exception_flagged', label: 'Exceptions' },
  { id: 'transmitted', label: 'Transmitted' },
  { id: 'employee_notified', label: 'Notified' },
  { id: 'signed', label: 'Signed' }
];

export default function StatusStrip() {
  const { state } = useDemoState();

  const getStepIndex = () => {
    switch (state.transaction.pipelineStatus) {
      case 'draft': return 0;
      case 'submitted': return 1;
      case 'hr_ops_approved': return 2;
      case 'comp_approved': return 3;
      case 'payroll_exception_flagged': 
      case 'exception_proration_resolved':
      case 'exception_transport_resolved': return 4;
      case 'transmitted': return 5;
      case 'confirmed': return 5;
      case 'employee_notified': return 6;
      case 'signed': return 7;
      default: return 0;
    }
  };

  const currentIndex = getStepIndex();

  return (
    <div className="bg-white border-b border-gray-200 py-3 sticky top-[104px] z-30 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Stepper */}
          <div className="flex-1 overflow-x-auto hidden md:flex items-center space-x-2 scrollbar-hide py-1">
            {steps.map((step, index) => {
              const prev = index < currentIndex;
              const current = index === currentIndex;
              return (
                <div key={step.id} className="flex items-center group">
                  <div className={`flex items-center justify-center h-6 px-3 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    prev ? 'bg-green-100 text-green-700' :
                    current ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-500/30' :
                    'bg-gray-100 text-gray-400'
                  }`}>
                    {prev ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
                    {step.label}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-4 h-px mx-1 ${prev ? 'bg-green-300' : 'bg-gray-200'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="md:hidden text-sm font-medium text-blue-700">
            Pipeline: <strong>{steps[currentIndex].label}</strong>
          </div>

          {/* Countdown */}
          <div className="shrink-0 flex items-center bg-amber-50 border border-amber-200 rounded-md px-3 py-1.5 text-amber-800 text-sm font-medium shadow-sm">
            <Clock className="w-4 h-4 mr-2 text-amber-600" />
            Payroll Cut-Off: June 26, 2026 — 48 hours remaining
          </div>
        </div>
      </div>
    </div>
  );
}
