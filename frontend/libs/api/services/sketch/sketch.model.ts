export interface SketchFrame {
  url: string;
  streamTime?: number;
  createDate?: Date;
}

export interface SketchPage {
  sketchFrames?: SketchFrame[];
  createDate?: Date;
  completed?: boolean;
}

export interface Sketch {
  id?: string;
  gifUrl?: string;
  movUrl?: string;
  streamTime?: number;
  userId?: string;
  gatheringId?: string;
  gatheringName?: string;
  artistName?: string;
  sketchPages?: SketchPage[];
  createDate?: Date;
}

export interface SketchQueryParams {
  match?: Partial<Sketch>;
  limit?: number;
}

// utilities
export function latestSketchFrame(page: SketchPage) {
  if (page && page.sketchFrames && page.sketchFrames.length) {
    return page.sketchFrames[page.sketchFrames.length - 1].url;
  }
  return null;
}

export function latestFrame(sketch: Sketch) {
  if (sketch && sketch.sketchPages && sketch.sketchPages.length) {
    const page = sketch.sketchPages[sketch.sketchPages.length - 1];
    if (page && page.sketchFrames && page.sketchFrames.length) {
      return page.sketchFrames[page.sketchFrames.length - 1].url;
    }
  }
  return null;
}
