import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { CodeforcesService } from './modules/codeforces/codeforces.service';
import { AddTagDTO } from './modules/tags/dto/add-tags-dto';
import { TagsService } from './modules/tags/tags.service';
import { LeetcodeService } from './modules/leetcode/leetcode.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly codeforcesService: CodeforcesService,
    private readonly tagsService: TagsService,
    private readonly leetcodeService: LeetcodeService
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @MessagePattern({cmd: 'codeforces.add-problems'})
  getProblemsCodeforces() {
    return this.codeforcesService.addProblemsCodeforces();
  }

  @MessagePattern({cmd: 'leetcode.add-problems'})
  getProblemsLeetcode() {
    return this.leetcodeService.addProblemsLeetcode();
  }

  @MessagePattern({cmd: 'tags.add-tags'})
  addTags(@Payload() body: AddTagDTO) {
    return this.tagsService.addTags(body);
  }
}
