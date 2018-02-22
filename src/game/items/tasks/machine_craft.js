import Task from './task';

export default class MachineCraft extends Task {
  constructor(machine, duration, input, output) {
    super();
    this.machine = machine;
    this.duration = duration;
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
    return this.findMachine() != undefined;
  }

  findMachine() {
    for(let [key, item] of this.game.items.entries()) {
      if(item.tags.has(this.machine) && !item.busy) {
        return item;
      }
    }
    return undefined;
  }

  activate() {
    let machine = this.findMachine();
    if(machine !== undefined && machine.queueWork(this)) {
      for(let [name, cost] of Object.entries(this.input)) {
        this.game.removeItems(name, cost);
      }
    }
  }

  finish() {
    for(let [name, amount] of Object.entries(this.output)) {
      this.game.addItems(name, amount);
    }
  }
}