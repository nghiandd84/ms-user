import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  Generated,
  OneToMany,
  ManyToOne,
  OneToOne,
  AfterLoad,
  JoinColumn,
} from 'typeorm';

import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import { RoleEntity } from '../role/entities/role.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
  @ApiProperty({ required: false, readOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ default: 'John' })
  @Column({ name: 'first_name' })
  firstName: string;

  @ApiProperty({ default: 'Smith' })
  @Column({ name: 'last_name' })
  lastName: string;

  @ApiProperty({ default: 'john.smit@yopmail.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ required: false, readOnly: true })
  @CreateDateColumn({ name: 'create_time' })
  createdAt: Date;

  @ApiProperty({ required: false, readOnly: true })
  @UpdateDateColumn({ name: 'update_time' })
  updatedAt: Date;

  @ApiProperty({ default: 'Abc@123456' })
  @Column({ name: 'password', select: false })
  password: string;

  @ApiProperty({ required: false, readOnly: true })
  @Column({ name: 'active', default: false })
  isActive: boolean;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany((_) => AccessEntity, (access) => access.user, { eager: true })
  accesses: AccessEntity[];
}

@Entity('access')
export class AccessEntity extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: UserEntity;

  @ManyToOne((_) => RoleEntity, { eager: true })
  @JoinColumn({ name: 'rule_id', referencedColumnName: 'id' })
  role: RoleEntity;

  roleKey: string;

  @Column({ name: 'location_id', type: 'varchar', nullable: true })
  locationId: string;

  @Column({ name: 'app_id', type: 'varchar', nullable: true })
  appId: string;

  @AfterLoad()
  loadKey() {
    this.roleKey = this.role?.key || null;
  }
}
