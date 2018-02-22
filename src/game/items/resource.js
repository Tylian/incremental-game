import { h } from 'picodom';
import Item from './item';

import './resource.scss';

export default class Resource extends Item {
  constructor(game, singular, plural = singular) {
    super(game, singular, plural);
    this.color = "black";
    this.type = "resource";
    this.tasks = [];
  }

  addTasks(...tasks) {
    this.tasks = tasks;
    for(let task of this.tasks) {
      task.game = this.game;
      task.parent = this;
    }
  }

  render(type) {
    if(!this.unlocked) return;

    if(type == 'resource') {
      return (<div class="resource" style={{ color: this.color}}>
        {this.amount} {this.name}
        {this.renderTasks()}
      </div>);
    }

    return super.render(type);
  }

  renderTasks() {
    return this.tasks.map(s => s.render());
  }
}