import React from 'react';
import { useDemoState } from '../store/DemoContext';
import { Smartphone, CheckCircle, TrendingUp, AlertCircle } from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function CompTab() {
  const { state, approveComp } = useDemoState();

  const isPending = state.transaction.pipelineStatus === 'hr_ops_approved';
  const isApproved = ['comp_approved', 'payroll_exception_flagged', 'exception_proration_resolved', 'exception_transport_resolved', 'transmitted', 'confirmed', 'employee_notified', 'signed'].includes(state.transaction.pipelineStatus);

  if (state.transaction.pipelineStatus === 'draft' || state.transaction.pipelineStatus === 'submitted') {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <AlertCircle className="w-12 h-12 mb-4 text-gray-300" />
        <p>No compensation approvals pending right now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-8">
      <div className="flex items-center text-gray-500 mb-6 text-sm">
        <Smartphone className="w-4 h-4 mr-2" />
        Simulated Mobile Dashboard Display
      </div>

      <div className="w-[360px] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        {/* Mobile Header */}
        <div className="bg-[#C74634] text-white px-4 py-3 flex items-center justify-between">
          <div className="text-xs opacity-80">Oracle Approvals</div>
          <div className="text-sm font-semibold">1 Pending</div>
        </div>

        <div className="p-5">
          <Badge status="review" className="mb-3">Out-of-Cycle Promo</Badge>
          
          <h2 className="text-xl font-bold text-gray-900 leading-tight mb-1">
            Lucas &rarr; Senior Lab Manager
          </h2>
          <p className="text-sm text-gray-500 mb-6">Effective: {state.transaction.effectiveDate}</p>

          {/* AI Comp Brief Panel */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
            <h3 className="text-xs font-bold text-blue-800 uppercase tracking-wider flex items-center mb-2">
              <TrendingUp className="w-3 h-3 mr-1" /> Agent Summary
            </h3>
            <p className="text-sm text-blue-900 leading-relaxed">
              Lucas's <span className="font-semibold">12% increase</span> is justified by his shift to {state.transaction.toGrade} and is fully absorbed by the {state.transaction.toDept} surplus budget.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
              <div className="text-xs text-gray-500 mb-1">Current Base</div>
              <div className="text-base font-semibold text-gray-700">€{state.transaction.oldBaseSalaryMonthly}/mo</div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <div className="text-xs text-indigo-600 mb-1">New Base (+12%)</div>
              <div className="text-base font-bold text-indigo-900">€{state.transaction.newBaseSalaryMonthly}/mo</div>
            </div>
          </div>

          {/* Action button */}
          {isPending && (
            <button 
              onClick={approveComp}
              className="w-full bg-[#C74634] hover:bg-[#A63A2B] text-white py-3.5 rounded-xl font-medium shadow-md transition-all active:scale-95 flex justify-center items-center"
            >
              <CheckCircle className="w-5 h-5 mr-2" />
              Approve
            </button>
          )}

          {isApproved && (
            <div className="w-full bg-green-100 text-green-800 border fill-green-500 py-3.5 border-green-200 rounded-xl font-medium flex justify-center items-center">
              <CheckCircle className="w-5 h-5 mr-2" />
              Approved - Finalized
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
