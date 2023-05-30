//@ts-nocheck

class ObjectTree {
  objectTree: Autodesk.Viewing.InstanceTree;

  constructor(instanceTree: Autodesk.Viewing.InstanceTree) {
    this.objectTree = instanceTree;
  }

  getBoundingBox = (dbId: number) => {
    let tmp = new Float32Array(6);
    this.objectTree.getNodeBox(dbId, tmp);

    let nodeBox = new THREE.Box3();
    [nodeBox.min.x, nodeBox.min.y, nodeBox.min.z, nodeBox.max.x, nodeBox.max.y, nodeBox.max.z] =
      tmp;

    return nodeBox;
  };

  getAllObjectIds() {
    return Object.keys(this.objectTree.nodeAccess.dbIdToIndex).map((i) => Number(i));
  }

  getNames = (dbIds: number[]) => {
    const res = [];
    for (let dbId of dbIds) {
      const currName = this.objectTree.getNodeName(dbId);
      res.push(currName);
    }
    return res;
  };
}

export default ObjectTree;
