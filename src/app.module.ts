import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModel } from './models/public/users.model';
import { PermissionModel } from './models/master/permissions.model';
import { RoleModel } from './models/system-config/role.mode';
import { RolePermissionMappingModel } from './models/system-config/role-permission-mapping.model';
import { UniversityModel } from './models/system-config/universities.model';
import { CodeforcesQuestionModel } from './models/system-config/codeforces-questions.model';
import { LeetcodeQuestionModel } from './models/system-config/leetcode-questions.model';
import { GeeksForGeeksQuestionModel } from './models/system-config/geeks-for-geeks-questions.model';
import { HackerRankQuestionModel } from './models/system-config/hackerank-questions.model';
import { TagModel } from './models/system-config/tags.model';
import { QuestionTagMappingModel } from './models/system-config/question-tag-mapping.model';
import { CodeforcesModule } from './modules/codeforces/codeforces.module';
import { CodeforcesService } from './modules/codeforces/codeforces.service';
import { LeetcodeService } from './modules/leetcode/leetcode.service';
import { TagsModule } from './modules/tags/tags.module';
import { LeetcodeModule } from './modules/leetcode/leetcode.module';
import { TagsService } from './modules/tags/tags.service';
import { GeeksForGeeksModule } from './modules/geeks-for-geeks/geeks-for-geeks.module';
import { GeeksForGeeksService } from './modules/geeks-for-geeks/geeks-for-geeks.service';
import { HackerrankModule } from './modules/hackerrank/hackerrank.module';
import { HackerrankService } from './modules/hackerrank/hackerrank.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.db_host,
      port: Number(process.env.db_port),
      username: process.env.db_username,
      password: process.env.db_password,
      database: process.env.db_name,
      dialectOptions: {},
      models: [
        UserModel,
        PermissionModel,
        RoleModel,
        RolePermissionMappingModel,
        UniversityModel,
        CodeforcesQuestionModel,
        LeetcodeQuestionModel,
        GeeksForGeeksQuestionModel,
        HackerRankQuestionModel,
        TagModel,
        QuestionTagMappingModel
      ],
      synchronize: false,
      autoLoadModels: true,
      define: {
        freezeTableName: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
      logging: false,
      pool: {
        max: 30,
        min: 3,
        idle: 60000,
      },
    }),
    CodeforcesModule,
    TagsModule,
    LeetcodeModule,
    GeeksForGeeksModule,
    HackerrankModule
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService, CodeforcesService, LeetcodeService, TagsService, GeeksForGeeksService, HackerrankService],
})
export class AppModule { }
