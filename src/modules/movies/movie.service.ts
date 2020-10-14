import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRatedMoviesInterface } from 'modules/userRatedMovies/userRatedMovies.interface';
import { UserRatedMoviesService } from 'modules/userRatedMovies/userRatedMovies.service';
import { Repository } from 'typeorm';
import { Pagination, PaginationOptionsInterface } from '../paginate';
import { Movie } from './movie.entity';
import { MoviePayload } from './movie.payload';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
    private readonly userRatedMovies: UserRatedMoviesService,
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

  async get(id: number): Promise<Movie> {
    const result = this.movieRepository.findOne(id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  async getAndCountView(id: number): Promise<Movie> {
    const result = this.get(id);

    this.movieRepository.increment({ id }, 'pageViews', 1);

    return result;
  }

  async create(movie: MoviePayload): Promise<Movie> {
    return this.movieRepository.save(this.movieRepository.create(movie));
  }

  async like(record: UserRatedMoviesInterface) {
    if (await this.userRatedMovies.userDidRate(record)) {
      throw new BadRequestException('You already rated this movie');
    }

    const result = await this.movieRepository.increment(
      { id: record.movieId },
      'likes',
      1,
    );

    if (result.affected == 0) {
      throw new NotFoundException();
    }

    this.userRatedMovies.create(record);
  }

  async dislike(record: UserRatedMoviesInterface) {
    if (await this.userRatedMovies.userDidRate(record)) {
      throw new BadRequestException('You already rated this movie');
    }

    const result = await this.movieRepository.increment(
      { id: record.movieId },
      'dislikes',
      1,
    );

    if (result.affected == 0) {
      throw new NotFoundException();
    }

    this.userRatedMovies.create(record);
  }
}
