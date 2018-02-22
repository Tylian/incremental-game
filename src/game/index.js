import { h } from 'snabbdom';
import * as items from './items';

export default class Game {
  constructor() {
    this.time = 0;
    this.items = new Map();

    this.load({ version: 1, items: { fists: { amount : 1, unlocked: true }}});
  }

  addItems(name, amount = 1) {
    if(!this.items.has(name)) throw new Error(`Unknown item ${name}`);
    let item = this.items.get(name);
    item.amount += amount;
    item.unlocked = true;
  }
  removeItems(name, amount = 1) {
    this.addItems(name, -amount);
  }
  hasItems(name, amount = 1) {
    if(!this.items.has(name)) throw new Error(`Unknown item ${name}`);
    let item = this.items.get(name);
    return item.amount >= amount;
  }

  tick() {
    for(let item of this.items.values()) {
      item.tick(this);
    }
    this.time++;
  }

  render() {
    return h('div', { props: { id: "container" } }, [
      h('section', { props: { id: 'main' } }, this.renderSection('main')),
      h('section', { props: { id: 'sidebar' } }, [
        h('h3', 'Tools'),
        ...this.renderSection('tool'),
        h('h3', 'Machines'),
        ...this.renderSection('machine'),
        h('h3', 'Resources'),
        ...this.renderSection('resource')
      ])
    ]);
  }

  renderSection(type) {
    let result = [];
    for(let item of this.items.values()) {
      let vnode = item.render(type);
      if(vnode != undefined) result.push(vnode);
    }

    return result;
  }

  save() {
    let obj = { version: 1, items: {} };

    for(let [key, value] of this.items.entries()) {
      let save = item.save();
      if(Object.keys(save).length > 0) {
        obj.items[key] = save;
      }
    }

    return obj;
  }

  load(obj) {
    this.items.clear();

    for(let [key, Item] of Object.entries(items)) {
      let item = new Item(this);
      this.items.set(key, item);
      item.id = key;
      if(obj.items[key] !== undefined) {
        item.load(obj.items[key]);
      }
    }
  }
}