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

@Table({ schema: 'system_config', tableName: 'tags', timestamps: true })
export class TagModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  tag_id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  slug: string;

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
    defaultValue: DataType.NOW,
  })
  created_at: Date;

  @Column({
    type: DataType.DATE,
  })
  updated_at: Date;
}

export interface ITagModel {
  tag_id: number;
  name: string;
  slug: string;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}

