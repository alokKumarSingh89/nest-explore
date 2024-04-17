import { Module } from '@nestjs/common';
import { TagModule } from '@app/tag/tag.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '@app/ormconfig';

@Module({
  imports: [TypeOrmModule.forRoot(config), TagModule],
})
export class AppModule {}
