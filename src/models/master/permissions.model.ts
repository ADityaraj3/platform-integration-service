import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from 'sequelize-typescript';
import { UserModel } from '../public/users.model';

@Table({ schema: 'master', tableName: 'permissions', timestamps: true })
export class PermissionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  permission_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  permission_name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  permission_slug: string;

  @Column({
    type: DataType.STRING,
  })
  parent: string;

  @Column({
    type: DataType.STRING,
  })
  dependency: string;

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
}

export interface IPermissionModel {
  permission_id: number;
  permission_name: string;
  permission_slug: string;
  parent?: string;
  dependency?: string;
  created_at: Date;
  updated_at: Date;
  created_by?: number;
  updated_by?: number;
}
