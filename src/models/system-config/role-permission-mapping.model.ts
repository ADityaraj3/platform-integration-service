import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { RoleModel } from './role.mode';
import { PermissionModel } from '../master/permissions.model';
import { UserModel } from '../public/users.model';

@Table({
  schema: 'system_config',
  tableName: 'role_permission_mapping',
  timestamps: true,
})
export class RolePermissionMappingModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  mapping_id: number;

  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  role_id: number;

  @ForeignKey(() => PermissionModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  permission_id: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
  })
  updated_at: Date;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.BIGINT,
  })
  created_by: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.BIGINT,
  })
  updated_by: number;

  @BelongsTo(() => RoleModel)
  role: RoleModel;

  @BelongsTo(() => PermissionModel)
  permission: PermissionModel;
}

export interface IRolePermissionMappingModel {
  mapping_id: number;
  role_id: number;
  permission_id: number;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
