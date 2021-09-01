import { Common } from 'src/common/common.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Profiles extends Common {
  @Column('varchar', { unique: true })
  filename: string;

  @Column('varchar')
  originalFilename: string;

  @ManyToOne(() => Users, (users) => users.profiles)
  user: Users;
}
