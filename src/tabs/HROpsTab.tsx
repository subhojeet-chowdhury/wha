import React from 'react';
import { useDemoState } from '../store/DemoContext';
import { ShieldCheck, UserCircle, Check, X } from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function HROpsTab() {
  const { state, approveHROps } = useDemoState();
  
  // Only show details if Marcus hasn't approved yet, or show a completed state
  const isPending = state.transaction.pipelineStatus === 'submitted';
  const isApproved = ['hr_ops_approved', 'comp_approved', 'payroll_exception_flagged', 'exception_proration_resolved', 'exception_transport_resolved', 'transmitted', 'confirmed', 'employee_notified', 'signed'].includes(state.transaction.pipelineStatus);

  return (
    <div className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-light text-gray-800 mb-6">Approval Worklist</h1>

      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">Requester / Subject</div>
          <div className="col-span-5">Details</div>
          <div className="col-span-3 text-right">Action</div>
        </div>

        {/* Lucas Transaction Row */}
        {(isPending || isApproved) && (
          <div className={`p-6 grid grid-cols-12 gap-4 items-center bg-white ${isApproved ? 'opacity-60 grayscale-[20%]' : ''}`}>
            
            {/* Requester Info */}
            <div className="col-span-4 flex items-start space-x-3">
              <UserCircle className="w-10 h-10 text-gray-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-900">Stefan (Manager)</p>
                <p className="text-xs text-gray-500">Promote: Lucas</p>
                <p className="text-xs text-gray-400 mt-1">Eff: {state.transaction.effectiveDate}</p>
              </div>
            </div>

            {/* Transaction Details & Core Agent Feature */}
            <div className="col-span-5">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-gray-800">
                  {state.transaction.fromJobCode} → <span className="font-medium text-indigo-700">{state.transaction.toJobCode}</span>
                </span>
                
                {/* Visual highlight of the script's Compliance & Audit Agent */}
                <div className="bg-green-50 border border-green-200 rounded p-2.5 flex items-start space-x-2">
                  <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-green-800">Compliance Screened: 100% Pass</h4>
                    <p className="text-[11px] text-green-700 mt-0.5 leading-tight">
                      No conflicts found. Alignment with French National Labor Agreements verified. SoD intact.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="col-span-3 flex items-center justify-end space-x-2">
              {isPending && (
                <>
                  <button className="p-2 bg-white border border-gray-300 rounded text-gray-600 hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-colors" title="Reject">
                    <X className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={approveHROps}
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded shadow-sm hover:bg-indigo-700 transition-colors"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    Approve
                  </button>
                </>
              )}
              {isApproved && (
                <Badge status="success">Approved</Badge>
              )}
            </div>
          </div>
        )}

        {/* Dummy Row for realism */}
        <div className="p-6 grid grid-cols-12 gap-4 items-center bg-gray-50 border-t border-gray-100">
            <div className="col-span-4 flex items-start space-x-3">
              <UserCircle className="w-10 h-10 text-gray-300 shrink-0" />
              <div>
                <p className="text-sm font-medium text-gray-500">Marie (Director)</p>
                <p className="text-xs text-gray-400">Transfer: Jean-Baptiste</p>
              </div>
            </div>
            <div className="col-span-5">
              <p className="text-sm text-gray-400 italic">Waiting on Manager response</p>
            </div>
            <div className="col-span-3 flex justify-end">
               <Badge status="draft">Pending Info</Badge>
            </div>
        </div>

      </div>
    </div>
  );
}
