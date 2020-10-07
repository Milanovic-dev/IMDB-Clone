import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination, PaginationOptionsInterface } from '../paginate';
import { Movie } from './movie.entity';
import { MoviePayload } from './movie.payload';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async getAll(
    options: PaginationOptionsInterface,
  ): Promise<Pagination<Movie>> {
    const take = options.limit || 10;
    const skip = options.page || 0;

    const [results, total] = await this.movieRepository.findAndCount({
      take,
      skip,
    });

    return new Pagination<Movie>({ results, total });
  }

  async get(id: string): Promise<Movie> {
    return this.movieRepository.findOne(id);
  }

  async create(movie: MoviePayload): Promise<Movie> {
    return this.movieRepository.save(this.movieRepository.create(movie));
  }
}
