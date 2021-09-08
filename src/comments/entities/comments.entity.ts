import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Common } from 'src/common/common.entity';
import { Tweets } from 'src/tweets/entities/tweets.entity';
import { Users } from 'src/users/entities/users.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity()
export class Comments extends Common {
  @ApiProperty({
    example: 'Hello world',
    description: '댓글',
  })
  @IsString()
  @IsNotEmpty()
  @Column('varchar')
  comment: string;

  @ManyToOne(() => Users, (users) => users.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  user: Users;

  @ManyToOne(() => Tweets, (users) => users.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  tweet: Tweets;
}
