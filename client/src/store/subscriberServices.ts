import { BehaviorSubject } from 'rxjs';

const selectionSubscriber = new BehaviorSubject('');
const datalistSubscriber = new BehaviorSubject([]);
const pathfinderInitials = new BehaviorSubject(null);
const pathsSubscriber = new BehaviorSubject([]);
const visualizePathIndex = new BehaviorSubject(0);

export {
  datalistSubscriber,
  pathfinderInitials,
  selectionSubscriber,
  pathsSubscriber,
  visualizePathIndex,
};
