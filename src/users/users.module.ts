import { HttpException, HttpStatus, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { async } from 'rxjs';
import { Users } from './entities/users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { JwtModule } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { v4 as uuid } from 'uuid';
import { extname } from 'path';
import { Profiles } from './entities/profiles.entity';
import * as multerS3 from 'multer-s3';
import * as AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: 'AKIA442N3SHG2I6FPKXZ',
  secretAccessKey: `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`,
  region: `ap-northeast-1`,
});

const s3 = new AWS.S3();

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Profiles]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
    }),
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        limits: {
          fileSize: 1024 * 1024 * 5,
        },
        fileFilter: (req, file, callback) => {
          if (file.mimetype.match(/\/(jpg|jped|png)$/)) callback(null, true);
          else
            callback(
              new HttpException('Not image.', HttpStatus.BAD_REQUEST),
              false,
            );
        },
        storage: multerS3({
          s3,
          bucket:
            configService.get<string>('AWS_S3_BUCKET_NAME') + '/profiles-jung',
          key: (req, file, callback) => {
            callback(null, `${uuid()}${extname(file.originalname)}`);
          },
        }),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
