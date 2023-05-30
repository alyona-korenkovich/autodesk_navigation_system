import { EndTypes, TEndType } from 'Pathfinder/core/types';

export const chebyshev = (dx: number, dy: number): number => {
  return Math.max(dx, dy);
};

export const isEndType = (nodeType: number) => {
  return [EndTypes.INSIDE_DOORS, EndTypes.ENTRANCES, EndTypes.STAIRS].includes(
    nodeType as EndTypes,
  );
};

export const matchesEndType = (nodeType: number, endType: TEndType) => {
  return (
    Object.keys(EndTypes).find((endTypeString) => {
      const endTypeNumber = EndTypes[endTypeString as keyof typeof EndTypes];
      return endTypeNumber === nodeType && endTypeString === endType;
    }) !== undefined
  );
};
