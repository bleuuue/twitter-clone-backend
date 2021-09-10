import { Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Common } from 'src/common/common.entity';
import { Users } from './users.entity';

@Entity()
export class Follows extends Common {
  @ManyToOne(() => Users, (users) => users.followers)
  @JoinColumn()
  follower: Users;

  @ManyToOne(() => Users, (users) => users.followings)
  @JoinColumn()
  following: Users;
}
