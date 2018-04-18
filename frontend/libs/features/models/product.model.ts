import { environment } from '@sketchpoints/core';

let suffix = '';
if (environment.dev) {
  suffix = 'testing';
}

export interface IArtistProducts {
  artisttag1?: string; // artist ability to live sketch for a single tag
}
export interface IViewerProducts {
  coinsp?: string; // .99
  coinspgold?: string; // 2.99 (3 pack)
  coinspplus?: string; // 3.99 (5 pack)
  coinspplatinum?: string; // 4.99 (10 pack)
}
export interface IProducts {
  artist?: IArtistProducts;
  viewer?: IViewerProducts;
}

export const purchaseProducts = {
  artist: {
    artisttag1: `artisttag1${suffix}`
  },
  viewer: {
    coinsp: `coinsp${suffix}`,
    coinspgold: `coinspgold${suffix}`, // 3 pack
    coinspplus: `coinspplus${suffix}`, // 5 pack
    coinspplatinum: `coinspplatinum${suffix}` // 10 pack
  }
};

export function getAppProducts(): IViewerProducts | IArtistProducts {
  return environment.isArtist ? purchaseProducts.artist : purchaseProducts.viewer;
}
