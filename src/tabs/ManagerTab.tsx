import React, { useState, useEffect, useRef } from 'react';
import { useDemoState } from '../store/DemoContext';
import { MessageSquare, Sparkles, Send, CheckCircle2, Building, ArrowRight, Activity, RefreshCw } from 'lucide-react';
import Infolet from '../components/ui/Infolet';

export default function ManagerTab() {
  const { state, submitManagerRequest } = useDemoState();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  
  // chatStage flow:
  // 0: Start
  // 1: User requested promo. Agent shows org change & asks for justification. User filling justification.
  // 2: Justification provided & polished. User confirms. Agent asks to review comp.
  // 3: User reviewing comp.
  // 4: Comp reviewed. Agent asks to submit. User types confirmation.
  const [chatStage, setChatStage] = useState(0);
  const [initialUserMessage, setInitialUserMessage] = useState('');
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  
  const [justification, setJustification] = useState('');
  const [generating, setGenerating] = useState(false);
  const [isPolished, setIsPolished] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const isSubmitted = state.transaction.pipelineStatus !== 'draft';

  useEffect(() => {
    // Scroll to bottom whenever chatStage or messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatStage, justification, isPolished, isAgentTyping, isSubmitted]);

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    
    if (chatStage === 0) {
      // Initiate promotion
      setInitialUserMessage(chatMessage);
      setChatMessage('');
      setChatStage(0.5);
      setIsAgentTyping(true);
      setTimeout(() => {
        setIsAgentTyping(false);
        setChatStage(1);
      }, 1500);
    } else if (chatStage === 3) {
      // User confirms submission
      setChatStage(3.5);
      setChatMessage('');
      setIsAgentTyping(true);
      setTimeout(() => {
        setIsAgentTyping(false);
        submitManagerRequest("Lucas did great work...", justification);
      }, 1500);
    } else {
      setChatMessage('');
    }
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setJustification("Promotion recommended based on exemplary leadership during the regional pathology optimization initiative. Realignment guarantees operational readiness of the Diagnostics Hub.");
      setIsPolished(true);
    }, 1500);
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-220px)]">
      {/* Main Home Page Replica */}
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
        <h1 className="text-2xl font-light text-gray-800">Good morning, Stefan</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Infolet title="My Team" value="84" subtext="Direct Reports" color="blue" />
          <Infolet title="Pending Actions" value="15" subtext="Needs your attention" color="amber" />
          <Infolet title="Open Requisitions" value="7" subtext="Regional Hub" color="purple" />
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
      {chatOpen && (
        <div className="w-[400px] h-full flex-shrink-0 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col ml-4">
          <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center rounded-t-lg">
            <div className="flex items-center text-gray-700 font-medium">
              <Sparkles className="w-5 h-5 mr-2 text-indigo-500" />
              Oracle HR Assist
            </div>
            <button onClick={() => setChatOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
          </div>

          <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-4">
            <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 ml-2 max-w-[85%]">
              Hello Stefan. How can I help you manage your team today?
            </div>

            {chatStage >= 0.5 && (
              <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tr-none shadow-sm text-sm ml-auto max-w-[85%] mt-2">
                {initialUserMessage || "Promote Lucas to Senior Lab Manager effective June 15 and increase base pay by 12%"}
              </div>
            )}
            
            {chatStage >= 1 && (
              <>
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 ml-2 max-w-[85%] mt-2">
                  <p className="mb-3">I can help with that. Since Lucas is moving roles, his organizational alignment shifts. I've prepared the structure update:</p>
                  
                  {/* Org Change Visual */}
                  <div className="bg-gray-50 border border-gray-100 rounded p-3 mb-3 flex items-center justify-between text-xs">
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

                  <p>Please provide a brief business justification for this out-of-cycle change to ensure standard HR audits are met.</p>
                </div>
                
                {chatStage === 1 && (
                  <div className="bg-white border border-indigo-100 p-4 rounded-lg shadow-sm text-sm mx-2 mt-1">
                    <label className="block text-xs font-medium text-gray-500 mb-2">Business Justification *</label>
                    <textarea 
                      value={justification}
                      onChange={(e) => setJustification(e.target.value)}
                      placeholder="Type a brief justification..."
                      className="w-full text-sm border-gray-300 rounded-md p-2 border focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]"
                    />
                    
                    {!isPolished ? (
                      <button 
                        onClick={handleGenerate}
                        disabled={generating || justification.length < 5}
                        className="mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center disabled:opacity-50"
                      >
                        {generating ? <RefreshCw className="w-3 h-3 mr-1 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                        {generating ? 'Polishing...' : 'Generate Professional version'}
                      </button>
                    ) : (
                      <button 
                        onClick={() => setChatStage(2)}
                        className="mt-4 w-full bg-[#C74634] text-white py-2 rounded shadow-sm hover:bg-[#A63A2B] transition-colors text-sm font-medium"
                      >
                        Confirm Justification
                      </button>
                    )}
                  </div>
                )}
              </>
            )}

            {chatStage >= 2 && (
              <>
                <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tr-none shadow-sm text-sm ml-auto max-w-[85%] mt-2">
                  {justification}
                </div>
                
                <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 ml-2 max-w-[85%] mt-2">
                  <p className="mb-3">Great, I've attached that to the request.</p>
                  <p>Before this goes to corporate compensation, let's run a real-time sanity check on the numbers.</p>
                  
                  {chatStage === 2 && (
                    <button 
                      onClick={() => setChatStage(3)}
                      className="mt-3 w-full bg-white border border-gray-300 text-gray-700 py-2 rounded shadow-sm hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                      Review Compensation
                    </button>
                  )}
                  
                  {chatStage >= 3 && (
                    <div className="mt-3 bg-green-50 border border-green-200 rounded p-4 text-xs">
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
                        {/* Lucas Marker */}
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
                </div>
              </>
            )}

            {chatStage >= 3 && (
               <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-700 ml-2 max-w-[85%] mt-2 mb-2">
                 Everything looks in order. Shall I submit this change for final approval?
               </div>
            )}
            
            {chatStage >= 3.5 && (
               <div className="bg-blue-600 text-white p-3 rounded-lg rounded-tr-none shadow-sm text-sm ml-auto max-w-[85%] mt-2">
                 Yes
               </div>
            )}
            
            {isAgentTyping && (
              <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-gray-500 ml-2 max-w-[85%] mt-2 flex items-center space-x-2 w-fit mb-2">
                <span className="flex space-x-1">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '-0.3s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '-0.15s' }}></span>
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                </span>
                <span className="text-xs">Agent working...</span>
              </div>
            )}
            
            {isSubmitted && (
              <div className="bg-white border border-green-200 p-4 rounded-lg shadow-sm text-sm ml-2 max-w-[85%] mt-2 mb-2 flex flex-col items-start gap-2">
                 <div className="flex items-center text-green-700 font-semibold text-base mb-1">
                   <CheckCircle2 className="w-5 h-5 mr-2" />
                   Transaction Submitted
                 </div>
                 <p className="text-gray-700">Lucas's promotion has been sent to HR Ops for approval. You can track its progress in your dashboard.</p>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-200 rounded-b-lg">
            <form onSubmit={handleChatSubmit} className="relative">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder={
                  chatStage === 0 ? "Ask HR Assist..." : 
                  chatStage === 1 || chatStage === 2 ? "Please continue above..." :
                  chatStage === 3 ? "Type 'yes' to submit..." : ""
                }
                disabled={chatStage === 0.5 || chatStage === 1 || chatStage === 2 || chatStage >= 3.5}
                className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-indigo-300 focus:ring-0 rounded-full pl-4 pr-10 py-2.5 text-sm transition-colors disabled:opacity-60"
              />
              <button 
                type="submit" 
                disabled={chatStage === 0.5 || chatStage === 1 || chatStage === 2 || chatStage >= 3.5 || !chatMessage.trim()}
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
