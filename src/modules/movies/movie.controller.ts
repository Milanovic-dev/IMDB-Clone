import {
  Controller,
  Body,
  Post,
  Get,
  Param,
  UseGuards,
  HttpStatus,
  HttpException,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiResponse, ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MoviePayload } from './movie.payload';
import { AuthGuard } from '@nestjs/passport';

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
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  async get(@Param('id') id: string) {
    const movie = await this.movieService.get(id);
    if (!movie) {
      throw new HttpException(
        `Movie with id ${id} does not exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    return movie;
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
