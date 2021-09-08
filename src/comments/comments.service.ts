import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/createComment.dto';
import { Comments } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {}

  async createComment(
    req: Request,
    param: { tweetId: string },
    createCommentInputDto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return await this.commentsRepository.save({
      comment: createCommentInputDto.comment,
      tweet: {
        id: +param.tweetId,
      },
      user: req.user,
    });
  }
}
