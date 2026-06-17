export type PipelineStatus = 
  | 'draft' 
  | 'submitted' 
  | 'hr_ops_approved' 
  | 'comp_approved' 
  | 'payroll_exception_flagged' 
  | 'exception_proration_resolved'
  | 'exception_transport_resolved'
  | 'transmitted' 
  | 'confirmed' 
  | 'employee_notified' 
  | 'signed';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  detail: string;
}

export interface DemoState {
  currentTab: string;
  transaction: {
    employee: string;
    fromJobCode: string;
    toJobCode: string;
    fromDept: string;
    toDept: string;
    fromGrade: string;
    toGrade: string;
    effectiveDate: string;
    submittedDate: string;
    payrollCutoff: string;
    oldBaseSalaryMonthly: number;
    newBaseSalaryMonthly: number;
    compaRatio: number;
    justification: {
      rough: string;
      polished: string;
    };
    equityCheck: {
      status: string;
      note: string;
    };
    proration: {
      oldRateDays: number;
      oldRateAmount: number;
      newRateDays: number;
      newRateAmount: number;
      proratedGross: number;
    };
    transportCodeException: {
      detected: boolean;
      oldCode: string;
      newCode: string;
      resolved: boolean;
    };
    pipelineStatus: PipelineStatus;
    vendorTransmission: {
      sentAt: string | null;
      fileCount: number;
      failures: number;
      complexProrations: number;
    };
  };
  approvals: {
    hrOps: { status: string; approvedBy: string; timestamp: string | null; complianceBadge: any };
    comp: { status: string; approvedBy: string; timestamp: string | null };
  };
  auditLog: AuditLogEntry[];
  kpis: {
    changesPending: number;
    changesRejected: number;
    changesPastCutoff: number;
    sodChecksPassed: number;
  };
  employeeComms: {
    letterGenerated: boolean;
    letterSignedByLucas: boolean;
    paySimulatorResponses: any[];
  };
}
