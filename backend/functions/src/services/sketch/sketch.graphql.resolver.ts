import { Sketch, SketchQueryParams } from './sketch.service.models';
import { getSketch, getSketches, createSketch, updateSketch } from './sketch.service';

interface SketchQueryArgs {
  params: SketchQueryParams;
}

interface CreateSketchArgs {
  sketch: Partial<Sketch>;
}

interface SketchUpdateArgs {
  sketchId: string;
  sketchUpdates: Partial<Sketch>;
}

export const sketchResolver = {
  Query: {
    getSketch: (root: any, { params }: SketchQueryArgs) => getSketch(params),
    getSketches: (root: any, { params }: SketchQueryArgs) => getSketches(params)
  },
  Mutation: {
    createSketch: (root: any, { sketch }: CreateSketchArgs) => createSketch(sketch),
    updateSketch: (root: any, args: SketchUpdateArgs) => updateSketch(args.sketchId, args.sketchUpdates)
  }
};
