import { gatheringSeedData, loveSeedData, sketchSeedData, tagSeedData, userSeedData } from './dataload.data';
import {
  createGathering,
  getGatherings,
  deleteGatherings,
  createLove,
  getLoves,
  deleteLoves,
  createSketch,
  getSketches,
  deleteSketches,
  createTag,
  getTags,
  deleteTags,
  createUser,
  getUsers,
  deleteUsers
} from '../../services';

export interface DataLoad {
  data: any;
  create: Function;
  get: Function;
  del: Function;
}

export interface DataLoadMap {
  [key: string]: DataLoad;
}

export const DATALOAD_MAP: DataLoadMap = {
  gathering: {
    data: gatheringSeedData,
    create: createGathering,
    get: getGatherings,
    del: deleteGatherings
  },
  love: {
    data: loveSeedData,
    create: createLove,
    get: getLoves,
    del: deleteLoves
  },
  sketch: {
    data: sketchSeedData,
    create: createSketch,
    get: getSketches,
    del: deleteSketches
  },
  tag: {
    data: tagSeedData,
    create: createTag,
    get: getTags,
    del: deleteTags
  },
  user: {
    data: userSeedData,
    create: createUser,
    get: getUsers,
    del: deleteUsers
  }
};
