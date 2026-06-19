import React, { useState } from 'react';
import { Filter, Search, MoreHorizontal, AlertCircle, CheckCircle, Clock, ArrowUpRight, MessageSquare, Plus, FileText, ChevronDown } from 'lucide-react';
import Infolet from '../components/ui/Infolet';

// Mock Data
const EXCEPTION_DATA_INIT = [
  {
    id: 'EX-2026-089',
    empNo: 'EMP-40192',
    name: 'Sarah Jenkins',
    country: 'United Kingdom',
    payPeriod: 'June 2026',
    timestamp: '2026-06-18 08:14:22',
    phase: 'Pre-Payroll Calc',
    description: 'Variance > 10% in Base Pay compared to previous cycle.',
    severity: 'High',
    status: 'New',
    pendingWith: 'Manager',
    aiInsights: {
      summary: 'Base pay increased by 15% without a corresponding promotion or compensation change event in the core HR system.',
      rootCause: 'Manual override detected in time-tracking integration file.',
      recommendation: 'Request manager validation for the override, or revert to standard rate if unauthorized.'
    }
  },
  {
    id: 'EX-2026-092',
    empNo: 'EMP-38821',
    name: 'David Chen',
    country: 'Singapore',
    payPeriod: 'June 2026',
    timestamp: '2026-06-18 09:02:11',
    phase: 'Input-Output Check',
    description: 'Missing bank account details for direct deposit.',
    severity: 'Critical',
    status: 'In Progress',
    pendingWith: 'Employee',
    aiInsights: {
      summary: 'Banking information was recently updated but rejected by the validation gateway.',
      rootCause: 'Invalid routing number format for the specified bank branch.',
      recommendation: 'Notify employee to re-enter banking details with the correct 6-digit routing format.'
    }
  },
  {
    id: 'EX-2026-104',
    empNo: 'EMP-59201',
    name: 'Amelie Laurent',
    country: 'France',
    payPeriod: 'June 2026',
    timestamp: '2026-06-18 10:45:00',
    phase: 'Variance Check',
    description: 'Transport allowance exceeds statutory limit for region.',
    severity: 'Medium',
    status: 'Fixed',
    pendingWith: 'System',
    aiInsights: {
      summary: 'Transport allowance configured at €150, but regional max is €80 for this grade.',
      rootCause: 'Legacy policy code FR_TECH_TR_01 applied instead of updated policy.',
      recommendation: 'Auto-corrected using Oracle Validation Agent to FR_MGR_TR_02 (€80).'
    }
  },
  {
    id: 'EX-2026-105',
    empNo: 'EMP-41002',
    name: 'Michael Ross',
    country: 'United States',
    payPeriod: 'June 2026',
    timestamp: '2026-06-18 11:12:45',
    phase: 'Tax Validation',
    description: 'State tax local jurisdiction code mismatch with home address.',
    severity: 'High',
    status: 'Escalated',
    pendingWith: 'Payroll',
    aiInsights: {
      summary: 'Employee moved to a new state mid-pay period, but tax deductions are entirely calculated on the previous state.',
      rootCause: 'Effective date of address change does not align with the payroll cut-off.',
      recommendation: 'Prorate state tax deductions manually or run the mid-period tax adjustment process.'
    }
  },
  {
    id: 'EX-2026-109',
    empNo: 'EMP-29188',
    name: 'Yuki Tanaka',
    country: 'Japan',
    payPeriod: 'June 2026',
    timestamp: '2026-06-18 13:20:10',
    phase: 'Overtime Check',
    description: 'Overtime hours exceed legal monthly maximum (45h).',
    severity: 'Critical',
    status: 'New',
    pendingWith: 'HR',
    aiInsights: {
      summary: 'Reported overtime is 52 hours. Japanese labor law caps standard overtime at 45 hours without special agreement.',
      rootCause: 'Project delivery milestone caused team-wide excess hours. Special 36 agreement documentation not detected.',
      recommendation: 'Obtain expedited approval for special 36 agreement exception or flag for non-compliance.'
    }
  },
  {
    id: 'EX-2026-112',
    empNo: 'EMP-60334',
    name: 'Elena Rodriguez',
    country: 'Spain',
    payPeriod: 'June 2026',
    timestamp: '2026-06-18 14:05:33',
    phase: 'Input-Output Check',
    description: 'Duplicate bonus entry detected in supplemental run.',
    severity: 'Medium',
    status: 'In Progress',
    pendingWith: 'Manager',
    aiInsights: {
      summary: 'Performance bonus of €2000 was submitted both via the annual compensation cycle and a manual ad-hoc request.',
      rootCause: 'Manager submitted manual form despite automated cycle processing.',
      recommendation: 'Void the manual ad-hoc request and proceed with the automated cycle value.'
    }
  }
];

export default function ControlTower() {
  const [exceptions, setExceptions] = useState(EXCEPTION_DATA_INIT);
  const [selectedPeriod, setSelectedPeriod] = useState('June 2026');
  const [selectedException, setSelectedException] = useState<typeof EXCEPTION_DATA_INIT[0] | null>(null);
  const [filterCountry, setFilterCountry] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal state
  const [commentText, setCommentText] = useState('');
  const [actionHistory, setActionHistory] = useState<{user: string, time: string, comment: string}[]>([]);

  const filteredData = exceptions.filter(item => {
    if (filterCountry !== 'All' && item.country !== filterCountry) return false;
    if (filterStatus !== 'All' && item.status !== filterStatus) return false;
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && !item.empNo.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleActionSubmit = () => {
    if (!commentText.trim()) return;
    setActionHistory([...actionHistory, { user: 'Current User', time: new Date().toLocaleString(), comment: commentText }]);
    setCommentText('');
  };

  const handleResolve = () => {
    if (!selectedException) return;
    
    const comment = commentText.trim() ? `Resolved with note: ${commentText}` : 'Marked as Fixed';
    setActionHistory([...actionHistory, { user: 'Current User', time: new Date().toLocaleString(), comment }]);
    
    setExceptions(prev => prev.map(ex => 
      ex.id === selectedException.id ? { ...ex, status: 'Fixed', pendingWith: '-' } : ex
    ));
    
    setSelectedException({ ...selectedException, status: 'Fixed', pendingWith: '-' });
    setCommentText('');
  };

  const handleEscalate = () => {
    if (!selectedException) return;
    
    const comment = commentText.trim() ? `Escalated to Level 2 with note: ${commentText}` : 'Escalated to Level 2 for further review';
    setActionHistory([...actionHistory, { user: 'Current User', time: new Date().toLocaleString(), comment }]);
    
    setExceptions(prev => prev.map(ex => 
      ex.id === selectedException.id ? { ...ex, status: 'Escalated', pendingWith: 'Level 2 Support' } : ex
    ));
    
    setSelectedException({ ...selectedException, status: 'Escalated', pendingWith: 'Level 2 Support' });
    setCommentText('');
  };

  const openActionModal = (item: typeof EXCEPTION_DATA_INIT[0]) => {
    setSelectedException(item);
    setActionHistory([
      { user: 'System', time: item.timestamp, comment: `Exception generated during ${item.phase}.` }
    ]);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'New': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Fixed': return 'bg-green-100 text-green-800';
      case 'Escalated': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch(severity) {
      case 'Critical': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'High': return <ArrowUpRight className="w-4 h-4 text-orange-500" />;
      case 'Medium': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
  };

  const counts = {
    total: 136 + exceptions.length,
    new: 43 + exceptions.filter(e => e.status === 'New').length,
    inProgress: 36 + exceptions.filter(e => e.status === 'In Progress').length,
    fixed: 50 + exceptions.filter(e => e.status === 'Fixed').length,
    escalated: 7 + exceptions.filter(e => e.status === 'Escalated').length,
  };

  return (
    <div className="flex-1 bg-gray-50 flex flex-col min-h-full">
      {/* Pay Period Banner */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Payroll Exception Control Tower</h1>
          <div className="h-6 w-px bg-gray-300"></div>
          <div className="flex items-center text-sm">
            <span className="text-gray-500 mr-2">Pay Period:</span>
            <div className="relative">
              <select 
                value={selectedPeriod} 
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-gray-100 border border-gray-200 text-gray-700 py-1.5 pl-3 pr-8 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option>June 2026</option>
                <option>May 2026</option>
                <option>April 2026</option>
              </select>
              <ChevronDown className="w-4 h-4 text-gray-500 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
           <button className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
             <FileText className="w-4 h-4 mr-2" />
             Export Report
           </button>
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col max-w-[1400px] mx-auto w-full">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Infolet title="Total Exceptions" value={counts.total.toString()} subtext="Current Cycle" color="purple" />
          <Infolet title="New" value={counts.new.toString()} subtext="Requires Review" color="blue" />
          <Infolet title="In Progress" value={counts.inProgress.toString()} subtext="Under Investigation" color="amber" />
          <Infolet title="Fixed" value={counts.fixed.toString()} subtext="Auto or Manual" color="green" />
          <Infolet title="Escalated" value={counts.escalated.toString()} subtext="Critical Attention" color="red" />
        </div>

        {/* Filters and Table Controls */}
        <div className="bg-white p-4 rounded-t-lg border border-gray-200 border-b-0 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input 
                type="text" 
                placeholder="Search employee..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-64"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select 
                value={filterCountry}
                onChange={(e) => setFilterCountry(e.target.value)}
                className="border border-gray-300 rounded-md text-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Countries</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="United States">United States</option>
                <option value="France">France</option>
                <option value="Singapore">Singapore</option>
                <option value="Japan">Japan</option>
                <option value="Spain">Spain</option>
              </select>

              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-md text-sm py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="All">All Statuses</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Fixed">Fixed</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>
          </div>
          
          <div>
            <button className="text-indigo-600 text-sm font-medium hover:text-indigo-800 flex items-center">
              Clear Filters
            </button>
          </div>
        </div>

        {/* Data Grid */}
        <div className="bg-white border border-gray-200 rounded-b-lg shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3">Exception ID</th>
                  <th className="px-4 py-3">Employee</th>
                  <th className="px-4 py-3">Country</th>
                  <th className="px-4 py-3">Phase</th>
                  <th className="px-4 py-3 max-w-xs truncate">Description</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Pending With</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-indigo-600">{row.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{row.name}</span>
                        <span className="text-xs text-gray-500">{row.empNo}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.country}</td>
                    <td className="px-4 py-3 text-gray-700">{row.phase}</td>
                    <td className="px-4 py-3 text-gray-700 max-w-xs truncate" title={row.description}>
                      {row.description}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-1.5">
                        {getSeverityIcon(row.severity)}
                        <span className="text-gray-700">{row.severity}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{row.pendingWith}</td>
                    <td className="px-4 py-3 text-center">
                      <button 
                        onClick={() => openActionModal(row)}
                        className="bg-white border border-gray-300 text-gray-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-gray-50 transition-colors"
                      >
                        View Action
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                      No exceptions found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between text-sm text-gray-600">
            <div>Showing {filteredData.length} of {exceptions.length} exceptions</div>
            <div className="flex space-x-2">
              <button disabled className="px-3 py-1 border border-gray-300 rounded bg-gray-100 text-gray-400">Previous</button>
              <button className="px-3 py-1 border border-gray-300 rounded bg-white text-gray-700 hover:bg-gray-50">Next</button>
            </div>
          </div>
        </div>
      </div>

      {/* Exception Details Modal */}
      {selectedException && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#F8F9FA] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-left">
            
            {/* Modal Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center space-x-4">
                <div className="bg-indigo-100 text-indigo-700 p-2 rounded-lg">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 leading-tight">Exception Details</h2>
                  <div className="text-sm text-gray-500 flex items-center mt-0.5 space-x-2">
                    <span className="font-medium text-indigo-600">{selectedException.id}</span>
                    <span>•</span>
                    <span>{selectedException.timestamp}</span>
                    <span>•</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getStatusColor(selectedException.status)}`}>
                      {selectedException.status}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedException(null)}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col lg:flex-row gap-6">
              
              {/* Left Column: Data & AI Insights */}
              <div className="flex-1 space-y-6">
                
                {/* Context Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2 mb-3">Context</h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                    <div>
                      <span className="block text-gray-500 text-xs mb-0.5">Employee</span>
                      <span className="font-medium text-gray-900">{selectedException.name} ({selectedException.empNo})</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs mb-0.5">Country / Region</span>
                      <span className="font-medium text-gray-900">{selectedException.country}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs mb-0.5">Audit Phase</span>
                      <span className="font-medium text-gray-900">{selectedException.phase}</span>
                    </div>
                    <div>
                      <span className="block text-gray-500 text-xs mb-0.5">Severity</span>
                      <div className="flex items-center space-x-1.5">
                        {getSeverityIcon(selectedException.severity)}
                        <span className="font-medium text-gray-900">{selectedException.severity}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Insights Card */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 shadow-sm p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <AlertCircle className="w-24 h-24" />
                  </div>
                  <div className="flex items-center space-x-2 mb-4 relative z-10">
                    <div className="bg-indigo-600 p-1.5 rounded-md">
                      <AlertCircle className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="text-base font-semibold text-indigo-900">Oracle AI Insights</h3>
                  </div>
                  
                  <div className="space-y-4 relative z-10 text-sm">
                    <div>
                      <div className="font-medium text-indigo-900 mb-1">Issue Summary</div>
                      <p className="text-indigo-800">{selectedException.aiInsights.summary}</p>
                    </div>
                    <div className="bg-white/60 p-3 rounded border border-indigo-100/50">
                      <div className="font-medium text-indigo-900 mb-1 flex items-center">
                        <Search className="w-3.5 h-3.5 mr-1" /> Likely Root Cause
                      </div>
                      <p className="text-indigo-800">{selectedException.aiInsights.rootCause}</p>
                    </div>
                    <div>
                      <div className="font-medium text-indigo-900 mb-1 flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Recommended Resolution
                      </div>
                      <p className="text-indigo-800">{selectedException.aiInsights.recommendation}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Collaboration & Action */}
              <div className="w-full lg:w-80 flex flex-col space-y-4">
                
                {/* Action History */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 flex-1 flex flex-col min-h-[250px]">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-2 mb-3 flex items-center justify-between">
                    <span>Audit Trail</span>
                  </h3>
                  
                  <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                    {actionHistory.map((item, idx) => (
                      <div key={idx} className="relative pl-4 border-l-2 border-gray-200">
                        <div className="absolute w-2 h-2 bg-gray-300 rounded-full -left-[5px] top-1.5"></div>
                        <div className="text-xs text-gray-500 font-medium mb-0.5">{item.user} • {item.time}</div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-2 rounded border border-gray-100">{item.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Entry */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 shrink-0">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Take Action</h3>
                  <textarea 
                    placeholder="Add notes or resolution details..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="w-full text-sm border-gray-300 rounded-md p-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 border min-h-[80px] mb-3 resize-none"
                  />
                  <div className="flex flex-col space-y-2">
                    <div className="flex space-x-2">
                      <button onClick={handleActionSubmit} className="flex-1 bg-white border border-gray-300 text-gray-700 py-1.5 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors">
                        Add Note
                      </button>
                      <button onClick={handleResolve} disabled={selectedException.status === 'Fixed'} className="flex-1 bg-indigo-600 text-white py-1.5 rounded-md text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        Resolve
                      </button>
                    </div>
                    <button onClick={handleEscalate} disabled={selectedException.status === 'Escalated'} className="w-full bg-white border border-red-200 text-red-600 py-1.5 rounded-md text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                      <AlertCircle className="w-4 h-4 mr-1.5" />
                      Escalate to Level 2
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
