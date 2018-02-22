import { h } from 'picodom';

export default class Item {
  constructor(game, singular, plural = singular) {
    this.id = 'error';
    this.game = game;
    this.singular = singular;
    this.plural = plural;
    this.amount = 0;
    this.tags = new Set();

    this._unlocked = false;
  }
  get name() {
    if(this.amount == 1) return this.singular;
    return this.plural;
  }

  tick() {

  }

  render(type) {

  }

  set unlocked(value) {
    this._unlocked = this._unlocked || value;
  }

  get unlocked() {
    return this._unlocked;
  }

  _def(v, d) {
    return v !== undefined ? v : d;
  }

  save() {
    let obj = {};
    if(this.amount > 0) obj.amount = this.amount;
    if(this.unlocked) obj.unlocked = true;

    return obj;
  }

  load(obj) {
    this.amount = this._def(obj.amount, 0);
    this.unlocked = this._def(obj.unlocked, false);
  }
}