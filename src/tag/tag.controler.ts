import { Controller, Get } from '@nestjs/common';
import { TagService } from './tag.service';

@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}
  @Get()
  async findAll(): Promise<{ tags: string[] }> {
    const resp = await this.tagService.findAll();
    return {
      tags: resp.map((tag) => tag.name),
    };
  }
}
