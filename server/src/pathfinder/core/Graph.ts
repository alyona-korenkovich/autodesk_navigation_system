import Node from 'Pathfinder/core/Node';

class Graph {
  width: number;

  height: number;

  nodes: Node[][];

  constructor(matrix: number[][]) {
    if (this.#validateMatrix(matrix)) {
      this.height = matrix.length;
      this.width = matrix[0].length;
      this.nodes = this.#processMatrix(matrix);
    } else {
      throw new Error(
        'Something went wrong. Matrix is not a valid floor projection',
      );
    }
  }

  /**
   * Check if matrix is a valid floor projection
   * @return {boolean} matrixIsValid
   */
  #validateMatrix = (matrix: number[][]) => {
    for (let row = 1; row < matrix.length; row++) {
      if (matrix[row].length !== matrix[row - 1].length) {
        return false;
      }
    }
    return true;
  };

  /**
   * Turn the regular matrix to the matrix of Points.
   * @private
   * @param {number[][]} matrix
   * @return {Node[][]} processedMatrix
   */
  #processMatrix = (matrix: number[][]) => {
    const points: Node[][] = [...new Array(this.height)].map(() =>
      [...new Array(this.width)].map(
        () =>
          new Node({
            x: 0,
            y: 0,
            type: 0,
            isBlocked: false,
            f: 0,
            g: 0,
            h: 0,
            opened: false,
            closed: false,
            parent: null,
          }),
      ),
    );

    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        const point = points[i][j];

        point.y = i;
        point.x = j;
        point.type = matrix[i][j];

        // see types.ts in client's viewer component
        if (matrix[i][j] === 0 || matrix[i][j] === 6) {
          point.isBlocked = true;
        }
      }
    }

    // console.log('nodes', points);
    return points;
  };

  /**
   * Get node at (x, y);
   * @param x
   * @param y
   * @return {Node} node
   */
  getNode = (x: number, y: number) => {
    if (this.isValid(x, y)) {
      return this.nodes[y][x];
    }
    return undefined;
  };

  /**
   * One can walk on a given grid cell
   * @param x
   * @param y
   * @private
   */
  isAvailable = (x: number, y: number) => {
    const pointsIsValid = this.isValid(x, y);
    let pointIsBlocked;
    if (pointsIsValid) {
      const point = this.getNode(x, y);
      if (point) {
        pointIsBlocked = point.isBlocked;
      }
    }
    return pointsIsValid && !pointIsBlocked;
  };

  isValid = (x: number, y: number) => {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  };

  /**
   * +---+---+---+
   * | 0 | 1 | 2 |
   * +---+---+---+
   * | 3 | N | 5 |
   * +---+---+---+
   * | 6 | 7 | 8 |
   * +---+---+---+
   *
   * @param {Node} node
   * @return {Node[]} neighbours
   * @private
   */
  getNeighbours = (node: Node) => {
    const neighbours: Node[] = [];
    // Check top, right, bottom, and left neighbours
    for (let cell = 1; cell < 9; cell += 2) {
      this.#checkStraightNeighbour(cell, node, neighbours);
    }
    // Check top-left, top-right, bottom-left, bottom-right neighbours
    for (let cell = 0; cell < 9; cell += 2) {
      this.#checkDiagonalNeighbour(cell, node, neighbours);
    }
    return neighbours;
  };

  #checkStraightNeighbour = (index: number, node: Node, neighbours: Node[]) => {
    let x, y;

    switch (index) {
      case 1: {
        x = node.x;
        y = node.y - 1;
        break;
      }
      case 3: {
        x = node.x - 1;
        y = node.y;
        break;
      }
      case 5: {
        x = node.x + 1;
        y = node.y;
        break;
      }
      case 7: {
        x = node.x;
        y = node.y + 1;
        break;
      }
      default:
        return;
    }

    if (this.isValid(x, y)) {
      if (this.isAvailable(x, y)) {
        neighbours.push(this.nodes[y][x]);
      }
    }
  };

  #checkDiagonalNeighbour = (index: number, node: Node, neighbours: Node[]) => {
    let x, y;

    switch (index) {
      case 0: {
        x = node.x - 1;
        y = node.y - 1;
        break;
      }
      case 2: {
        x = node.x + 1;
        y = node.y - 1;
        break;
      }
      case 6: {
        x = node.x - 1;
        y = node.y + 1;
        break;
      }
      case 8: {
        x = node.x + 1;
        y = node.y + 1;
        break;
      }
      default:
        return;
    }

    if (this.isValid(x, y)) {
      if (this.isAvailable(x, y)) {
        neighbours.push(this.nodes[y][x]);
      }
    }
  };
}

export default Graph;
