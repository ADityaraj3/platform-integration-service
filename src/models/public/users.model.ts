import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
} from 'sequelize-typescript';
import { RoleModel } from '../system-config/role.mode';
import { UniversityModel } from '../system-config/universities.model';

export enum user_type {
  SYSTEM_USER = 'SYSTEM_USER',
  SYSTEM_ADMIN = 'SYSTEM_ADMIN',
}

@Table({
  schema: 'public',
  tableName: 'users',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class UserModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  user_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password: string;

  @Column({
    type: DataType.ENUM,
    allowNull: true,
    values: Object.values(user_type),
  })
  user_type: user_type;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  is_blocked: boolean;

  @ForeignKey(() => RoleModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  role_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  codeforces_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  codechef_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  geeksforgeeks_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  leetcode_id: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  hackerank_id: string;

  @ForeignKey(() => UniversityModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  university_id: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  created_by: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  updated_by: number;
}

export interface IUserModel {
  user_id: number;
  name?: string;
  email?: string;
  password?: string;
  user_type?: string;
  is_blocked?: boolean;
  role_id?: number;
  codeforces_id?: string;
  codechef_id?: string;
  geeksforgeeks_id?: string;
  leetcode_id?: string;
  hackerank_id?: string;
  university_id?: number;
  created_by?: number;
  updated_by?: number;
  created_at: Date;
  updated_at: Date;
}
