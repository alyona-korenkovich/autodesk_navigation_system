import Graph from 'Pathfinder/core/Graph';

describe('Graph', () => {
  describe('constructor', () => {
    it('should create a graph with the correct width, height, and nodes', () => {
      const matrix = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 1, 0],
      ];
      const graph = new Graph(matrix);
      expect(graph.width).toBe(3);
      expect(graph.height).toBe(3);
      expect(graph.nodes.length).toBe(3);
      expect(graph.nodes[0].length).toBe(3);
      expect(graph.nodes[1].length).toBe(3);
      expect(graph.nodes[2].length).toBe(3);
      expect(graph.nodes[0][0].type).toBe(0);
      expect(graph.nodes[0][1].type).toBe(1);
      expect(graph.nodes[0][2].type).toBe(2);
      expect(graph.nodes[1][0].type).toBe(3);
      expect(graph.nodes[1][1].type).toBe(4);
      expect(graph.nodes[1][2].type).toBe(5);
      expect(graph.nodes[2][0].type).toBe(6);
      expect(graph.nodes[2][1].type).toBe(1);
      expect(graph.nodes[2][2].type).toBe(0);
    });

    it('should throw an error if the matrix is not a valid floor projection', () => {
      const matrix = [
        [0, 1, 0],
        [1, 1],
        [0, 1, 0],
      ];
      expect(() => new Graph(matrix)).toThrow();
    });
  });

  describe('getNode', () => {
    it('should return the correct node at (x, y)', () => {
      const matrix = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
      const graph = new Graph(matrix);
      const node = graph.getNode(1, 1);
      expect(node.type).toBe(1);
    });

    it('should return undefined if (x, y) is outside the graph', () => {
      const matrix = [
        [0, 1, 0],
        [1, 1, 1],
        [0, 1, 0],
      ];
      const graph = new Graph(matrix);
      const node1 = graph.getNode(-1, 1);
      const node2 = graph.getNode(1, 3);
      const node3 = graph.getNode(3, 2);
      expect(node1).toBeUndefined();
      expect(node2).toBeUndefined();
      expect(node3).toBeUndefined();
    });
  });

  describe('isAvailable', () => {
    const matrix = [
      [1, 1, 1],
      [0, 1, 0],
      [1, 1, 1],
    ];
    const graph = new Graph(matrix);

    it('should return true if the point is valid and not blocked', () => {
      expect(graph.isAvailable(1, 0)).toBe(true);
    });

    it('should return false if the point is not valid', () => {
      expect(graph.isAvailable(-1, 0)).toBe(false);
    });

    it('should return false if the point is blocked', () => {
      expect(graph.isAvailable(0, 1)).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true when given valid coordinates', () => {
      const matrix = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];
      const graph = new Graph(matrix);
      expect(graph.isValid(0, 0)).toBe(true);
      expect(graph.isValid(1, 1)).toBe(true);
      expect(graph.isValid(2, 2)).toBe(true);
    });

    it('should return false when given invalid coordinates', () => {
      const matrix = [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0],
      ];
      const graph = new Graph(matrix);
      expect(graph.isValid(-1, 0)).toBe(false);
      expect(graph.isValid(0, -1)).toBe(false);
      expect(graph.isValid(3, 0)).toBe(false);
      expect(graph.isValid(0, 3)).toBe(false);
      expect(graph.isValid(3, 3)).toBe(false);
    });
  });

  describe('Graph.getNeighbours', () => {
    const matrix = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0],
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ];
    const graph = new Graph(matrix);

    it('returns the correct neighbours for a node in the middle of the graph', () => {
      const node = graph.getNode(2, 2);
      const neighbours = graph.getNeighbours(node);
      expect(neighbours).toHaveLength(8);
      expect(neighbours).toContainEqual(graph.getNode(1, 1));
      expect(neighbours).toContainEqual(graph.getNode(2, 1));
      expect(neighbours).toContainEqual(graph.getNode(3, 1));
      expect(neighbours).toContainEqual(graph.getNode(1, 2));
      expect(neighbours).toContainEqual(graph.getNode(3, 2));
      expect(neighbours).toContainEqual(graph.getNode(1, 3));
      expect(neighbours).toContainEqual(graph.getNode(2, 3));
      expect(neighbours).toContainEqual(graph.getNode(3, 3));
    });

    it('returns the available neighbours for a node on the top left of the graph', () => {
      const matrix = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];
      const graph = new Graph(matrix);
      const node = graph.getNode(0, 0);
      const neighbours = graph.getNeighbours(node);
      expect(neighbours).toHaveLength(1);
      expect(neighbours).toContain(graph.getNode(1, 1));
    });

    it('returns the available neighbours for a node on the bottom right of the graph', () => {
      const matrix = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];
      const graph = new Graph(matrix);
      const node = graph.getNode(4, 4);
      const neighbours = graph.getNeighbours(node);
      expect(neighbours).toHaveLength(1);
      expect(neighbours).toContain(graph.getNode(3, 3));
    });

    it('returns the available neighbours for a node in the center', () => {
      const matrix = [
        [0, 0, 0, 0, 0],
        [0, 1, 1, 1, 0],
        [0, 1, 0, 1, 0],
        [0, 1, 1, 1, 0],
        [0, 0, 0, 0, 0],
      ];
      const graph = new Graph(matrix);
      const node = graph.getNode(2, 2);
      const neighbours = graph.getNeighbours(node);
      expect(neighbours).toHaveLength(8);
      expect(neighbours).toContain(graph.getNode(1, 1));
      expect(neighbours).toContain(graph.getNode(1, 2));
      expect(neighbours).toContain(graph.getNode(1, 3));
      expect(neighbours).toContain(graph.getNode(2, 1));
      expect(neighbours).toContain(graph.getNode(2, 3));
      expect(neighbours).toContain(graph.getNode(3, 1));
      expect(neighbours).toContain(graph.getNode(3, 2));
      expect(neighbours).toContain(graph.getNode(3, 3));
    });
  });
});
