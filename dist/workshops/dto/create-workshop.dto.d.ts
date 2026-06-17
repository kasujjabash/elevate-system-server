export declare enum WorkshopType {
  Workshop = 'Workshop',
  Podcast = 'Podcast',
}
export declare class CreateWorkshopDto {
  title: string;
  description?: string;
  type?: WorkshopType;
  url?: string;
  courseId?: number;
  hubId?: number;
}
