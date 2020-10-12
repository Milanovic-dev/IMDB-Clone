import { BadRequestException, Injectable, Inject } from '@nestjs/common';
import { forwardRef } from '@nestjs/common/utils/forward-ref.util';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie, MovieService } from 'modules/movies';
import { User } from 'modules/user/user.entity';
import { UsersService } from 'modules/user/user.service';
import { Repository } from 'typeorm';
import { UserRatedMovies } from './userRatedMovies.entity';
import { UserRatedMoviesInterface } from './userRatedMovies.interface';

@Injectable()
export class UserRatedMoviesService {
  constructor(
    @InjectRepository(UserRatedMovies)
    private readonly userRatedMovies: Repository<UserRatedMovies>,
    @Inject(forwardRef(() => MovieService))
    private readonly movieService: MovieService,
    private readonly userService: UsersService,
  ) {}

  async create(record: UserRatedMoviesInterface) {
    const movie: Movie = await this.movieService.get(record.movieId);
    const user: User = await this.userService.get(record.userId);
    return this.userRatedMovies.save(
      this.userRatedMovies.create({ movie, user, action: record.action }),
    );
  }

  async userDidRate(record: UserRatedMoviesInterface) {
    const dbRecord = await this.userRatedMovies
      .createQueryBuilder('user_rated_movie')
      .where(
        'user_rated_movie.userId = :userId AND user_rated_movie.movieId = :movieId',
        { userId: record.userId, movieId: record.movieId },
      )
      .getOne();

    return dbRecord !== undefined;
  }
}
