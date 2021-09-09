import { ApiProperty } from '@nestjs/swagger';

export class DeleteCommentOutputDto {
  @ApiProperty({
    example: true,
    description: '댓글 삭제 성공 여부',
  })
  ok: boolean;
}
