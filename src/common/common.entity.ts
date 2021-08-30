import { ApiProperty } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Common {
  @ApiProperty({
    example: 1,
    description: 'id',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Date',
    description: 'createdAt',
  })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({
    example: 'Date',
    description: 'updatedAt',
  })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    example: 'Date',
    description: 'deletedAt',
  })
  @DeleteDateColumn()
  deletedAt: Date;
}
