import React, { useState } from 'react';
import { DemoProvider } from './store/DemoContext';
import MainLayout from './components/MainLayout';
import ControlTower from './pages/ControlTower';

export default function App() {
  const [appView, setAppView] = useState<'core' | 'control'>('core');

  return (
    <>
      {/* Absolute top toggle */}
      <div className="fixed top-0 left-0 right-0 h-10 bg-gray-900 text-white flex justify-center items-center z-[100] text-xs font-mono space-x-2">
        <span className="text-gray-400 mr-2">WFA DEMONSTRATION:</span>
        <button 
          onClick={() => setAppView('core')} 
          className={`px-3 py-1 rounded-sm ${appView === 'core' ? 'bg-[#C74634]' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          CORE DEMO
        </button>
        <button 
          onClick={() => setAppView('control')} 
          className={`px-3 py-1 rounded-sm ${appView === 'control' ? 'bg-[#C74634]' : 'bg-gray-800 hover:bg-gray-700'}`}
        >
          EXCEPTION CONTROL TOWER
        </button>
      </div>

      <div className="pt-10 h-screen flex flex-col">
        {appView === 'core' ? (
          <DemoProvider>
            <MainLayout />
          </DemoProvider>
        ) : (
          <ControlTower />
        )}
      </div>
    </>
  );
}
