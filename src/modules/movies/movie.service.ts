import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Movie } from './movie.entity';
import { MoviePayload } from './movie.payload';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async get(id: string): Promise<Movie> {
    return this.movieRepository.findOne(id);
  }

  async create(movie: MoviePayload): Promise<Movie> {
    return this.movieRepository.save(this.movieRepository.create(movie));
  }
}
