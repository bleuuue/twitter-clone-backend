import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Req,
  Put,
  UseInterceptors,
  UploadedFiles,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { CreateUserDto } from './dtos/createUser.dto';
import { UsersService } from './users.service';
import { Request } from 'express';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import {
  ModifyIntroduceInputDto,
  ModifyIntroduceOutputDto,
} from './dtos/modifyIntroduce.dto';
import { FollowOutputDto } from './dtos/follow.dto';
import { GetFollowsOutputDto } from './dtos/getFollows.dto';
import { GetProfileInfoOutputDto } from './dtos/getProfileInfo.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Post('login')
  async login(@Body() loginDto) {
    return this.usersService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Req() req: Request): Promise<number> {
    return this.usersService.getMe(req);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async profileImage(
    @Req() req: Request,
    @UploadedFiles() files: Array<Express.MulterS3.File>,
  ) {
    return await this.usersService.profileImage(req, files);
  }

  @Get('profile/image/:userId')
  async getProfileImage(@Param() param: { userId: string }) {
    return await this.usersService.getProfileImage(param);
  }

  @ApiOperation({ summary: 'Modify my introduce' })
  @ApiOkResponse({
    type: ModifyIntroduceInputDto,
  })
  @UseGuards(JwtAuthGuard)
  @Put('introduce')
  async modifyIntroduce(
    @Req() req: Request,
    @Body() modifyIntroduceInputDto: ModifyIntroduceInputDto,
  ): Promise<ModifyIntroduceOutputDto> {
    return await this.usersService.modifyIntroduce(
      req,
      modifyIntroduceInputDto,
    );
  }

  @Get('profile/:userId')
  async getProfile(@Param() param: { userId: string }) {
    return await this.usersService.getProfile(param);
  }

  @ApiOperation({ summary: '????????? / ????????? ??????' })
  @ApiOkResponse({})
  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId')
  async follow(
    @Req() req: Request,
    @Param() param: { userId: string },
  ): Promise<FollowOutputDto> {
    return await this.usersService.follow(req, param);
  }

  @ApiOperation({ summary: 'Get user all follow' })
  @ApiOkResponse({
    type: [GetFollowsOutputDto],
  })
  @UseGuards(JwtAuthGuard)
  @Get('follow')
  async getFollow(@Req() req: Request): Promise<GetFollowsOutputDto[]> {
    return await this.usersService.getFollows(req);
  }

  @Get('followers/:userId')
  async getFollowers(@Param() param: { userId: string }) {
    return await this.usersService.getFollowers(param);
  }

  @Get('followings/:userId')
  async getFollowings(@Param() param: { userId: string }) {
    return await this.usersService.getFollowings(param);
  }

  @Get('profile/info/:userId')
  async getProfileInfo(
    @Param() param: { userId: string },
  ): Promise<GetProfileInfoOutputDto> {
    return await this.usersService.getProfileInfo(param);
  }

  @UseGuards(JwtAuthGuard)
  @Get('is-follow/:userId')
  async isFollow(@Req() req: Request, @Param() param: { userId: string }) {
    return await this.usersService.isFollow(req, param);
  }
}
