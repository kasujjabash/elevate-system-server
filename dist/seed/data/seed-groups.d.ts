export declare const groupsData: {
  movement: {
    id: number;
    name: string;
    type: string;
    categoryId: number;
    categoryName: string;
    parentId: any;
    privacy: string;
    details: string;
    memberCount: number;
  };
  networks: {
    id: number;
    name: string;
    type: string;
    categoryId: number;
    categoryName: string;
    parentId: number;
    privacy: string;
    details: string;
    memberCount: number;
  }[];
  fobs: {
    id: number;
    name: string;
    type: string;
    categoryId: number;
    categoryName: string;
    parentId: number;
    privacy: string;
    details: string;
    memberCount: number;
    metaData: {
      region: string;
    };
  }[];
  locations: {
    id: number;
    name: string;
    type: string;
    categoryId: number;
    categoryName: string;
    parentId: number;
    privacy: string;
    details: string;
    memberCount: number;
    address: {
      country: string;
      district: string;
      freeForm: string;
    };
  }[];
  zones: {
    id: number;
    name: string;
    type: string;
    categoryId: number;
    categoryName: string;
    parentId: number;
    privacy: string;
    details: string;
    memberCount: number;
  }[];
  fellowships: {
    type: string;
    categoryId: number;
    categoryName: string;
    privacy: string;
    details: string;
    metaData: {
      meetingDay: string;
      meetingTime: string;
    };
    id: number;
    name: string;
    parentId: number;
    memberCount: number;
  }[];
};
