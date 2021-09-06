import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Users } from '../entities/users.entity';

export class ModifyIntroduceInputDto extends PickType(Users, [
  'introduce',
] as const) {}

export class ModifyIntroduceOutputDto extends Users {}
