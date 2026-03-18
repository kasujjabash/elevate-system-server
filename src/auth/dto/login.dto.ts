import { ApiProperty } from '@nestjs/swagger';

export default class LoginDto {
  @ApiProperty()
  username: string;
  @ApiProperty()
  password: string;
  @ApiProperty({ description: 'Hub location (e.g. Katanga, Kosovo, Jinja)' })
  hubName: string;
}
