import { Injectable } from '@nestjs/common';
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

  findOne(id: number): Promise<CatDTO> {
    return this.catsRepository.findOne({ where: { id } });
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
