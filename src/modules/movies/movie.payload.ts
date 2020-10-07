import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class MoviePayload {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  title: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  description: string;
  @IsNotEmpty()
  image: string;
  @IsNotEmpty()
  genre: string;
}
