import Tool from '../tool';

export default class Fists extends Tool {
  constructor(game) {
    super(game, 'fist', 'fists');
    this.duration = 20;
    this.action = "Punch a tree";
    this.color = "green";
  }

  render(type) {
    if(!this.unlocked) return;

    if(type == 'tool') {
      return; // don't show fists in tool list lol
    }

    return super.render(type);
  }

  activate() {
    this.game.addItems('wood', 1);
    if(Math.random() > 0.9) this.game.addItems('leaf', 1);
  }
}