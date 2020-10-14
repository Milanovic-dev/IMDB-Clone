import { UserRatedMovies } from 'modules/userRatedMovies/userRatedMovies.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'movies' })
export class Movie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  image: string;

  @Column()
  genre: string;

  @Column()
  likes: number;

  @Column()
  dislikes: number;

  @Column()
  pageViews: number;
}
