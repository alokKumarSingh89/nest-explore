import { Module } from '@nestjs/common';
import { TagController } from './tags.controler';
import { TagService } from './tag.service';

@Module({
  controllers: [TagController],
  providers: [TagService],
})
export class TagModule {}
