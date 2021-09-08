import { PickType } from '@nestjs/swagger';
import { Comments } from '../entities/comments.entity';

export class CreateCommentInputDto extends PickType(Comments, [
  'comment',
] as const) {}

export class CreateCommentOutputDto extends Comments {}
