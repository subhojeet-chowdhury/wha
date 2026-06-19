import React, { useState, useEffect } from 'react';
import { useDemoState } from '../store/DemoContext';
import { AlertTriangle, Server, ArrowRightLeft, UploadCloud, CheckCircle, Calculator } from 'lucide-react';
import Badge from '../components/ui/Badge';

export default function PayrollTab() {
  const { state, resolveProrationException, resolveTransportException, transmitPayroll } = useDemoState();
  const [showProrationModal, setShowProrationModal] = useState(false);
  const [transmitting, setTransmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const { pipelineStatus, proration, transportCodeException } = state.transaction;

  const isFlagged = ['comp_approved', 'payroll_exception_flagged', 'exception_proration_resolved', 'exception_transport_resolved'].includes(pipelineStatus);
  const prorationResolved = ['exception_proration_resolved', 'exception_transport_resolved', 'transmitted', 'confirmed', 'employee_notified', 'signed'].includes(pipelineStatus);
  const transportResolved = ['exception_transport_resolved', 'transmitted', 'confirmed', 'employee_notified', 'signed'].includes(pipelineStatus);
  const isTransmitted = ['transmitted', 'confirmed', 'employee_notified', 'signed'].includes(pipelineStatus);

  useEffect(() => {
    // If we transition to comp_approved, auto flip to payroll_exception_flagged mentally for the demo step logic
    // We handle it gracefully in the UI.
  }, [pipelineStatus]);

  const handleTransmit = () => {
    setTransmitting(true);
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setTransmitting(false);
          transmitPayroll();
        }, 500);
      }
    }, 150);
  };

  const handleAcceptCalculation = () => {
    setShowProrationModal(false);
    resolveProrationException();
  };

  if (!isFlagged && !isTransmitted) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <Server className="w-12 h-12 mb-4 text-gray-300" />
        <p>Waiting for upstream HR and Comp approvals before pre-payroll generation.</p>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-light text-gray-800">Global Payroll Interface (GPI)</h1>
        {!isTransmitted && (
          <button 
            disabled={!prorationResolved || !transportResolved || transmitting}
            onClick={handleTransmit}
            className="flex items-center px-4 py-2 bg-[#C74634] text-white rounded font-medium shadow hover:bg-[#A63A2B] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {transmitting ? (
              <>Sending {progress}%...</>
            ) : (
              <><UploadCloud className="w-4 h-4 mr-2" /> Execute Transmission</>
            )}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Readiness Meter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center">
          <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wide mb-4">Transmission Readiness</h2>
          <div className="relative w-32 h-32 flex items-center justify-center">
             <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#f3f4f6" strokeWidth="8" fill="none" />
                <circle cx="50" cy="50" r="40" stroke={isTransmitted || (prorationResolved && transportResolved) ? "#10b981" : "#f59e0b"} strokeWidth="8" fill="none" strokeDasharray={`${isTransmitted || (prorationResolved && transportResolved) ? 100 : 98} 100`} pathLength="100" />
             </svg>
             <div className="absolute flex flex-col items-center">
               <span className="text-3xl font-light text-gray-800">{isTransmitted || (prorationResolved && transportResolved) ? '100' : '98'}%</span>
               <span className="text-xs text-gray-500">Health</span>
             </div>
          </div>
        </div>

        {/* Transmission Log / Current Status */}
        <div className="md:col-span-2 bg-gray-900 rounded-lg shadow-sm border border-gray-800 p-6 text-gray-300 font-mono text-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] uppercase font-bold px-3 py-1 rounded-bl-lg tracking-wider">GPI Terminal</div>
           <p className="text-green-400">► INITIALIZING PRE-PAYROLL AUDIT RUN...</p>
           <p>► Scanning 1,245 active records for FR_VENDOR_01 schema compatibility.</p>
           {!prorationResolved && (
             <p className="text-amber-400 mt-2">► WARN: Late Mid-Month Change Detected. Record: Lucas (ID: 9482).</p>
           )}
           {prorationResolved && !transportResolved && (
             <p className="text-amber-400 mt-2">► WARN: Local allowance mapping conflict detected. Record: Lucas (ID: 9482).</p>
           )}
           {prorationResolved && transportResolved && !isTransmitted && !transmitting && (
             <p className="text-blue-400 mt-2">► Validation Complete. 1,245 records ready for SFTP transmission.</p>
           )}
           {transmitting && (
             <p className="text-indigo-400 mt-2 animate-pulse">► Encrypting outbound packet and initiating secure handshake... {progress}%</p>
           )}
           {isTransmitted && (
             <div className="mt-4 pt-4 border-t border-gray-700">
               <p className="text-green-400 font-bold">► Transmission Successful.</p>
               <p className="text-white">Local Vendor Receipt Confirmed.</p>
               <ul className="mt-2 text-gray-400 list-disc list-inside">
                 <li>0 Failures</li>
                 <li>1 Complex Proration Synthesized</li>
               </ul>
             </div>
           )}
        </div>
      </div>

      {!isTransmitted && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-800">Exceptions Queue</h2>
            <Badge status={prorationResolved && transportResolved ? 'success' : 'review'}>
              {prorationResolved && transportResolved ? 'All Resolved' : 'Action Required'}
            </Badge>
          </div>
          
          <div className="p-0">
            {/* Proration Exception Line */}
            <div className={`p-4 border-b border-gray-100 flex items-center justify-between transition-colors ${!prorationResolved ? 'bg-amber-50/50 hover:bg-amber-50' : 'bg-gray-50'}`}>
              <div className="flex items-center space-x-3">
                <AlertTriangle className={`w-5 h-5 ${!prorationResolved ? 'text-amber-500' : 'text-gray-400'}`} />
                <div>
                  <h4 className={`text-sm font-semibold ${!prorationResolved ? 'text-amber-900' : 'text-gray-600'}`}>Late Mid-Month Change (Proration Required)</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Lucas changed rate mid-cycle. Validation Agent identified period split.</p>
                </div>
              </div>
              <div>
                {!prorationResolved ? (
                  <button onClick={() => setShowProrationModal(true)} className="px-3 py-1.5 bg-white border border-amber-300 text-amber-700 hover:bg-amber-50 text-xs font-medium rounded shadow-sm">
                    Review Calculation
                  </button>
                ) : (
                  <Badge status="success"><CheckCircle className="w-3 h-3 mr-1" /> Synthesized</Badge>
                )}
              </div>
            </div>

            {/* Transport Exception Line - only visible after proration is reviewed for linear demo flow, or simultaneous */}
            {prorationResolved && (
              <div className={`p-4 flex items-center justify-between transition-colors ${!transportResolved ? 'bg-amber-50/50 hover:bg-amber-50' : 'bg-gray-50'}`}>
                <div className="flex items-center space-x-3">
                  <ArrowRightLeft className={`w-5 h-5 ${!transportResolved ? 'text-amber-500' : 'text-gray-400'}`} />
                  <div>
                    <h4 className={`text-sm font-semibold ${!transportResolved ? 'text-amber-900' : 'text-gray-600'}`}>Cross-System Schema Conflict</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Transport allowance '{transportCodeException.oldCode}' invalid for Grade 7. Requires update.</p>
                  </div>
                </div>
                {!transportResolved ? (
                  <div className="flex items-center space-x-4">
                    <div className="hidden md:flex text-xs items-center space-x-2 bg-white px-2 py-1 rounded border border-gray-200">
                      <span className="text-red-500 line-through">{transportCodeException.oldCode}</span>
                      <span>→</span>
                      <span className="text-green-600 font-medium">{transportCodeException.newCode}</span>
                    </div>
                    <button onClick={resolveTransportException} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-medium rounded shadow-sm">
                      Auto-Align Code
                    </button>
                  </div>
                ) : (
                  <Badge status="success"><CheckCircle className="w-3 h-3 mr-1" /> Aligned</Badge>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Proration Modal */}
      {showProrationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
              <Calculator className="w-10 h-10 mx-auto mb-3 opacity-90" />
              <h2 className="text-xl font-bold">Proration Mathematical Logic</h2>
              <p className="text-blue-100 text-sm mt-1">Autonomous Calculation Engine</p>
            </div>
            
            <div className="p-6">
              <div className="space-y-4 font-mono text-sm">
                <div className="bg-gray-50 border border-gray-200 rounded p-4 flex justify-between items-center">
                  <span className="text-gray-600">Block 1: Legacy Rate ({proration.oldRateDays} days)</span>
                  <span className="font-medium text-gray-800">14/30 × €4,200</span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded p-4 flex justify-between items-center">
                  <span className="text-indigo-600">Block 2: New Rate ({proration.newRateDays} days)</span>
                  <span className="font-medium text-indigo-800">16/30 × €4,704</span>
                </div>
                <div className="border-t-2 border-dashed border-gray-300 pt-4 flex justify-between items-center text-lg">
                  <span className="font-bold text-gray-900">Calculated Gross</span>
                  <span className="font-bold text-green-600">€{proration.proratedGross.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 flex gap-3">
                <button onClick={() => setShowProrationModal(false)} className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200">
                  Close Review
                </button>
                <button onClick={handleAcceptCalculation} className="flex-2 px-4 py-2 bg-blue-600 text-white rounded font-medium shadow-sm hover:bg-blue-700">
                  Accept AI Calculation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
