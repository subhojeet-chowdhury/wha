import React from 'react';
import { DemoProvider } from './store/DemoContext';
import MainLayout from './components/MainLayout';

export default function App() {
  return (
    <DemoProvider>
      <MainLayout />
    </DemoProvider>
  );
}
