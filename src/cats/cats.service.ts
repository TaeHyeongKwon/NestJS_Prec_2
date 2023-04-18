import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entity/cats.entity';
import { Repository } from 'typeorm';
import { CatDTO } from './dto/cat.dto';

@Injectable()
export class CatsService {
  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,
  ) {}

  findAll(): Promise<CatDTO[]> {
    return this.catsRepository.find();
  }

  async findOne(id: number): Promise<CatDTO> {
    const existedCat = await this.catsRepository.findOne({ where: { id } });

    if (!existedCat) throw new NotFoundException(`찾을 수 없는 id ${id}`);

    return existedCat;
  }

  async create(cat: CatDTO): Promise<void> {
    await this.catsRepository.save(cat);
  }

  async update(id: number, cat: CatDTO): Promise<void> {
    const existedCat = await this.findOne(id);
    if (existedCat)
      await this.catsRepository.update(id, {
        name: cat.name,
        age: cat.age,
        breed: cat.breed,
      });
  }

  async remove(id: number): Promise<void> {
    await this.catsRepository.delete(id);
  }
}
