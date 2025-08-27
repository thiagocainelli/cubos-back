import { IsStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isString-property.decorator';
import { IsEnumPropertyDecorator } from '../../_common/decorators/dtoProperties/isEnum-property.decorator';
import { IsIntPropertyDecorator } from '../../_common/decorators/dtoProperties/isInt-property.decorator';
import { IsNumberPropertyDecorator } from '../../_common/decorators/dtoProperties/isNumber-property.decorator';
import { IsDateStringPropertyDecorator } from '../../_common/decorators/dtoProperties/isDateString-property.decorator';
import { IsUrlPropertyDecorator } from '../../_common/decorators/dtoProperties/isUrl-property.decorator';
import { IsUUIDPropertyDecorator } from '../../_common/decorators/dtoProperties/isUUID-property.decorator';

import { MovieSituationEnum } from '../enum/movieSituation.enum';

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateMoviesDto:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: Título do filme em português
 *           example: "Vingadores: Ultimato"
 *         originalTitle:
 *           type: string
 *           description: Título original do filme
 *           example: "Avengers: Endgame"
 *         language:
 *           type: string
 *           description: Idioma do filme
 *           example: "Inglês"
 *         situation:
 *           type: string
 *           enum: [upcoming, released, canceled]
 *           description: Situação do filme
 *           example: "released"
 *         synopsis:
 *           type: string
 *           description: Sinopse do filme
 *           example: "Após os eventos devastadores de Vingadores: Guerra Infinita..."
 *         popularity:
 *           type: integer
 *           description: Índice de popularidade
 *           example: 95
 *         votesQuantity:
 *           type: integer
 *           description: Quantidade de votos
 *           example: 1000000
 *         ratingPercentage:
 *           type: number
 *           description: Percentual de avaliação
 *           example: 94.5
 *         trailerUrl:
 *           type: string
 *           format: uri
 *           description: URL do trailer
 *           example: "https://www.youtube.com/watch?v=TcMBFSGVi1c"
 *         posterUrl:
 *           type: string
 *           format: uri
 *           description: URL do poster
 *           example: "https://example.com/poster.jpg"
 *         budget:
 *           type: integer
 *           description: Orçamento do filme
 *           example: 356000000
 *         revenue:
 *           type: integer
 *           description: Receita do filme
 *           example: 2797800564
 *         profit:
 *           type: integer
 *           description: Lucro do filme
 *           example: 2441800564
 *         releaseDate:
 *           type: string
 *           format: date-time
 *           description: Data de lançamento
 *           example: "2019-04-26T00:00:00.000Z"
 *         durationInMinutes:
 *           type: integer
 *           description: Duração em minutos
 *           example: 181
 *         genre:
 *           type: array
 *           items:
 *             type: string
 *           description: Gêneros do filme
 *           example: ["Ação", "Aventura", "Drama"]
 *         posterUuid:
 *           type: string
 *           format: uuid
 *           description: UUID do poster no storage
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         userUuid:
 *           type: string
 *           format: uuid
 *           description: UUID do usuário que criou o filme
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 */
export class UpdateMoviesDto {
  @IsStringPropertyDecorator({
    description: 'Título do filme em português',
    example: 'Vingadores: Ultimato',
    required: false,
  })
  title?: string;

  @IsStringPropertyDecorator({
    description: 'Título original do filme',
    example: 'Avengers: Endgame',
    required: false,
  })
  originalTitle?: string;

  @IsStringPropertyDecorator({
    description: 'Idioma do filme',
    example: 'Inglês',
    required: false,
  })
  language?: string;

  @IsEnumPropertyDecorator({
    description: 'Situação do filme',
    example: 'released',
    required: false,
    enum: MovieSituationEnum,
    enumName: 'MovieSituation',
  })
  situation?: MovieSituationEnum;

  @IsStringPropertyDecorator({
    description: 'Sinopse do filme',
    example: 'Após os eventos devastadores de Vingadores: Guerra Infinita...',
    required: false,
  })
  synopsis?: string;

  @IsIntPropertyDecorator({
    description: 'Índice de popularidade',
    example: 95,
    required: false,
  })
  popularity?: number;

  @IsIntPropertyDecorator({
    description: 'Quantidade de votos',
    example: 1000000,
    required: false,
  })
  votesQuantity?: number;

  @IsNumberPropertyDecorator({
    description: 'Percentual de avaliação',
    example: 94.5,
    required: false,
  })
  ratingPercentage?: number;

  @IsUrlPropertyDecorator({
    description: 'URL do trailer',
    example: 'https://www.youtube.com/watch?v=TcMBFSGVi1c',
    required: false,
  })
  trailerUrl?: string;

  @IsUrlPropertyDecorator({
    description: 'URL do poster',
    example: 'https://example.com/poster.jpg',
    required: false,
  })
  posterUrl?: string;

  @IsIntPropertyDecorator({
    description: 'Orçamento do filme',
    example: 356000000,
    required: false,
  })
  budget?: number;

  @IsIntPropertyDecorator({
    description: 'Receita do filme',
    example: 2797800564,
    required: false,
  })
  revenue?: number;

  @IsIntPropertyDecorator({
    description: 'Lucro do filme',
    example: 2441800564,
    required: false,
  })
  profit?: number;

  @IsDateStringPropertyDecorator({
    description: 'Data de lançamento',
    example: '2019-04-26T00:00:00.000Z',
    required: false,
  })
  releaseDate?: Date;

  @IsIntPropertyDecorator({
    description: 'Duração em minutos',
    example: 181,
    required: false,
  })
  durationInMinutes?: number;

  @IsStringPropertyDecorator({
    description: 'Gêneros do filme',
    example: ['Ação', 'Aventura', 'Drama'],
    required: false,
    isArray: true,
  })
  genre?: string[];

  @IsUUIDPropertyDecorator({
    description: 'UUID do poster no storage',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  posterUuid?: string;

  @IsUUIDPropertyDecorator({
    description: 'UUID do usuário que criou o filme',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false,
  })
  userUuid?: string;
}
