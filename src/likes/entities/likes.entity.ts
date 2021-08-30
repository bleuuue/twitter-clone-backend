import { ApiProperty } from '@nestjs/swagger';
import { Common } from 'src/common/common.entity';
import { Tweets } from 'src/tweets/entities/tweets.entity';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Likes extends Common {
  @ApiProperty({
    example: true,
    description: '좋아요',
  })
  @Column('boolean', { default: true })
  like: boolean;

  @ManyToOne(() => Users, (users) => users.likes)
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Tweets, (tweets) => tweets.likes)
  @JoinColumn()
  tweet: Tweets;
}
