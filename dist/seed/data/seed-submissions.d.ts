export declare const submissionGenerators: {
  generateMCSubmissions: () => any[];
  generateServiceSubmissions: () => any[];
  generateBaptismSubmissions: () => {
    id: number;
    reportId: number;
    reportName: string;
    groupId: number;
    groupName: string;
    submittedAt: string;
    submittedBy: {
      id: number;
      name: string;
    };
    data: {
      baptismDate: string;
      numberOfBaptisms: number;
      baptizedNames: string;
      baptismLocation: string;
      officiatingMinister: string;
      baptismNotes: string;
    };
    canEdit: boolean;
  }[];
  generateSalvationSubmissions: () => {
    id: number;
    reportId: number;
    reportName: string;
    groupId: number;
    groupName: string;
    submittedAt: string;
    submittedBy: {
      id: number;
      name: string;
    };
    data: {
      salvationDate: string;
      numberOfSalvations: number;
      savedNames: string;
      salvationContext: string;
      followUpPlan: string;
    };
    canEdit: boolean;
  }[];
};
