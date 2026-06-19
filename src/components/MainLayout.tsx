import React from 'react';
import { useDemoState } from '../store/DemoContext';
import { Bell, Search, User } from 'lucide-react';
import StatusStrip from './layout/StatusStrip';
import DemoController from './layout/DemoController';
import ManagerTab from '../tabs/ManagerTab';
import HROpsTab from '../tabs/HROpsTab';
import CompTab from '../tabs/CompTab';
import PayrollTab from '../tabs/PayrollTab';
import EmployeeTab from '../tabs/EmployeeTab';
import AuditTab from '../tabs/AuditTab';
import RoadmapTab from '../tabs/RoadmapTab';

const tabs = [
  { id: 'stefan', label: 'Stefan (Manager)' },
  { id: 'marcus', label: 'Marcus (HR Ops)' },
  { id: 'elena', label: 'Elena (Comp)' },
  { id: 'fiona', label: 'Fiona (Payroll)' },
  { id: 'lucas', label: 'Lucas (Employee)' },
  { id: 'audit', label: 'Audit & KPIs' },
  { id: 'roadmap', label: 'Transition Roadmap' },
];

export default function App() {
  const { state, setTab } = useDemoState();

  const renderTab = () => {
    switch (state.currentTab) {
      case 'stefan': return <ManagerTab />;
      case 'marcus': return <HROpsTab />;
      case 'elena': return <CompTab />;
      case 'fiona': return <PayrollTab />;
      case 'lucas': return <EmployeeTab />;
      case 'audit': return <AuditTab />;
      case 'roadmap': return <RoadmapTab />;
      default: return <ManagerTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3] font-sans flex flex-col pt-14">
      {/* Oracle App Bar - Fixed */}
      <header className="fixed top-10 left-0 right-0 h-14 bg-[#C74634] text-white flex items-center justify-between px-6 z-50 shadow-md">
        <div className="flex items-center space-x-8">
          <div className="font-bold tracking-widest text-xl bg-clip-text">ORACLE</div>
          <div className="hidden md:flex items-center bg-white/10 rounded-md px-3 py-1.5 focus-within:bg-white/20 transition-colors w-64">
            <Search className="w-4 h-4 mr-2 opacity-70" />
            <input type="text" placeholder="Search..." className="bg-transparent text-sm text-white placeholder-white/70 outline-none w-full" />
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <DemoController />
          <button className="relative hover:bg-white/10 p-2 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full border-2 border-[#C74634]"></span>
          </button>
          <button className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30 truncate">
            <User className="w-5 h-5 opacity-80" />
          </button>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-24 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 sm:space-x-4 overflow-x-auto overflow-y-hidden scrollbar-hide py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTab(tab.id)}
                className={`whitespace-nowrap py-3 px-4 text-sm font-medium transition-colors border-b-2 ${
                  state.currentTab === tab.id
                    ? 'border-[#C74634] text-[#C74634]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <StatusStrip />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 relative">
        {renderTab()}
      </main>
    </div>
  );
}
