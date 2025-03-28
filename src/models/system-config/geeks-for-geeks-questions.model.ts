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
  tableName: 'geeksforgeeks_questions',
  timestamps: true,
})
export class GeeksForGeeksQuestionModel extends Model {
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
    unique: true,
  })
  slug: string;

  @Column({
    type: DataType.DECIMAL(15, 2),
  })
  accuracy: number;

  @Column({
    type: DataType.INTEGER,
  })
  all_submissions: number;

  @Column({
    type: DataType.INTEGER,
  })
  points: number;

  @Column({
    type: DataType.STRING,
  })
  difficulty: string;

  @Column({
    type: DataType.INTEGER,
  })
  problem_type: number;

  @Column({
    type: DataType.INTEGER,
  })
  problem_level: number;

  @Column({
    type: DataType.INTEGER,
  })
  content_type: number;

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
