import { Sprites } from './Sprites';

export interface TileSize {
  [key: string]: {
    width: number;
    height: number;
  };
}

export const TILES_SIZE: TileSize = {
  [Sprites.Block]: {
    width: 36,
    height: 30,
  },
};
