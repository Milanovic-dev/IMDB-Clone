import { forwardRef } from '@nestjs/common';
import { Movie } from 'modules/movies';
import { User } from 'modules/user';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Action {
  LIKE,
  DISLIKE,
}

@Entity()
export class UserRatedMovies {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user?: User;

  @ManyToOne((type) => Movie)
  @JoinColumn({ name: 'movieId', referencedColumnName: 'id' })
  movie?: Movie;

  @Column()
  action: Action;
}
