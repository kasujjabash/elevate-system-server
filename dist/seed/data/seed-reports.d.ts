export declare const reportsData: {
  id: number;
  name: string;
  description: string;
  submissionFrequency: string;
  active: boolean;
  status: string;
  targetGroupCategory: {
    id: number;
    name: string;
  };
  fields: {
    id: number;
    name: string;
    type: string;
    label: string;
    required: boolean;
    hidden: boolean;
    options: string[];
    order: number;
  }[];
}[];
