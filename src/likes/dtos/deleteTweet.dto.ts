import { ApiProperty } from '@nestjs/swagger';

export class DeleteTweetOutputDto {
  @ApiProperty({
    example: true,
    description: '트윗 삭제 여부',
  })
  ok: boolean;
}
