export declare class SeedController {
  constructor();
  getDatabaseStatus(): Promise<
    | {
        success: boolean;
        message: string;
        timestamp: string;
        error?: undefined;
      }
    | {
        success: boolean;
        error: any;
        message: string;
        timestamp?: undefined;
      }
  >;
  debugUser(username: string): Promise<
    | {
        success: boolean;
        username: string;
        userQuery: string;
        rolesQuery: string;
        message: string;
        error?: undefined;
      }
    | {
        success: boolean;
        error: any;
        message: string;
        username?: undefined;
        userQuery?: undefined;
        rolesQuery?: undefined;
      }
  >;
  seedUsers(): Promise<
    | {
        success: boolean;
        message: string;
        output: string;
        error?: undefined;
      }
    | {
        success: boolean;
        error: any;
        message: string;
        output: any;
      }
  >;
}
