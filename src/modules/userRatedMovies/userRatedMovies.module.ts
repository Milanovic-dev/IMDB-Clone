import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRatedMoviesService } from './userRatedMovies.service';
import { UserRatedMovies } from './userRatedMovies.entity';
import { MovieModule } from 'modules/movies/movie.module';
import { UserModule } from 'modules/user/user.module';
import { forwardRef } from '@nestjs/common/utils/forward-ref.util';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRatedMovies]),
    forwardRef(() => MovieModule),
    UserModule,
  ],
  controllers: [],
  exports: [UserRatedMoviesService],
  providers: [UserRatedMoviesService],
})
export class UserRatedMoviesModule {}
