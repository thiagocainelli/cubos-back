import { CreateMoviesService } from './services/create.service';
import { ListMoviesService } from './services/list.service';
import { ViewMoviesService } from './services/view.service';
import { UpdateMoviesService } from './services/update.service';
import { DeleteMoviesService } from './services/delete.service';

export class MoviesService {
  static async create(createMoviesDto: any) {
    return await CreateMoviesService.execute(createMoviesDto);
  }

  static async list(
    page: number,
    itemsPerPage: number,
    search?: string,
    situation?: string,
    genre?: string,
    durationStart?: number,
    durationEnd?: number,
    releaseStart?: Date,
    releaseEnd?: Date,
  ) {
    return await ListMoviesService.execute(
      page,
      itemsPerPage,
      search,
      situation,
      genre,
      durationStart,
      durationEnd,
      releaseStart,
      releaseEnd,
    );
  }

  static async view(movieUuid: string) {
    return await ViewMoviesService.execute(movieUuid);
  }

  static async update(movieUuid: string, updateMoviesDto: any) {
    return await UpdateMoviesService.execute(movieUuid, updateMoviesDto);
  }

  static async delete(movieUuid: string) {
    return await DeleteMoviesService.execute(movieUuid);
  }
}
