export declare const studyResourcesBaseData: (
  | {
      title: string;
      description: string;
      type: string;
      url: string;
      isPublic: boolean;
      courseTitle: string;
    }
  | {
      title: string;
      description: string;
      type: string;
      isPublic: boolean;
      courseTitle: string;
      url?: undefined;
    }
)[];
export declare const assignmentsBaseData: {
  title: string;
  description: string;
  maxScore: number;
  courseTitle: string;
  isActive: boolean;
}[];
