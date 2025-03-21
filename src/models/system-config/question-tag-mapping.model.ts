import {
  Table,
  Model,
  Column,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  Unique,
} from 'sequelize-typescript';
import { TagModel } from './tags.model';
import { UserModel } from '../public/users.model';

export enum Platform {
  CODEFORCES = 'CODEFORCES',
  GEEKS_FOR_GEEKS = 'GEEKS_FOR_GEEKS',
  HACKERANK = 'HACKERANK',
  LEETCODE = 'LEETCODE',
}

@Table({
  schema: 'system_config',
  tableName: 'question_tag_mapping',
  timestamps: true,
})
export class QuestionTagMappingModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  mapping_id: number;

  @Unique('unique_question_id_tag_id_platform') // Composite unique key
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  question_id: number;

  @Unique('unique_question_id_tag_id_platform') // Composite unique key
  @Column({
    type: DataType.ENUM(...Object.values(Platform)), // Restrict to enum values
    allowNull: false,
  })
  platform: Platform; // Use the enum type for the column

  @Unique('unique_question_id_tag_id_platform') // Composite unique key
  @ForeignKey(() => TagModel)
  @Column({
    type: DataType.INTEGER,
  })
  tag_id: number;

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

export interface IQuestionTagMappingModel {
  mapping_id: number;
  question_id: number;
  platform: Platform;
  tag_id: number;
  created_by: number;
  updated_by: number;
  created_at: Date;
  updated_at: Date;
}