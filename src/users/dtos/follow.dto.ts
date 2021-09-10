import { PickType } from '@nestjs/swagger';
import { Follows } from '../entities/follows.entity';

export class FollowOutputDto extends PickType(Follows, [
  'follower',
  'following',
] as const) {
  isFollow: 'follow' | 'unFollow';
}
