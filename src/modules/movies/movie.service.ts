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
    title: string,
  ): Promise<Pagination<Movie>> {
    const searchQuery = {
      take: options.limit || 10,
      skip: options.page || 0,
    };

    if (title != '' && title != undefined) {
      searchQuery['where'] = { title };
    }

    const [results, total] = await this.movieRepository.findAndCount(
      searchQuery,
    );

    return new Pagination<Movie>({ results, total });
  }

  async get(id: string): Promise<Movie> {
    return this.movieRepository.findOne(id);
  }

  async create(movie: MoviePayload): Promise<Movie> {
    return this.movieRepository.save(this.movieRepository.create(movie));
  }
}
