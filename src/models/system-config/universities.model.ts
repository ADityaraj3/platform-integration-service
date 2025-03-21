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

@Table({ schema: 'system_config', tableName: 'universities', timestamps: true })
export class UniversityModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  university_id: number;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  slug: string;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  created_by: number;

  @ForeignKey(() => UserModel)
  @Column({
    type: DataType.BIGINT,
    allowNull: true,
  })
  updated_by: number;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  updated_at: Date;
}

export interface IUniversityModel {
  university_id: number;
  name?: string;
  slug?: string;
  created_by?: number;
  updated_by?: number;
  created_at: Date;
  updated_at?: Date;
}
