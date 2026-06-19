import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { DemoState, PipelineStatus, AuditLogEntry } from '../types';

interface DemoContextType {
  state: DemoState;
  setTab: (tabId: string) => void;
  submitManagerRequest: (roughText: string, polishedText: string) => void;
  approveHROps: () => void;
  approveComp: () => void;
  resolveProrationException: () => void;
  resolveTransportException: () => void;
  transmitPayroll: () => void;
  signEmployeeLetter: () => void;
  askPaySimulator: (question: string) => void;
  resetDemo: () => void;
}

const OLD_RATE = 4200;
const NEW_RATE = 4704; // +12%
const BASE_MONTH_DAYS = 30;
const OLD_DAYS = 14; // June 1-14
const NEW_DAYS = 16; // June 15-30
const PRORATED_GROSS = (OLD_DAYS / BASE_MONTH_DAYS) * OLD_RATE + (NEW_DAYS / BASE_MONTH_DAYS) * NEW_RATE; // 1960 + 2508.8 = 4468.80

const initialState: DemoState = {
  currentTab: 'stefan',
  transaction: {
    employee: 'Lucas',
    fromJobCode: 'Laboratory Technician',
    toJobCode: 'Senior Lab Manager',
    fromDept: 'Clinical Operations',
    toDept: 'Regional Diagnostics Hub',
    fromGrade: 'Grade 5',
    toGrade: 'Grade 7',
    effectiveDate: '2026-06-15',
    submittedDate: '2026-06-24',
    payrollCutoff: '2026-06-26T23:59:59Z',
    oldBaseSalaryMonthly: OLD_RATE,
    newBaseSalaryMonthly: NEW_RATE,
    compaRatio: 0.94,
    justification: { rough: '', polished: '' },
    equityCheck: {
      status: 'validated',
      note: 'Salary is within the median range for Grade 7 in France. Budget funding confirmed.'
    },
    proration: {
      oldRateDays: OLD_DAYS,
      oldRateAmount: OLD_RATE,
      newRateDays: NEW_DAYS,
      newRateAmount: NEW_RATE,
      proratedGross: PRORATED_GROSS
    },
    transportCodeException: {
      detected: true,
      oldCode: 'FR_TECH_TR_01',
      newCode: 'FR_MGR_TR_02',
      resolved: false
    },
    pipelineStatus: 'draft',
    vendorTransmission: {
      sentAt: null,
      fileCount: 0,
      failures: 0,
      complexProrations: 0
    }
  },
  approvals: {
    hrOps: { 
      status: 'pending', 
      approvedBy: 'Marcus', 
      timestamp: null, 
      complianceBadge: { sodPass: true, laborAgreementCheck: "Syntec Collective Labor Agreement", result: "100% Pass" } 
    },
    comp: { status: 'pending', approvedBy: 'Elena', timestamp: null }
  },
  auditLog: [],
  kpis: {
    changesPending: 156,
    changesRejected: 12,
    changesPastCutoff: 3,
    sodChecksPassed: 893
  },
  employeeComms: {
    letterGenerated: false,
    letterSignedByLucas: false,
    paySimulatorResponses: []
  }
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export const DemoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<DemoState>(initialState);

  const setTab = (tabId: string) => {
    setState(prev => ({ ...prev, currentTab: tabId }));
  };

  const logAction = (actor: string, action: string, detail: string) => {
    const newEntry: AuditLogEntry = {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toISOString(), // In reality we'd use simulated time, but this logs relative order
      actor,
      action,
      detail
    };
    setState(prev => ({ ...prev, auditLog: [newEntry, ...prev.auditLog] }));
  };

  const submitManagerRequest = (rough: string, polished: string) => {
    setState(prev => ({
      ...prev,
      transaction: { 
        ...prev.transaction, 
        justification: { rough, polished },
        pipelineStatus: 'submitted' 
      }
    }));
    logAction('Stefan', 'Transaction Initiated', `Promoted Lucas to Senior Lab Manager effective ${initialState.transaction.effectiveDate}`);
  };

  const approveHROps = () => {
    setState(prev => ({
      ...prev,
      transaction: { ...prev.transaction, pipelineStatus: 'hr_ops_approved' },
      approvals: { ...prev.approvals, hrOps: { ...prev.approvals.hrOps, status: 'approved', timestamp: new Date().toISOString() } }
    }));
    logAction('Marcus', 'HR Ops Approval', 'Compliance check passed automatically. Segregation of duties intact.');
  };

  const approveComp = () => {
    setState(prev => ({
      ...prev,
      transaction: { ...prev.transaction, pipelineStatus: 'comp_approved' },
      approvals: { ...prev.approvals, comp: { ...prev.approvals.comp, status: 'approved', timestamp: new Date().toISOString() } },
      kpis: { ...prev.kpis, changesPending: 0 }
    }));
    logAction('Elena', 'Compensation Approval', 'Approved 12% increase. Budget funding surplus confirmed via Comp Agent.');
  };

  const resolveProrationException = () => {
    setState(prev => {
      const nextStatus = prev.transaction.transportCodeException.resolved ? 'exception_transport_resolved' : 'exception_proration_resolved';
      return {
        ...prev,
        transaction: { ...prev.transaction, pipelineStatus: nextStatus as PipelineStatus }
      }
    });
    logAction('Oracle Payroll Agent', 'Proration Synthesized', 'Calculated 14 days @ legacy rate, 16 days @ new rate.');
  };

  const resolveTransportException = () => {
    setState(prev => {
      const nextStatus = prev.transaction.pipelineStatus === 'exception_proration_resolved' ? 'exception_transport_resolved' : 'payroll_exception_flagged';
      return {
        ...prev,
        transaction: {
          ...prev.transaction,
          pipelineStatus: 'exception_transport_resolved',
          transportCodeException: { ...prev.transaction.transportCodeException, resolved: true }
        }
      }
    });
    logAction('Oracle Validation Agent', 'Code Auto-Aligned', 'Adjusted transport code FR_TECH_TR_01 -> FR_MGR_TR_02.');
  };

  const transmitPayroll = () => {
    setState(prev => ({
      ...prev,
      transaction: { 
        ...prev.transaction, 
        pipelineStatus: 'employee_notified',
        vendorTransmission: {
          sentAt: new Date().toISOString(),
          fileCount: 1245,
          failures: 0,
          complexProrations: 1
        }
      },
      employeeComms: { ...prev.employeeComms, letterGenerated: true }
    }));
    logAction('Fiona', 'Transmission Executed', '1245 records transmitted securely via SFTP over Global Payroll Interface.');
  };

  const signEmployeeLetter = () => {
    setState(prev => ({
      ...prev,
      transaction: { ...prev.transaction, pipelineStatus: 'signed' },
      employeeComms: { ...prev.employeeComms, letterSignedByLucas: true }
    }));
    logAction('Lucas', 'Electronic Signature Applied', 'Contract amendment signed via Guided Journeys mobile portal.');
  };

  const askPaySimulator = (q: string) => {
    setState(prev => {
      const response = {
        question: q,
        answer: `Hello Lucas, congratulations on your promotion. For June, your gross pay is prorated at €${prev.transaction.proration.proratedGross.toFixed(2)}. This includes 14 days at your previous rate and 16 days at the Senior Manager rate.`
      };
      return {
        ...prev,
        employeeComms: { ...prev.employeeComms, paySimulatorResponses: [...prev.employeeComms.paySimulatorResponses, response] }
      };
    });
    logAction('Oracle Pay Assistant', 'Chat Response', 'Modeled upcoming payslip metrics dynamically for Lucas.');
  };

  const resetDemo = () => {
    setState({ ...initialState });
  };

  return (
    <DemoContext.Provider value={{
      state, setTab, submitManagerRequest, approveHROps, approveComp,
      resolveProrationException, resolveTransportException, transmitPayroll, signEmployeeLetter, askPaySimulator, resetDemo
    }}>
      {children}
    </DemoContext.Provider>
  );
};

export const useDemoState = () => {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemoState must be used within a DemoProvider');
  }
  return context;
};
