import { h } from 'picodom';
import Resource from './resource';

import './tool.scss';

export default class Tool extends Resource {
  constructor(game, singular, plural = singular) {
    super(game, singular, plural);
    this.color = "#ddd";
    this.type = "tool";
    this.duration = 20;
    this.remaining = -1;
    this.action = "Do thing";
    this.damage = 0;
    this.durability = -1;
  }

  get enabled() {
    return this.remaining == -1;
  }

  tick() {
    if(this.remaining == -1) return;
    if(this.remaining == 0) { 
      this.activate();
      this.damage++
    }
    if(this.durability > -1 && this.damage >= this.durability) {
      this.game.removeItems(this.id, 1);
      this.damage = 0;
    }
    this.remaining--;
  }

  render(type) {
    if(!this.unlocked) return;

    if(type == 'main') {
      if(!this.amount > 0) return;
      return (<button class="action"
        style={{ backgroundColor: this.color }}
        disabled={!this.enabled}
        onclick={() => { this.remaining = this.disabled ? -1 : this.duration; }}>
        <div class="action-progress" style={{ width: `${(1 - this.progress('action')) * 100}%` } }></div>
        <span>{this.action}</span>
    </button>);
    } else if(type == 'tool') {
      return (<div class="tool" style={{ color: this.color }}>
        {this.amount} {this.name}
        {this.renderTasks()}
        <div class="progress-bar" style={{ width: `${(this.progress('durability')) * 100}%`, backgroundColor: this.color }}></div>
      </div>);
    } else if (type == 'resource') {
      return;
    }
    
    return super.render(type);
  }

  progress(type) {
    switch(type) {
      case 'durability':
        if(this.durability == -1 || this.amount == 0) return 0;
        return 1 - (this.damage / this.durability);
      case 'action':
        if(this.remaining == -1) return 1;
        return 1 - (this.remaining / this.duration);
    }
    return 0;
  }

  save() {
    let obj = super.save();
    if(this.damage > 0) obj.damage = this.damage;
    if(this.remaining > -1) obj.remaining = this.remaining;

    return obj;
  }

  load(obj) {
    this.damage = this._def(obj.damage, 0);
    this.remaining = this._def(obj.remaining, -1);
    super.load(obj);
  }
}