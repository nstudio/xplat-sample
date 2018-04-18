import { Sketch } from '@sketchpoints/api';

export const DEFAULT_SKETCH_IMAGE_URL =
  'https://firebasestorage.googleapis.com/v0/b/' +
  'sketchpoints-c5004.appspot.com/o/app-assets%2Fwait-artist.png?alt=media';

export function getSketchImageUrl(sketch: Sketch = {}) {
  const sketchPages = sketch.sketchPages || [];
  const sketchFrames = (sketchPages.length && sketchPages[0].sketchFrames) || [];
  const lastSketchFrame = sketchFrames.length && sketchFrames[sketchFrames.length - 1];
  return lastSketchFrame.url || DEFAULT_SKETCH_IMAGE_URL;
}
