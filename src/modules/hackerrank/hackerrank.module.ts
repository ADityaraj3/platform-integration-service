import { Module } from '@nestjs/common';
import { HackerrankService } from './hackerrank.service';

@Module({
    providers: [HackerrankService],
    exports: [HackerrankService],
})
export class HackerrankModule {}
