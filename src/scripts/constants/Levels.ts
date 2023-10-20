import { Sprites } from './Sprites';

export enum LEVELS {
  One = 'ONE',
}

export const level1 = {
  platforms: [
    {
      x: 150,
      y: 450,
      numTiles: 6,
      key: Sprites.Block,
    },
    {
      x: 0,
      y: 330,
      numTiles: 8,
      key: Sprites.Block,
    },
    {
      x: 72,
      y: 210,
      numTiles: 8,
      key: Sprites.Block,
    },
    {
      x: 0,
      y: 90,
      numTiles: 7,
      key: Sprites.Block,
    },
    {
      x: 0,
      y: 560,
      numTiles: 1, // if 1 create sprite < 1 a tileset
      key: Sprites.Ground,
    },
  ],
};
