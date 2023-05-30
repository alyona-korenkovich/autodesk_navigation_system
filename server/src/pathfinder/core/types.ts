export type TNode = {
  x: number;
  y: number;
  type: number;
  isBlocked: boolean;
  f: number;
  g: number;
  h: number;
  opened: boolean;
  closed: boolean;
  parent: TNode | null;
};

export enum EndTypes {
  INSIDE_DOORS = 2,
  ENTRANCES = 3,
  STAIRS = 4,
}

export type TEndType = keyof typeof EndTypes;
