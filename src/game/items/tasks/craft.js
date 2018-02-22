import Task from './task';

export default class Craft extends Task {
  constructor(input, output) {
    super();
    this.input = input;
    this.output = output;
    this.icon = 'plus';
  }

  get enabled() {
    for(let [name, cost] of Object.entries(this.input)) {
      if(!this.game.hasItems(name, cost)) {
        return false;
      }
    }
    return true;
  }

  activate() {
    for(let [name, cost] of Object.entries(this.input)) {
      this.game.removeItems(name, cost);
    }
    for(let [name, amount] of Object.entries(this.output)) {
      this.game.addItems(name, amount);
    }
  }
}