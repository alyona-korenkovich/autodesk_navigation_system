import Node from 'Pathfinder/core/Node';

describe('Node', () => {
  it('should create a node with the correct properties', () => {
    const node = new Node({
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
    });

    expect(node.x).toBe(0);
    expect(node.y).toBe(0);
    expect(node.type).toBe(0);
    expect(node.isBlocked).toBe(false);
    expect(node.f).toBe(0);
    expect(node.g).toBe(0);
    expect(node.h).toBe(0);
    expect(node.opened).toBe(false);
    expect(node.closed).toBe(false);
    expect(node.parent).toBe(null);
  });
});
