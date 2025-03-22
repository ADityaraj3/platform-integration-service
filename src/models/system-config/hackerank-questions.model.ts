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

@Table({
  schema: 'system_config',
  tableName: 'hackerank_questions',
  timestamps: true,
})
export class HackerRankQuestionModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.BIGINT,
    allowNull: false,
  })
  question_id: number;

  @Column({
    type: DataType.INTEGER,
  })
  platform_question_id: number;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.STRING,
  })
  slug: string;

  @Column({
    type: DataType.INTEGER,
  })
  all_submissions: number;

  @Column({
    type: DataType.INTEGER,
  })
  accepted_solution: number;

  @Column({
    type: DataType.INTEGER,
  })
  points: number;

  @Column({
    type: DataType.DECIMAL(15, 2),
  })
  accuracy: number;

  @Column({
    type: DataType.STRING,
  })
  difficulty: string;

  @Column({
    type: DataType.STRING,
  })
  url: string;

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
