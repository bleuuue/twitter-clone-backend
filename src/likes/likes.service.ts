import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Likes } from './entities/likes.entity';
import { Request } from 'express';
import { LikeTweetOutputDto } from './dtos/likeTweet.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
  ) {}

  async likeTweet(
    req: Request,
    param: { tweetsId: string },
  ): Promise<LikeTweetOutputDto> {
    const like = await this.likesRepository.findOne({
      where: {
        tweet: { id: param.tweetsId },
        user: req.user,
      },
    });

    if (!like) {
      return await this.likesRepository.save({
        tweet: { id: +param.tweetsId },
        user: req.user,
      });
    }

    like.like = !like.like;

    return this.likesRepository.save(like);
  }

  async getTweetLikesCount(param: { tweetsId: string }): Promise<number> {
    return this.likesRepository.count({
      where: { tweet: { id: param.tweetsId }, like: true },
    });
  }

  async getTweetIsLike(req: Request, param: { tweetsId: string }) {
    const like = await this.likesRepository.findOne({
      where: {
        tweet: { id: param.tweetsId },
        user: req.user,
      },
      select: ['like'],
    });

    if (!like) return { like: false };

    return like;
  }
}
