import React from 'react';
import { useDemoState } from '../store/DemoContext';
import Infolet from '../components/ui/Infolet';
import { format } from 'date-fns';

export default function AuditTab() {
  const { state } = useDemoState();

  return (
    <div className="py-6">
      <h1 className="text-2xl font-light text-gray-800 mb-6">Audit & Compliance Dashboard</h1>

      {/* KPIs using Infolets */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Infolet 
          title="Changes Pending" 
          value={state.kpis.changesPending} 
          subtext="In open pipeline"
          color="amber" 
        />
        <Infolet 
          title="Changes Rejected" 
          value={state.kpis.changesRejected} 
          subtext="-0% month over month"
          color="red" 
        />
        <Infolet 
          title="Past Cut-Off" 
          value={state.kpis.changesPastCutoff} 
          subtext="Synthesized autonomously"
          color="blue" 
        />
        <Infolet 
          title="SoD Checks Passed" 
          value={state.kpis.sodChecksPassed} 
          subtext="100% compliance rate"
          color="green" 
        />
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
          <h2 className="text-lg font-medium text-gray-800">Live Transaction Log</h2>
          <span className="text-xs text-gray-500 font-mono">APPEND_ONLY_AUDIT_TRAIL</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {state.auditLog.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-gray-500">
                    No transactions recorded yet. Begin the scenario in the Manager tab.
                  </td>
                </tr>
              ) : (
                state.auditLog.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono">
                      {format(new Date(log.timestamp), "MMM dd, yyyy HH:mm:ss")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {log.actor}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {log.action}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate" title={log.detail}>
                      {log.detail}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
