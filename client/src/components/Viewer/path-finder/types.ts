export type Level = number[][];

export const LevelDesignations = {
  0: 'non-walkable',
  1: 'walkable',
  2: 'doors',
  3: 'entrances',
  4: 'stairs',
  5: 'elevators',
  6: 'intersection'
};
export type Mode = 'general' | 'emergency';
export type Point = {
  x: number;
  y: number;
  z: number;
  levelNumber: number;
};

export type TPath = {
  path: number[][];
  length: number;
};
