import { Module } from '@nestjs/common';
import { LeetcodeService } from './leetcode.service';

@Module({
  providers: [LeetcodeService]
})
export class LeetcodeModule {}
