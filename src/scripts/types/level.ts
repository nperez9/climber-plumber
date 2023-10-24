export interface LevelData {
  platforms: Platform[];
  fireEnemies?: Position[];
  player: Position;
  goal: Position;
  world: World;
  spawner: Spawner;
}

export interface Position {
  x: number;
  y: number;
}

export interface Platform extends Position {
  numTiles: number;
  key: string;
}

export interface Spawner {
  interval: number;
  speed: number;
  lifespan: number;
}

export interface World {
  height: number;
  width: number;
}
