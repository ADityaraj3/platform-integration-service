import { Module } from '@nestjs/common';
import { GeeksForGeeksService } from './geeks-for-geeks.service';

@Module({
  providers: [GeeksForGeeksService],
  controllers: []
})
export class GeeksForGeeksModule {}
