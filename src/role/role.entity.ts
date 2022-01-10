import { ApiProperty } from '@nestjs/swagger';
import { Permission } from '../permission/permission.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('role')
export class RoleEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  @ApiProperty({ required: false, readOnly: true })
  id: number;

  @Column({ name: 'role_key', type: 'varchar', unique: true })
  @ApiProperty({ default: 'ROLE_ID' })
  key: string;

  @Column({ name: 'role_name', type: 'varchar', nullable: true })
  @ApiProperty({ default: 'Role Name' })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  @ApiProperty({ default: 'Role description' })
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable()
  permissions: Permission[];
}
