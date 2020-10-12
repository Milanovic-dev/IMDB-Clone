import {
  Controller,
  Request,
  Body,
  Post,
  Get,
  Param,
  UseGuards,
  HttpException,
  Query,
  Put,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MoviePayload } from './movie.payload';
import { AuthGuard } from '@nestjs/passport';
import { Action } from 'modules/userRatedMovies/userRatedMovies.entity';

@Controller('api/movies')
@ApiTags('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Successfull Response' })
  async getAll(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('title') title: string,
  ) {
    return await this.movieService.getAll(
      {
        limit: parseInt(limit),
        page: parseInt(page),
      },
      title,
    );
  }

  @Get(':id')
  @ApiResponse({ status: 200, description: 'Successfull Response' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async get(@Param('id') id: number) {
    try {
      return await this.movieService.getAndCountView(id);
    } catch (error) {
      throw new HttpException(error.response.message, error.status);
    }
  }

  @Put('like/:id')
  @UseGuards(AuthGuard())
  async like(@Request() request, @Param('id') movieId: number) {
    const recordInterface = {
      userId: request.user.id,
      movieId: movieId,
      action: Action.LIKE,
    };

    try {
      await this.movieService.like(recordInterface);
    } catch (error) {
      throw new HttpException(error.response.message, error.status);
    }
  }

  @Put('dislike/:id')
  @UseGuards(AuthGuard())
  async dislike(@Request() request, @Param('id') movieId: number) {
    const recordInterface = {
      userId: request.user.id,
      movieId: movieId,
      action: Action.DISLIKE,
    };

    try {
      await this.movieService.dislike(recordInterface);
    } catch (error) {
      throw new HttpException(error.response.message, error.status);
    }
  }

  @Post()
  @ApiResponse({ status: 201, description: 'Successful Registration' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async create(@Body() moviePayload: MoviePayload) {
    return await this.movieService.create(moviePayload);
  }
}
