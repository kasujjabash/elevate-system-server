export interface IEmail {
  to: string;
  subject: string;
  html: string;
}
export declare function sendEmail(data: IEmail): Promise<string>;
