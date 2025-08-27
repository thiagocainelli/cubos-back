import { createRepresentativesService } from './services/representatives/createRepresentatives.service';
import { listRepresentativesService } from './services/representatives/listRepresentatives.service';
import { updateRepresentativesService } from './services/representatives/updateRepresentatives.service';
import { viewRepresentativesService } from './services/representatives/viewRepresentatives.service';
import { deleteRepresentativesService } from './services/representatives/deleteRepresentatives.service';

export const RepresentativesService = {
  create: createRepresentativesService,
  list: listRepresentativesService,
  update: updateRepresentativesService,
  view: viewRepresentativesService,
  delete: deleteRepresentativesService,
}; 