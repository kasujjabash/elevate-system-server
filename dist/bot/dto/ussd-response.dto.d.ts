export declare enum ChatAction {
  Prompt = 0,
  End = 1,
}
export declare class UssdResponseDto {
  action: ChatAction;
  text: string;
}
