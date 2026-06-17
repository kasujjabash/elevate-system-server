import mailChatDto from './sendMail.dto';
declare const UpdateChatDto_base: import('@nestjs/mapped-types').MappedType<
  Partial<mailChatDto>
>;
export declare class UpdateChatDto extends UpdateChatDto_base {}
export {};
