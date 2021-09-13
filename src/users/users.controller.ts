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

  @ApiOperation({ summary: '팔로우 / 팔로우 취소' })
  @ApiOkResponse({})
  @UseGuards(JwtAuthGuard)
  @Post('follow/:userId')
  async follow(@Req() req: Request, @Param() param: { userId: string }) {
    return await this.usersService.follow(req, param);
  }
}
