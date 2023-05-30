import { TNode } from 'Pathfinder/core/types';

class Node {
  x: number;
  y: number;
  type: number; // see types.ts -> enum EndTypes
  isBlocked: boolean;
  f: number;
  g: number;
  h: number;
  opened: boolean;
  closed: boolean;
  parent: TNode | null;

  constructor({
    x,
    y,
    type,
    isBlocked,
    f,
    g,
    h,
    opened,
    closed,
    parent,
  }: TNode) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.isBlocked = isBlocked;
    this.f = f;
    this.g = g;
    this.h = h;
    this.opened = opened;
    this.closed = closed;
    this.parent = parent;
  }
}

export default Node;
