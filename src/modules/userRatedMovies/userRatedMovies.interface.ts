import { Action } from './userRatedMovies.entity';

export interface UserRatedMoviesInterface {
  userId: number;
  movieId: number;
  action: Action;
}
