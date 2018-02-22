import Machine from '../machine';
import Craft from '../tasks/craft';

export default class CraftingTable extends Machine {
  constructor(game) {
    super(game, 'crafting table', 'crafting tables');
    this.color = '#b7834b';
    this.tags.add('crafting_table');

    this.craft = new Craft({
        'plank': 4
      }, {
        'crafting_table': 1
      });

    this.addTasks(this.craft);
  }

  tick() {
    if(this.craft.enabled) {
      this.unlocked = true;
    }
    super.tick();
  }
}