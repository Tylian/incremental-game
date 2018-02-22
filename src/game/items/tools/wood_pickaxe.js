import Tool from '../tool';
import MachineCraft from '../tasks/machine_craft';

export default class WoodPickaxe extends Tool {
  constructor(game) {
    super(game, 'Wood Pickaxe', 'Wood Pickaxes');
    this.duration = 20;
    this.action = "Mine stone";
    this.color = '#875928';
    this.durability = 10

    this.craft = new MachineCraft('crafting_table', 10, {
      'plank': 3,
      'stick': 2
    }, {
      'wood_pickaxe': 1
    });
  
    this.addTasks(this.craft);
  }

  activate() {
    this.game.addItems('stone', 1);
  }

  tick() {
    if(this.craft.enabled) {
      this.unlocked = true;
    }

    super.tick();
  }
}