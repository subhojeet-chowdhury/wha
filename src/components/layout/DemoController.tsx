import React from 'react';
import { useDemoState } from '../../store/DemoContext';
import { Settings, RefreshCw, ChevronRight } from 'lucide-react';

export default function DemoController() {
  const { state, resetDemo } = useDemoState();

  const getNextStepHint = () => {
    switch (state.transaction.pipelineStatus) {
      case 'draft': return "Stefan: Submit request";
      case 'submitted': return "Marcus: Approve out-of-cycle change";
      case 'hr_ops_approved': return "Elena: Review & Approve Comp";
      case 'comp_approved': return "Fiona: Resolve payroll exceptions";
      case 'payroll_exception_flagged': return "Fiona: Accept AI Proration";
      case 'exception_proration_resolved': return "Fiona: Auto-Align Transport Code";
      case 'exception_transport_resolved': return "Fiona: Execute Transmission";
      case 'transmitted': 
      case 'confirmed': return "Lucas: Review on mobile app";
      case 'employee_notified': return "Lucas: Sign letter";
      case 'signed': return "Demo Complete";
      default: return "";
    }
  };

  return (
    <div className="group flex items-center">
      <div className="flex items-center space-x-2 bg-white/90 backdrop-blur border border-gray-200 shadow hover:shadow-md transition-shadow rounded-full pl-4 pr-1 py-1">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center">
          <Settings className="w-3 h-3 mr-1" />
          Demo Control
        </span>
        <div className="h-4 w-px bg-gray-300 mx-2"></div>
        <span className="text-sm font-medium text-indigo-600 mr-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:inline">
          Next: {getNextStepHint()}
        </span>
        <button 
          onClick={resetDemo}
          className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors flex items-center"
          title="Reset Demo"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
