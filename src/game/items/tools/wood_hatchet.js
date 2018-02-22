import Tool from '../tool';
import MachineCraft from '../tasks/machine_craft';

export default class WoodHatchet extends Tool {
  constructor(game) {
    super(game, 'Wood Hatchet', 'Wood Hatchets');
    this.duration = 14;
    this.action = "Chop a tree";
    this.color = '#875928';
    this.durability = 10

    this.craft = new MachineCraft('crafting_table', 10, {
      'plank': 3,
      'stick': 2
    },{
      'wood_hatchet': 1
    });
  
    this.addTasks(this.craft);
  }

  activate() {
    this.game.addItems('wood', 1);
    if(Math.random() > 0.9) {
      this.game.addItems('leaf', 1);
    }
  }

  tick() {
    if(this.craft.enabled) {
      this.unlocked = true;
    }

    super.tick();
  }
}