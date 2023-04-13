import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatDTO } from './dto/cat.dto';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  findAll(): Promise<CatDTO[]> {
    return this.catsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<CatDTO> {
    return this.catsService.findOne(id);
  }

  @Post()
  create(@Body() cat: CatDTO) {
    this.catsService.create(cat);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() cat: CatDTO) {
    this.catsService.update(id, cat);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.catsService.remove(id);
  }
}
