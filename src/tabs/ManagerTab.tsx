import React, { useState } from 'react';
import { useDemoState } from '../store/DemoContext';
import { MessageSquare, Sparkles, Send, CheckCircle2, Building, ArrowRight, Activity, RefreshCw } from 'lucide-react';
import Infolet from '../components/ui/Infolet';

export default function ManagerTab() {
  const { state, submitManagerRequest } = useDemoState();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [justification, setJustification] = useState('');
  const [generating, setGenerating] = useState(false);
  const [showCompReview, setShowCompReview] = useState(false);
  
  const isSubmitted = state.transaction.pipelineStatus !== 'draft';

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    // Simulate AI parsing
    setJustification("Lucas did great work on the pathology project and we need him leading the hub");
    setChatMessage('');
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setJustification("Promotion recommended based on exemplary leadership during the regional pathology optimization initiative. Realignment guarantees operational readiness of the Diagnostics Hub.");
    }, 1500);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-220px)]">
      {/* Main Home Page Replica */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        <h1 className="text-2xl font-light text-gray-800">Good morning, Stefan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Infolet title="My Team" value="12" subtext="Direct Reports" color="blue" />
          <Infolet title="Pending Actions" value="3" subtext="Needs your attention" color="amber" />
          <Infolet title="Open Requisitions" value="1" subtext="Regional Hub" color="purple" />
          <Infolet title="Budget Utilization" value="92%" subtext="Q2 2026" color="green" />
        </div>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4 bg-gray-50 flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-800">Quick Actions</h2>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Change Employment Details', 'Promote', 'Transfer', 'Terminate', 'Manage Compensation', 'Add Document', 'Request Feedback', 'Team Learning'].map((action) => (
              <button key={action} className="p-4 text-left border border-gray-200 rounded hover:border-blue-400 hover:shadow-sm transition-all group">
                <span className="text-sm font-medium text-gray-700 group-hover:text-blue-600">{action}</span>
              </button>
            ))}
          </div>
        </section>

        {isSubmitted && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center">
             <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
             <h3 className="text-lg font-medium text-gray-900">Transaction Submitted</h3>
             <p className="text-gray-600 mt-2">Lucas's promotion has been sent to HR Ops for approval.</p>
          </div>
        )}
      </div>

      {/* AI Assist Sidebar Dock */}
      {!chatOpen && (
        <button 
          onClick={() => setChatOpen(true)}
          className="fixed bottom-8 right-8 bg-[#C74634] hover:bg-[#A63A2B] text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Conversational Panel */}
      {chatOpen && !isSubmitted && (
        <div className="w-[400px] h-full flex-shrink-0 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col ml-4">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center text-gray-700 font-medium">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              Oracle HR Assist
            </div>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
            <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 ml-2 max-w-[85%]">
              Hello Stefan. How can I help you manage your team today?
            </div>

            {justification && (
              <>
                <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tr-none shadow-sm text-sm ml-auto max-w-[85%]">
                  Promote Lucas to Senior Lab Manager effective June 15 and increase base pay by 12%
                </div>
                
                <div className="bg-white border border-indigo-100 p-4 rounded-lg shadow-sm text-sm mx-2 mt-2">
                  <div className="font-medium text-gray-900 mb-3 border-b pb-2 flex items-center">
                     Transaction Pending: Lucas 
                  </div>
                  
                  {/* Org Change Visual */}
                  <div className="bg-gray-50 rounded p-3 mb-4 flex items-center justify-between text-xs">
                    <div className="flex-1 text-center">
                      <div className="text-gray-500 mb-1">Current Dept</div>
                      <div className="font-semibold">{state.transaction.fromDept}</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400 mx-2" />
                    <div className="flex-1 text-center">
                      <div className="text-indigo-600 mb-1">New Dept</div>
                      <div className="font-semibold text-indigo-700">{state.transaction.toDept}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Business Justification *</label>
                    <textarea 
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      className="w-full text-sm border-gray-300 rounded-md p-2 border focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                    />
                    <button 
                      onClick={handleGenerate}
                      disabled={generating || justification.includes("exemplary")}
                      className="mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                    >
                      {generating ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                      {generating ? 'Polishing...' : 'Generate Professional Justification'}
                    </button>
                  </div>

                  {!showCompReview ? (
                    <button 
                      onClick={() => setShowCompReview(true)}
                      className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Review Compensation
                    </button>
                  ) : (
                    <div className="mb-4 bg-green-50 border border-green-200 rounded p-4 text-xs">
                      {/* CSS Bell Curve Simulation */}
                      <div className="w-full h-16 relative flex items-end justify-center mb-3 border-b border-green-200 pb-1">
                        <svg className="absolute w-full h-[120%] bottom-1" viewBox="0 0 100 50" preserveAspectRatio="none">
                          <path d="M 0 50 C 20 50 30 10 50 10 C 70 10 80 50 100 50" stroke="#10b981" strokeWidth="2" fill="url(#bellGradient)" />
                          <defs>
                            <linearGradient id="bellGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                            </linearGradient>
                          </defs>
                        </svg>
                        {/* Lucas Maker */}
                        <div className="absolute bottom-1 w-2 h-2 bg-indigo-600 rounded-full" style={{ left: '47%' }}></div>
                        <div className="absolute top-1 text-[10px] text-indigo-700 font-bold bg-white/80 px-1 rounded" style={{ left: '44%' }}>Lucas</div>
                      </div>
                      <div className="flex justify-between text-[10px] text-green-700 mb-3 font-mono">
                        <span>Min (€3.5k)</span>
                        <span>Median (€4.5k)</span>
                        <span>Max (€5.5k)</span>
                      </div>
                      
                      <div className="flex items-center text-green-800 font-semibold mb-2">
                        <CheckCircle2 className="w-4 h-4 mr-1" />
                        Internal Equity Validated
                      </div>
                      <div className="text-green-700 mb-2">Compa-Ratio: {state.transaction.compaRatio}</div>
                      <p className="text-green-600">{state.transaction.equityCheck.note}</p>
                    </div>
                  )}

                  <button 
                    onClick={() => submitManagerRequest("Lucas did great work...", justification)}
                    disabled={!showCompReview || !justification.includes("exemplary")}
                    className="w-full bg-[#C74634] text-white py-2.5 rounded shadow-sm hover:bg-[#A63A2B] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                  >
                    Submit for Approval
                  </button>
                </div>
              </>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
            <form onSubmit={handleChatSubmit} className="relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask HR Assist..."
                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-0 rounded-full pl-4 pr-10 py-2.5 text-sm transition-colors"
                disabled={!!justification}
              />
              <button 
                type="submit" 
                disabled={!!justification || !chatMessage.trim()}
                className="absolute right-2 top-1.5 p-1.5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:bg-gray-400"
              >
                <Send className="w-3 h-3" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
