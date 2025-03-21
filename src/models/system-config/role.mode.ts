import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { RolePermissionMappingModel } from './role-permission-mapping.model';
import { UserModel } from '../public/users.model';

export enum status_type {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Table({ schema: 'system_config', tableName: 'role', timestamps: true })
export class RoleModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    allowNull: false,
  })
  role_id: number;

  @Column({
    type: DataType.STRING(50),
  })
  role_name: string;

  @Column({
    type: DataType.STRING(50),
  })
  role_slug: string;

  @Column({
    type: DataType.ENUM(...Object.values(status_type)),
  })
  status: status_type;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
  })
  created_by: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
  })
  updated_by: number;

  @Column({
    type: DataType.DATE,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
  })
  updated_at: Date;

  @BelongsTo(() => UserModel)
  user: UserModel;

  @HasMany(() => RolePermissionMappingModel)
  permission_mappings: RolePermissionMappingModel[];
}

export interface IRoleModel {
  role_id: number;
  role_name: string;
  role_slug: string;
  status: status_type;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}
