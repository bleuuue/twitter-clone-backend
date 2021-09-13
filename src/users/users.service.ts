import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/createUser.dto';
import { Users } from './entities/users.entity';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { IsEmail } from 'class-validator';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Profiles } from './entities/profiles.entity';
import {
  ModifyIntroduceInputDto,
  ModifyIntroduceOutputDto,
} from './dtos/ModifyIntroduce.dto';
import { Follows } from './entities/follows.entity';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Profiles)
    private readonly profilesRepository: Repository<Profiles>,
    @InjectRepository(Follows)
    private readonly followsRepository: Repository<Follows>,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const verifyCode: number =
      Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;

    const user = await this.usersRepository.save({
      email: createUserDto.email,
      nickname: createUserDto.nickname,
      password: hashedPassword,
      verifyCode: verifyCode.toString(),
    });

    await this.authService.sendVerifyEmail(user);

    return { email: user.email, nickname: user.nickname };
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'password'],
    });

    if (!user)
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.UNAUTHORIZED,
      );

    const checkPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!checkPassword) {
      throw new HttpException(
        '비밀번호가 틀렸습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.jwtService.sign({ id: user.id });

    return { token };
  }

  async getMe(req: Request): Promise<number> {
    return +req.user;
  }

  async profileImage(req: Request, files: Array<Express.MulterS3.File>) {
    const existProfiles = await this.profilesRepository.findOne({
      where: {
        user: req.user,
      },
    });

    if (existProfiles) {
      //DB 삭제
      await this.profilesRepository.delete({
        id: existProfiles.id,
      });
    }

    const profile = await this.profilesRepository.create({
      filename: files[0].key,
      originalFilename: files[0].originalname,
      user: req.user,
    });

    return await this.profilesRepository.save(profile);
  }

  async getProfileImage(param: { userId: string }) {
    const user = await this.usersRepository
      .createQueryBuilder('users')
      .leftJoin('users.profiles', 'profiles')
      .where('users.id = :userId', { userId: param.userId })
      .select(['users.id', 'profiles.id', 'profiles.filename'])
      .getOne();

    return user;
  }

  async modifyIntroduce(
    req: Request,
    modifyIntroduceInputDto: ModifyIntroduceInputDto,
  ): Promise<ModifyIntroduceOutputDto> {
    const user = await this.usersRepository.findOne({
      where: {
        id: req.user,
      },
    });

    user.introduce = modifyIntroduceInputDto.introduce;

    return await this.usersRepository.save(user);
  }

  async getProfile(param: { userId: string }) {
    const user = await this.usersRepository.findOne({
      where: {
        id: param.userId,
      },
    });

    if (!user)
      throw new HttpException('Not exist user', HttpStatus.BAD_REQUEST);

    console.log(user);

    return user;
  }

  async follow(req: Request, param: { userId: string }) {
    const user = await this.usersRepository.findOne({
      where: {
        id: param.userId,
      },
    });

    if (!user)
      throw new HttpException(
        '존재하지 않는 유저입니다.',
        HttpStatus.BAD_REQUEST,
      );
    if (req.user === user.id)
      throw new HttpException(
        '자기 자신을 팔로우 할 수 없습니다.',
        HttpStatus.UNAUTHORIZED,
      );

    const existFollow = await this.followsRepository.findOne({
      where: {
        follower: user,
        following: req.user,
      },
    });

    if (existFollow) {
      await this.followsRepository.delete({ id: existFollow.id });
      return existFollow;
    }

    const follow = await this.followsRepository.create({
      follower: user,
      following: req.user,
    });

    return await this.followsRepository.save(follow);
  }
}
