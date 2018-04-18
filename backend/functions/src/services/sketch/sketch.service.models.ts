export interface Sketch {
  id?: string;
  gifUrl?: string;
  movUrl?: string;
  streamTime?: number;
  userId?: string;
  gatheringId?: string;
  artistName?: string;
  gatheringName?: string;
  sketchPages?: SketchPage[];
  createDate?: Date;
}

export interface SketchPage {
  sketchFrames?: SketchFrame[];
  createDate?: Date;
  completed?: boolean;
}

export interface SketchFrame {
  url: string;
  streamTime?: number;
  createDate?: Date;
}

export interface SketchQueryParams {
  match?: Partial<Sketch>;
  limit?: number;
}
