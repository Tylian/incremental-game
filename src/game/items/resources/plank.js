import Resource from '../resource';
import Craft from '../tasks/craft';

export default class Plank extends Resource {
  constructor(game) {
    super(game, 'plank', 'planks');
    this.color = '#b7834b';

    this.craft = new Craft({
      'wood': 1
    }, {
      'plank': 4
    });

    this.addTasks(this.craft);
  }

  tick() {
    if(this.craft.enabled) {
      this.unlocked = true;
    }
  }
}