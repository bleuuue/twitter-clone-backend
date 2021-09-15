import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';
import { CreateTweetDto } from './dtos/createTweet.dto';
import { Tweets } from './entities/tweets.entity';
import { Request } from 'express';
import { Likes } from 'src/likes/entities/likes.entity';
import { Comments } from 'src/comments/entities/comments.entity';

@Injectable()
export class TweetsService {
  constructor(
    @InjectRepository(Tweets)
    private readonly tweetsRepository: Repository<Tweets>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {}

  async createTweet(req: Request, createTweetDto: CreateTweetDto) {
    console.log(req.user);

    return await this.tweetsRepository.save({
      ...createTweetDto,
      users: req.user,
    });
  }

  async getTweets(query) {
    return await this.tweetsRepository
      .createQueryBuilder('tweets')
      .leftJoin('tweets.users', 'users')
      .select([
        'tweets.id',
        'tweets.tweet',
        'tweets.createdAt',
        'users.id',
        'users.nickname',
      ])
      .orderBy('tweets.createdAt', 'DESC')
      .take(10)
      .skip(query.page ? query.page * 10 : 0)
      .getMany();
  }

  async getProfileTweets(query, param: { userId: string }): Promise<Tweets[]> {
    return await this.tweetsRepository
      .createQueryBuilder('tweets')
      .leftJoin('tweets.users', 'users')
      .where('users.id = :userId', { userId: param.userId })
      .select([
        'tweets.id',
        'tweets.tweet',
        'tweets.createdAt',
        'users.id',
        'users.nickname',
      ])
      .orderBy('tweets.createdAt', 'DESC')
      .take(10)
      .skip(query.page ? query.page * 10 : 0)
      .getMany();
  }

  async deleteTweet(req: Request, param: { tweetsId: string }) {
    const tweet = await this.tweetsRepository.findOne({
      where: {
        id: param.tweetsId,
        users: req.user,
      },
    });

    if (!tweet)
      throw new HttpException(
        '인증되지 않은 사용자입니다.',
        HttpStatus.UNAUTHORIZED,
      );

    const likes = await this.likesRepository.find({
      where: {
        tweet: {
          id: tweet.id,
        },
      },
    });

    const comments = await this.commentsRepository.find({
      where: {
        tweet: {
          id: tweet.id,
        },
      },
    });

    if (likes.length !== 0) {
      await Promise.all(
        likes.map((like) => {
          this.likesRepository.softDelete({ id: like.id });
        }),
      );
    }

    if (comments.length !== 0) {
      await Promise.all(
        comments.map((comment) => {
          this.commentsRepository.softDelete({ id: comment.id });
        }),
      );
    }

    const deleteTweetResult = await this.tweetsRepository.softDelete({
      id: +param.tweetsId,
    });

    return deleteTweetResult.affected === 1 ? { ok: true } : { ok: false };
  }

  async deleteOne() {
    return await this.tweetsRepository.delete({
      id: 1,
    });
  }
}
