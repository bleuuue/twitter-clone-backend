import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comments } from 'src/comments/entities/comments.entity';
import { Likes } from 'src/likes/entities/likes.entity';
import { Tweets } from './entities/tweets.entity';
import { TweetsController } from './tweets.controller';
import { TweetsService } from './tweets.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tweets, Likes, Comments])],
  controllers: [TweetsController],
  providers: [TweetsService],
})
export class TweetsModule {}
