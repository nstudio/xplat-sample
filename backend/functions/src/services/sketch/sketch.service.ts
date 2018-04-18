import { queryCollection, addToCollection, updateDocInCollection, deleteDocFromCollection, deleteDocsFromCollection } from '../../helpers';
import { Sketch, SketchQueryParams } from './Sketch.service.models';

export async function createSketch(sketchData: Partial<Sketch>): Promise<Sketch> {
  return await addToCollection('sketch', sketchData);
}

export async function updateSketch(sketchId: string, sketchUpdates: Partial<Sketch>): Promise<Sketch> {
  return await updateDocInCollection('sketch', sketchId, sketchUpdates);
}

export async function getSketch(params: SketchQueryParams): Promise<Sketch> {
  const Sketches = (await queryCollection('sketch', params)) || [];
  return Sketches[0];
}

export async function getSketches(params: SketchQueryParams): Promise<Sketch[]> {
  return queryCollection('sketch', params);
}

export async function deleteSketch(id: string) {
  return deleteDocFromCollection('sketch', id);
}

export async function deleteSketches(params: SketchQueryParams) {
  return deleteDocsFromCollection('sketch', params);
}
