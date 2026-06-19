import React, { useState } from 'react';
import { useDemoState } from '../store/DemoContext';
import { PartyPopper, CheckCircle2, ChevronRight, MessageCircle, ArrowLeft, Send, Sparkles } from 'lucide-react';

export default function EmployeeTab() {
  const { state, signEmployeeLetter, askPaySimulator } = useDemoState();
  const [view, setView] = useState<'dashboard' | 'letter' | 'chat'>('dashboard');
  const [chatInput, setChatInput] = useState('');

  const { pipelineStatus } = state.transaction;
  const isReady = ['transmitted', 'confirmed', 'employee_notified', 'signed'].includes(pipelineStatus);
  const isSigned = pipelineStatus === 'signed';

  // Mobile Frame styling
  const PhoneFrame = ({ children, headerTitle }: { children: React.ReactNode, headerTitle: string }) => (
    <div className="flex justify-center py-8 bg-gray-100 min-h-screen">
      <div className="w-[375px] h-[650px] bg-white rounded-[3rem] shadow-2xl border-[8px] border-gray-900 overflow-hidden relative flex flex-col">
        {/* iOS Notch Area */}
        <div className="h-7 w-full bg-black absolute top-0 left-0 right-0 z-50 flex justify-center rounded-b-xl px-4">
           <div className="w-1/3 h-full bg-black rounded-b-3xl"></div>
        </div>
        
        {/* App Header */}
        <div className="bg-[#C74634] text-white pt-12 pb-4 px-4 flex items-center justify-between shadow-sm relative z-40">
          {view !== 'dashboard' ? (
             <button onClick={() => setView('dashboard')} className="p-1"><ArrowLeft className="w-5 h-5" /></button>
          ) : <div className="w-7"></div>}
          <div className="font-semibold text-center flex-1 tracking-wide">{headerTitle}</div>
          <div className="w-7"></div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 flex flex-col relative pb-8">
          {children}
        </div>

        {/* Bottom Home Indicator */}
        <div className="h-1 bg-black w-1/3 absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-50"></div>
      </div>
    </div>
  );

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <SmartphoneOff className="w-16 h-16 mb-4 text-gray-300" />
        <p className="max-w-md text-center">Lucas's mobile app is currently quiet. Awaiting downstream transmission from the payroll interface to trigger notifications.</p>
      </div>
    );
  }

  // View: Document Signer
  if (view === 'letter') {
    return (
      <PhoneFrame headerTitle="Sign Document">
        <div className="p-5">
           <div className="bg-white border text-center border-gray-200 rounded-lg p-6 shadow-sm mb-6 flex flex-col items-center">
             <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4 text-red-600 font-bold text-xl">
               U
             </div>
             <h2 className="text-lg font-bold mb-1">Contract Amendment</h2>
             <p className="text-xs text-gray-500 mb-6">Generated automatically</p>
             
             <div className="text-left w-full text-xs text-gray-700 space-y-4 font-serif leading-relaxed">
               <p><strong>Employee:</strong> {state.transaction.employee}</p>
               <p><strong>Effective Date:</strong> {state.transaction.effectiveDate}</p>
               <p>It is hereby agreed that the employee will be promoted to the position of <strong>{state.transaction.toJobCode}</strong>.</p>
               <p>The revised monthly compensation shall be <strong>€{state.transaction.newBaseSalaryMonthly.toFixed(2)}</strong>.</p>
               <p className="pt-4 border-t border-gray-100 mt-4 italic text-gray-400">All other terms of the original employment agreement remain in full effect.</p>
             </div>
           </div>

           {!isSigned ? (
             <button 
               onClick={() => {
                 signEmployeeLetter();
                 setView('dashboard');
               }}
               className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3.5 rounded-xl font-medium shadow-md transition-all active:scale-95"
             >
               Tap to E-Sign
             </button>
           ) : (
             <div className="w-full bg-green-100 text-green-800 py-3 rounded-xl font-medium flex justify-center items-center">
               <CheckCircle2 className="w-5 h-5 mr-2" /> Signed & Filed
             </div>
           )}
        </div>
      </PhoneFrame>
    );
  }

  // View: Pay Assistant Chat
  if (view === 'chat') {
    return (
      <PhoneFrame headerTitle="Pay Assistant">
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
           {/* Welcome message */}
           <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-3 max-w-[85%] shadow-sm ml-2">
             <div className="text-xs font-semibold text-indigo-600 mb-1 flex items-center">
               <Sparkles className="w-3 h-3 mr-1" /> Oracle Pay Agent
             </div>
             <p className="text-sm text-gray-800">Hi Lucas! I can help you understand how your recent promotion to {state.transaction.toJobCode} affects your upcoming June payslip.</p>
           </div>

           {/* Dynamic Messages */}
           {state.employeeComms.paySimulatorResponses.map((res, i) => (
             <React.Fragment key={i}>
                <div className="bg-indigo-600 text-white p-3 rounded-2xl rounded-tr-none shadow-sm max-w-[85%] ml-auto text-sm">
                  {res.question}
                </div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none p-4 max-w-[90%] shadow-sm ml-2">
                   <div className="text-xs font-semibold text-indigo-600 mb-2 flex items-center">
                     <Sparkles className="w-3 h-3 mr-1" /> Oracle Pay Agent
                   </div>
                   <p className="text-sm text-gray-800 leading-relaxed mb-4">{res.answer}</p>
                   
                   {/* Interactive Projection Card inside Chat */}
                   <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                     <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
                       <span className="text-xs font-semibold">Projected Gross</span>
                       <span className="text-sm font-bold text-green-600">€{state.transaction.proration.proratedGross.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                       <span>Est. Social Taxes</span>
                       <span>- €980.00</span>
                     </div>
                     <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                       <span>Adjusted Allowance</span>
                       <span>+ €120.00</span>
                     </div>
                     <div className="flex justify-between items-center text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                       <span>Estimated Net</span>
                       <span>€3,608.80</span>
                     </div>
                   </div>
                </div>
             </React.Fragment>
           ))}
        </div>
        
        <div className="p-3 bg-white border-t border-gray-200 sticky bottom-0 z-50">
           <form onSubmit={(e) => { e.preventDefault(); if (chatInput) { askPaySimulator(chatInput); setChatInput(''); } }} className="relative flex items-center bg-gray-100 rounded-full pr-1">
             <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Ask about your pay..." className="flex-1 bg-transparent border-0 focus:ring-0 text-sm py-3 px-4" />
             <button type="submit" disabled={!chatInput} className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center disabled:opacity-50 shrink-0">
               <Send className="w-4 h-4 ml-0.5" />
             </button>
           </form>
        </div>
      </PhoneFrame>
    );
  }

  // Default View: Dashboard
  return (
    <PhoneFrame headerTitle="Connection Hub">
      {/* Dynamic Celebration Banner */}
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white p-5 shadow-inner">
        <PartyPopper className="w-8 h-8 mb-2 opacity-90" />
        <h2 className="text-xl font-bold mb-1">Congratulations, Lucas!</h2>
        <p className="text-sm opacity-90 leading-snug">Your promotion to Senior Lab Manager is official. Review your onboarding steps below.</p>
      </div>

      <div className="p-4 pt-6">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">Guided Journey</h3>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6">
          <button 
            onClick={() => setView('letter')}
            className={`w-full p-4 flex items-center justify-between border-b border-gray-100 last:border-0 hover:bg-gray-50 active:bg-gray-100 transition-colors ${isSigned ? 'opacity-75' : ''}`}
          >
            <div className="flex items-center">
               <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${isSigned ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                 {isSigned ? <CheckCircle2 className="w-5 h-5" /> : <div className="font-bold text-sm">1</div>}
               </div>
               <div className="text-left">
                 <div className={`font-semibold text-gray-900 ${isSigned ? 'line-through opacity-70' : ''}`}>Sign Amendment Letter</div>
                 <div className="text-xs text-gray-500">{isSigned ? 'Completed' : 'Requires electronic signature'}</div>
               </div>
            </div>
            {!isSigned && <ChevronRight className="w-5 h-5 text-gray-400" />}
          </button>
          
          <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 active:bg-gray-100 transition-colors">
            <div className="flex items-center">
               <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 text-gray-500 font-bold text-sm mr-3">2</div>
               <div className="text-left">
                 <div className="font-semibold text-gray-900">Review New Org Structure</div>
                 <div className="text-xs text-gray-500">Meet your new team</div>
               </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Pay Assistant Entry Point */}
        <button 
          onClick={() => {
            if (state.employeeComms.paySimulatorResponses.length === 0) {
              setChatInput("Show me my pay impact for June");
            }
            setView('chat');
          }}
          className="w-full bg-indigo-600 text-white rounded-2xl p-4 flex items-center justify-between shadow-md active:scale-[0.98] transition-transform"
        >
          <div className="flex items-center text-left">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-sm">Pay Assistant</div>
              <div className="text-xs text-indigo-100 mt-0.5">Model your net take-home pay</div>
            </div>
          </div>
          <Sparkles className="w-5 h-5 text-indigo-200" />
        </button>
      </div>
    </PhoneFrame>
  );
}

// Quick fallback for icon if omitted
const SmartphoneOff = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="2" x2="16" y2="2"></line>
    <line x1="8" y1="22" x2="16" y2="22"></line>
    <line x1="1" y1="1" x2="23" y2="23"></line>
    <path d="M12 22h-1a2 2 0 0 1-2-2v-3.5"></path>
    <path d="M16 17v3a2 2 0 0 1-2 2"></path>
    <path d="M20 20.5V7a2 2 0 0 0-2-2h-3.5"></path>
    <path d="M9 2H6a2 2 0 0 0-2 2v9.5"></path>
  </svg>
)
