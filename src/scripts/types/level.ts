export interface LevelData {
  platforms: Platform[];
  fireEnemies?: Position[];
  player: Position;
  goal: Position;
}

export interface Position {
  x: number;
  y: number;
}

export interface Platform extends Position {
  numTiles: number;
  key: string;
}
