import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/createComment.dto';
import { Comments } from './entities/comments.entity';
import { GetCommentsOutputDto } from './dtos/getComments.dto';
import { DeleteCommentOutputDto } from './dtos/deleteComment.dto';

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

  async getComments(param: {
    tweetId: string;
  }): Promise<GetCommentsOutputDto[]> {
    return await this.commentsRepository
      .createQueryBuilder('comments')
      .leftJoin('comments.user', 'user')
      .leftJoin('comments.tweet', 'tweet')
      .where('tweet.id = :tweetId', { tweetId: param.tweetId })
      .select([
        'comments.id',
        'comments.createdAt',
        'comments.comment',
        'user.id',
        'user.nickname',
      ])
      .orderBy('comments.createdAt', 'DESC')
      .getMany();
  }

  async getCommentsCount(param: { tweetId: string }): Promise<number> {
    return this.commentsRepository.count({
      where: { tweet: { id: param.tweetId } },
    });
  }

  async deleteComment(
    req: Request,
    param: { commentId: string },
  ): Promise<DeleteCommentOutputDto> {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: param.commentId,
        user: req.user,
      },
    });

    if (!comment)
      throw new HttpException(
        '존재하지 않는 댓글입니다.',
        HttpStatus.BAD_REQUEST,
      );

    const updateResult = await this.commentsRepository.softDelete({
      id: +param.commentId,
    });

    if (updateResult.affected !== 1)
      throw new HttpException(
        '댓글 삭제에 실패하였습니다.',
        HttpStatus.UNAUTHORIZED,
      );

    return { ok: true };
  }
}
