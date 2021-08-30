import { Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { LikesService } from './likes.service';
import { Request } from 'express';
import {
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { LikeTweetOutputDto } from './dtos/likeTweet.dto';
import { GetIsTweetLikeOutputDto } from './dtos/getTweetIsLike';

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @ApiOperation({ summary: '좋아요 기능' })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/like/tweets/10',
    description: '트윗Id',
  })
  @ApiOkResponse({
    type: LikeTweetOutputDto,
    description: '좋아요',
  })
  @ApiResponse({
    status: 400,
    description: '좋아요 실패',
  })
  @UseGuards(JwtAuthGuard)
  @Put('tweets/:tweetsId')
  async likeTweet(
    @Req() req: Request,
    @Param() param: { tweetsId: string },
  ): Promise<LikeTweetOutputDto> {
    return await this.likesService.likeTweet(req, param);
  }

  @ApiOperation({ summary: '트윗 좋아요 숫자' })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/like/count/tweets/10',
    description: '트윗Id',
  })
  @ApiOkResponse({
    type: Number,
    description: '트윗 좋아요 숫자',
  })
  @Get('count/tweets/:tweetsId')
  async getTweetLikeCount(
    @Param() param: { tweetsId: string },
  ): Promise<number> {
    return await this.likesService.getTweetLikesCount(param);
  }

  @ApiOperation({ summary: '트윗 좋아요 여부' })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/like/islike/tweets/10',
    description: '트윗Id',
  })
  @ApiOkResponse({
    type: GetIsTweetLikeOutputDto,
    description: '트윗 좋아요 여부',
  })
  @UseGuards(JwtAuthGuard)
  @Get('islike/tweets/:tweetsId')
  async getTweetIsLike(
    @Req() req: Request,
    @Param() param: { tweetsId: string },
  ): Promise<GetIsTweetLikeOutputDto> {
    return await this.likesService.getTweetIsLike(req, param);
  }
}
