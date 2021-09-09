import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { UpdateResult } from 'typeorm';
import { CommentsService } from './comments.service';
import {
  CreateCommentInputDto,
  CreateCommentOutputDto,
} from './dtos/createComment.dto';
import { DeleteCommentOutputDto } from './dtos/deleteComment.dto';
import { GetCommentsOutputDto } from './dtos/getComments.dto';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({ summary: 'Create comment' })
  @ApiOkResponse({
    type: CreateCommentInputDto,
  })
  @ApiParam({ name: 'tweetId', example: '1', description: '트윗 Id' })
  @UseGuards(JwtAuthGuard)
  @Post('tweets/:tweetId')
  async createComments(
    @Req() req: Request,
    @Param() param: { tweetId: string },
    @Body() createCommentInputDto: CreateCommentInputDto,
  ): Promise<CreateCommentOutputDto> {
    return await this.commentsService.createComment(
      req,
      param,
      createCommentInputDto,
    );
  }

  @ApiOperation({ summary: '댓글 가져오기' })
  @ApiOkResponse({
    type: [GetCommentsOutputDto],
  })
  @ApiParam({ name: 'tweetId', example: '1', description: '트윗 Id' })
  @Get('tweets/:tweetId')
  async getComments(
    @Param() param: { tweetId: string },
  ): Promise<GetCommentsOutputDto[]> {
    return await this.commentsService.getComments(param);
  }

  @ApiOperation({ summary: '댓글 숫자' })
  @ApiOkResponse({
    type: Number,
  })
  @ApiParam({ name: 'tweetId', example: '1', description: '트윗 Id' })
  @Get('count/tweets/:tweetId')
  async getCommentsCount(@Param() param: { tweetId: string }): Promise<number> {
    return await this.commentsService.getCommentsCount(param);
  }

  @ApiOperation({ summary: '댓글 삭제' })
  @ApiOkResponse({
    type: DeleteCommentOutputDto,
  })
  @ApiResponse({
    status: 400,
    description: '존재하지 않는 댓글입니다.',
  })
  @ApiResponse({
    status: 401,
    description: '댓글 삭제에 실패하였습니다.',
  })
  @ApiParam({ name: 'commentId', example: '1', description: '댓글 Id' })
  @UseGuards(JwtAuthGuard)
  @Delete(':commentId')
  async deleteComment(
    @Req() req: Request,
    @Param() param: { commentId: string },
  ) {
    return await this.commentsService.deleteComment(req, param);
  }
}
