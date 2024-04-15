import { Module } from '@nestjs/common';
import { TagModule } from '@app/tags/tags.module';

@Module({
  imports: [TagModule],
})
export class AppModule {}
