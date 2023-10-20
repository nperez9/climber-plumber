export interface LevelData {
  platforms: Platforms[];
}

export interface Platforms {
  x: number;
  y: number;
  numTiles: number;
  key: string;
}
