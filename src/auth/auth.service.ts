import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/users/entities/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendVerifyEmail(user: Users) {
    await this.mailerService.sendMail({
      to: user.email,
      from: this.configService.get<string>('MAILGUN_USER'),
      subject: '트위터 클론 인증 메일',
      html: `Verify code : ${user.verifyCode}`,
    });
  }
}
