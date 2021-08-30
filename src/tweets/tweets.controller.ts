import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
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
import { DeleteTweetOutputDto } from 'src/likes/dtos/deleteTweet.dto';
import { UpdateResult } from 'typeorm';
import { CreateTweetDto } from './dtos/createTweet.dto';
import { TweetsService } from './tweets.service';

@ApiTags('Tweets')
@Controller('tweets')
export class TweetsController {
  constructor(private readonly tweetsService: TweetsService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createTweet(
    @Req() req: Request,
    @Body() createTweetDto: CreateTweetDto,
  ) {
    return await this.tweetsService.createTweet(req, createTweetDto);
  }

  @Get()
  async getTweets(@Query() query: { page: string }) {
    return await this.tweetsService.getTweets(query);
  }

  @ApiOperation({ summary: '트윗 삭제' })
  @ApiParam({
    name: 'tweetsId',
    example: 'http://localhost:3010/tweets/10',
    description: '트윗Id',
  })
  @ApiOkResponse({
    type: DeleteTweetOutputDto,
    description: '트윗 삭제 성공',
  })
  @ApiResponse({
    status: 401,
    description: '인증되지 않은 사용자입니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':tweetsId')
  async deleteTweet(
    @Req() req: Request,
    @Param() param: { tweetsId: string },
  ): Promise<DeleteTweetOutputDto> {
    return await this.tweetsService.deleteTweet(req, param);
  }
}
