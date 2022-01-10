import { ApiProperty } from '@nestjs/swagger';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('permission')
export class Permission extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty()
  @Column({ name: 'permission_name' })
  name: string;

  @ApiProperty()
  @Column({ name: 'permission_key', type: 'varchar', unique: true })
  key: string;

  @ApiProperty()
  @Column({ name: 'description' })
  description: string;
}
