import { Action } from '@ngrx/store';
import { Tag, Gathering, Sketch, Love } from '@sketchpoints/api';
import { TagState } from './tag.state';

export namespace TagActions {
  export enum Types {
    INIT = '[@sketchpoints/tags] Init',
    FETCH_TAGS = '[@sketchpoints/tags] Fetch Tags',
    SELECT_TAG = '[@sketchpoints/tags] Select Tag',
    FETCH_GATHERINGS = '[@sketchpoints/tags] Fetch Gatherings',
    SELECT_GATHERING = '[@sketchpoints/tags] Select Gathering',
    UPDATE_GATHERING = '[@sketchpoints/tags] Update Gathering',
    GET_SKETCH = '[@sketchpoints/tags] Get Sketch',
    GET_SKETCHES = '[@sketchpoints/tags] Get Sketches',
    CREATE_SKETCH = '[@sketchpoints/tags] Create Sketch',
    UPDATE_SKETCH = '[@sketchpoints/tags] Update Sketch',
    RESET_SKETCH = '[@sketchpoints/tags] Reset Sketch',
    GET_LOVE = '[@sketchpoints/tags] Get Love',
    GET_LOVES = '[@sketchpoints/tags] Get Loves',
    CREATE_LOVE = '[@sketchpoints/tags] Create Love',
    UPDATE_LOVE = '[@sketchpoints/tags] Update Love',
    API_ERROR = '[@sketchpoints/tags] Api error',
    CHANGED = '[@sketchpoints/tags] Changed'
  }

  export class Init implements Action {
    readonly type = Types.INIT;
  }

  export class FetchTags implements Action {
    readonly type = Types.FETCH_TAGS;
    constructor(public payload?: { limit?: number; offset?: number; force?: boolean }) {}
  }

  export class SelectTag implements Action {
    readonly type = Types.SELECT_TAG;
    constructor(public payload: string /* slug */) {}
  }

  export class FetchGatherings implements Action {
    readonly type = Types.FETCH_GATHERINGS;
    constructor(public payload: { tag: Tag; force?: boolean }) {}
  }

  export class SelectGathering implements Action {
    readonly type = Types.SELECT_GATHERING;
    constructor(public payload: string /* slug */) {}
  }

  export class UpdateGathering implements Action {
    readonly type = Types.UPDATE_GATHERING;
    constructor(public payload: { tagId: number; gathering: Gathering }) {}
  }

  export class GetSketch implements Action {
    readonly type = Types.GET_SKETCH;
    constructor(public payload: { userId: string; gatheringId: string }) {}
  }

  export class GetSketches implements Action {
    readonly type = Types.GET_SKETCHES;
    constructor(public payload: string /* gatheringId */) {}
  }

  export class CreateSketch implements Action {
    readonly type = Types.CREATE_SKETCH;
    constructor(public payload: Sketch) {}
  }

  export class UpdateSketch implements Action {
    readonly type = Types.UPDATE_SKETCH;
    constructor(public payload: Sketch) {}
  }

  export class ResetSketch implements Action {
    readonly type = Types.RESET_SKETCH;
  }

  export class GetLove implements Action {
    readonly type = Types.GET_LOVE;
    constructor(public payload: Love) {}
  }

  export class GetLoves implements Action {
    readonly type = Types.GET_LOVES;
    constructor(public payload?: number /* limit */) {}
  }

  export class CreateLove implements Action {
    readonly type = Types.CREATE_LOVE;
    constructor(public payload: Love) {}
  }

  export class UpdateLove implements Action {
    readonly type = Types.UPDATE_LOVE;
    constructor(public payload: Love) {}
  }

  export class ApiError implements Action {
    readonly type = Types.API_ERROR;
    constructor(public payload: any) {}
  }

  export class Changed implements Action {
    readonly type = Types.CHANGED;
    constructor(public payload: TagState.IState) {}
  }

  export type Actions = SelectTag | SelectGathering | UpdateGathering | Changed;
}
