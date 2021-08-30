import { ApiProperty, PickType } from '@nestjs/swagger';
import { Likes } from '../entities/likes.entity';

export class GetIsTweetLikeOutputDto extends PickType(Likes, [
  'like',
] as const) {}
