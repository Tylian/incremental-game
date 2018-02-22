import Resource from '../resource';
import Craft from '../tasks/craft';

export default class Sticks extends Resource {
  constructor(game) {
    super(game, 'stick', 'sticks');
    this.color = '#b7834b';

    this.craft = new Craft({
      'plank': 2
    }, {
      'stick': 4
    });

    this.addTasks(this.craft);
  }

  tick() {
    if(this.craft.enabled) {
      this.unlocked = true;
    }
  }
}