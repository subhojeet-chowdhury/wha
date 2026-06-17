import React from 'react';

interface InfoletProps {
  title: string;
  value: string | number;
  color?: 'blue' | 'green' | 'amber' | 'red' | 'purple';
  subtext?: string;
}

export default function Infolet({ title, value, color = 'blue', subtext }: InfoletProps) {
  const colorMap = {
    blue: 'border-blue-500 text-blue-600',
    green: 'border-green-500 text-green-600',
    amber: 'border-amber-500 text-amber-600',
    red: 'border-red-500 text-red-600',
    purple: 'border-purple-500 text-purple-600',
  };

  return (
    <div className={`bg-white rounded-md shadow-sm border border-gray-200 border-t-4 p-4 flex flex-col justify-between h-32 ${colorMap[color].split(' ')[0]}`}>
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wide truncate">{title}</h3>
      <div>
        <div className={`text-4xl font-light ${colorMap[color].split(' ')[1]}`}>{value}</div>
        {subtext && <div className="text-xs text-gray-400 mt-1">{subtext}</div>}
      </div>
    </div>
  );
}
