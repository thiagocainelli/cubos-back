import prisma from '../../_core/prisma.pg';
import { ReadMoviesDto } from '../dtos/readMovies.dto';
import { MovieSituationEnum } from '../enum/movieSituation.enum';

export const getMoviesReleasedToday = async (): Promise<ReadMoviesDto[]> => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );

    const movies = await prisma.movies.findMany({
      where: {
        releaseDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
        deletedAt: null,
      },
      select: {
        uuid: true,
        title: true,
        genre: true,
        situation: true,
        releaseDate: true,
        ratingPercentage: true,
        posterUrl: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    const moviesDto: ReadMoviesDto[] = movies.map((movie) => ({
      uuid: movie.uuid,
      title: movie.title,
      genre: movie.genre,
      situation: movie.situation as MovieSituationEnum | undefined,
      releaseDate: movie.releaseDate || undefined,
      ratingPercentage: movie.ratingPercentage || undefined,
      posterUrl: movie.posterUrl || undefined,
      createdAt: movie.createdAt,
      updatedAt: movie.updatedAt,
      deletedAt: movie.deletedAt || undefined,
    }));

    return moviesDto;
  } catch (error) {
    console.error('Erro ao buscar filmes lançados hoje:', error);
    throw new Error('Erro ao buscar filmes lançados hoje');
  }
};
