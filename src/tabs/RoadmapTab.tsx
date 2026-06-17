import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function RoadmapTab() {
  const roadmapData = [
    {
      domain: "Job Architecture & Data Quality",
      transition: [
        "Data Clean-Up: Deploy Oracle Data Quality Agents to scan legacy local instances.",
        "Harmonize mismatched Job Codes across European laboratories into a standardized global framework.",
        "Purge overlapping historical effective-dated records that contain conflicting dates."
      ],
      steady: [
        "Complete Standardization: Any newly created role automatically maps to the unified Global Job Architecture.",
        "Strict structural enforcement guarantees zero localized data drift or ad-hoc code creation."
      ]
    },
    {
      domain: "Payroll Integration & Mapping",
      transition: [
        "Configuration: Construct precise data mapping matrices within the Oracle Global Payroll Interface (GPI) for each local country bureau.",
        "Test end-to-end processing across 3 parallel historical payroll cycles to validate data structure integrity."
      ],
      steady: [
        "Fully automated data syndication.",
        "The Oracle Payroll Validation Agent actively runs in real-time to intercept and self-correct transactional localized errors before external file delivery."
      ]
    },
    {
      domain: "AI Agent Calibration",
      transition: [
        "Shadow Mode Execution: Activate Oracle AI Agents in the background to observe human operational handling.",
        "Refine anomaly detection thresholds and train conversational models on localized Unilabs policy documentation."
      ],
      steady: [
        "Autonomous Copilot Mode: AI Agents act as primary operational shields, managing 92% of standard validation checks, and routing only highly complex outliers to human specialists."
      ]
    },
    {
      domain: "Change Management & Process Cut-Offs",
      transition: [
        "Strict Enforcement Training: Train line managers on the operational impacts of mid-month entries.",
        "Define corporate-wide harmonized payroll cut-off governance rules and lock communication cadences."
      ],
      steady: [
        "Seamless Operations: Mid-month and late entries flow naturally through automated proration routines. The system eliminates manual calculation errors and late penalty fees completely."
      ]
    }
  ];

  return (
    <div className="py-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-light text-gray-900 mb-2">Transition Blueprint</h1>
        <p className="text-gray-600">
          How we move from the current fragmented operational reality to this unified, Agentic AI-driven future state.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-800 text-white text-sm font-semibold tracking-wider uppercase">
          <div className="col-span-3 p-4 border-r border-gray-700">Operational Domain</div>
          <div className="col-span-4 p-4 border-r border-gray-700">Transition Phase (Months 1-6)</div>
          <div className="col-span-5 p-4 bg-indigo-900/50">Steady-State Operations (Go-Live +)</div>
        </div>

        {roadmapData.map((row, idx) => (
          <div key={idx} className="grid grid-cols-12 border-t border-gray-200">
            <div className="col-span-3 p-5 bg-gray-50 border-r border-gray-200 font-medium text-gray-900 flex items-center">
              {row.domain}
            </div>
            
            <div className="col-span-4 p-5 border-r border-gray-200">
              <ul className="space-y-3">
                {row.transition.map((item, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-2 shrink-0"></span>
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="col-span-5 p-5 bg-indigo-50/30">
              <ul className="space-y-3">
                {row.steady.map((item, i) => (
                  <li key={i} className="text-sm text-gray-800 flex items-start">
                    <ArrowRight className="w-4 h-4 text-indigo-500 mr-2 shrink-0 mt-0.5" />
                    <span className="leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
