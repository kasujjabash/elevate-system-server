export declare function normalizePort(val: any): any;
declare const config: {
  app: {
    port: any;
  };
  database: {
    retryAttempts?: number;
    retryDelay?: number;
    toRetry?: (err: any) => boolean;
    autoLoadEntities?: boolean;
    keepConnectionAlive?: boolean;
    verboseRetryLog?: boolean;
    manualInitialization?: boolean;
  } & Partial<
    import('typeorm/driver/postgres/PostgresConnectionOptions').PostgresConnectionOptions
  >;
};
export default config;
export declare const appEntities: any[];
