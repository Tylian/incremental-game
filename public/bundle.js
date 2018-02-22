(function () {
'use strict';

var i;
var stack = [];

function h(type, props) {
  var node;
  var children = [];

  for (i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i]);
  }

  while (stack.length) {
    if (Array.isArray((node = stack.pop()))) {
      for (i = node.length; i--; ) {
        stack.push(node[i]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(typeof node === "number" ? (node = node + "") : node);
    }
  }

  return typeof type === "string"
    ? { type: type, props: props || {}, children: children }
    : type(props || {}, children)
}

var callbacks = [];

function patch(oldNode, node, container, cb) {
  var element = patchElement(
    container || (container = document.body),
    container.children[0],
    oldNode,
    node
  );

  while ((cb = callbacks.pop())) cb();

  return element
}

function merge(target, source) {
  var result = {};

  for (var i in target) {
    result[i] = target[i];
  }
  for (var i in source) {
    result[i] = source[i];
  }

  return result
}

function createElement(node, isSVG) {
  if (typeof node === "string") {
    var element = document.createTextNode(node);
  } else {
    var element = (isSVG = isSVG || node.type === "svg")
      ? document.createElementNS("http://www.w3.org/2000/svg", node.type)
      : document.createElement(node.type);

    if (node.props && node.props.oncreate) {
      callbacks.push(function() {
        node.props.oncreate(element);
      });
    }

    for (var i = 0; i < node.children.length; i++) {
      element.appendChild(createElement(node.children[i], isSVG));
    }

    for (var i in node.props) {
      setElementProp(element, i, node.props[i]);
    }
  }
  return element
}

function setElementProp(element, name, value, oldValue) {
  if (name === "key") {
  } else if (name === "style") {
    for (var name in merge(oldValue, (value = value || {}))) {
      element.style[name] = value[name] || "";
    }
  } else {
    try {
      element[name] = value;
    } catch (_) {}

    if (typeof value !== "function") {
      if (value) {
        element.setAttribute(name, value);
      } else {
        element.removeAttribute(name);
      }
    }
  }
}

function updateElement(element, oldProps, props) {
  for (var i in merge(oldProps, props)) {
    var value = props[i];
    var oldValue = i === "value" || i === "checked" ? element[i] : oldProps[i];

    if (value !== oldValue) {
      setElementProp(element, i, value, oldValue);
    }
  }

  if (props && props.onupdate) {
    callbacks.push(function() {
      props.onupdate(element, oldProps);
    });
  }
}

function removeElement(parent, element, props) {
  if (
    props &&
    props.onremove &&
    typeof (props = props.onremove(element)) === "function"
  ) {
    props(remove);
  } else {
    remove();
  }

  function remove() {
    parent.removeChild(element);
  }
}

function getKey(node) {
  if (node && node.props) {
    return node.props.key
  }
}

function patchElement(parent, element, oldNode, node, isSVG, nextSibling) {
  if (oldNode == null) {
    element = parent.insertBefore(createElement(node, isSVG), element);
  } else if (node.type != null && node.type === oldNode.type) {
    updateElement(element, oldNode.props, node.props);

    isSVG = isSVG || node.type === "svg";

    var len = node.children.length;
    var oldLen = oldNode.children.length;
    var oldKeyed = {};
    var oldElements = [];
    var keyed = {};

    for (var i = 0; i < oldLen; i++) {
      var oldElement = (oldElements[i] = element.childNodes[i]);
      var oldChild = oldNode.children[i];
      var oldKey = getKey(oldChild);

      if (null != oldKey) {
        oldKeyed[oldKey] = [oldElement, oldChild];
      }
    }

    var i = 0;
    var j = 0;

    while (j < len) {
      var oldElement = oldElements[i];
      var oldChild = oldNode.children[i];
      var newChild = node.children[j];

      var oldKey = getKey(oldChild);
      if (keyed[oldKey]) {
        i++;
        continue
      }

      var newKey = getKey(newChild);

      var keyedNode = oldKeyed[newKey] || [];

      if (null == newKey) {
        if (null == oldKey) {
          patchElement(element, oldElement, oldChild, newChild, isSVG);
          j++;
        }
        i++;
      } else {
        if (oldKey === newKey) {
          patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG);
          i++;
        } else if (keyedNode[0]) {
          element.insertBefore(keyedNode[0], oldElement);
          patchElement(element, keyedNode[0], keyedNode[1], newChild, isSVG);
        } else {
          patchElement(element, oldElement, null, newChild, isSVG);
        }

        j++;
        keyed[newKey] = newChild;
      }
    }

    while (i < oldLen) {
      var oldChild = oldNode.children[i];
      var oldKey = getKey(oldChild);
      if (null == oldKey) {
        removeElement(element, oldElements[i], oldChild.props);
      }
      i++;
    }

    for (var i in oldKeyed) {
      var keyedNode = oldKeyed[i];
      var reusableNode = keyedNode[1];
      if (!keyed[reusableNode.props.key]) {
        removeElement(element, keyedNode[0], reusableNode.props);
      }
    }
  } else if (element && node !== element.nodeValue) {
    if (typeof node === "string" && typeof oldNode === "string") {
      element.nodeValue = node;
    } else {
      element = parent.insertBefore(
        createElement(node, isSVG),
        (nextSibling = element)
      );
      removeElement(parent, nextSibling, oldNode.props);
    }
  }
  return element
}

class Item {
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

class Resource extends Item {
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
      return (h('div', {class: "resource", style: { color: this.color}}, [
        this.amount, " ", this.name,
        this.renderTasks()
      ]));
    }

    return super.render(type);
  }

  renderTasks() {
    return this.tasks.map(s => s.render());
  }
}

class Tool extends Resource {
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
      this.damage++;
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
      return (h('button', {class: "action",
        style: { backgroundColor: this.color},
        disabled: !this.enabled,
        onclick: () => { this.remaining = this.disabled ? -1 : this.duration; }}, [
        h('div', {class: "action-progress", style: { width: `${(1 - this.progress('action')) * 100}%`} }),
        h('span', null, [this.action])
    ]));
    } else if(type == 'tool') {
      return (h('div', {class: "tool", style: { color: this.color}}, [
        this.amount, " ", this.name,
        this.renderTasks(),
        h('div', {class: "progress-bar", style: { width: `${(this.progress('durability')) * 100}%`, backgroundColor: this.color}})
      ]));
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

class Fists extends Tool {
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

class Task {
  constructor() {
    this.icon = 'question';
  }

  get enabled() {
    return true;
  }

  render() {
    if(!this.enabled) return;
    return (h('button', {onclick: () => { this.activate(); }, class: "sub-action"}, [
      h('i', {class: `fa fa-${this.icon}`})
    ]));
  }

  activate() {

  }
}

class MachineCraft extends Task {
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

class WoodPickaxe extends Tool {
  constructor(game) {
    super(game, 'Wood Pickaxe', 'Wood Pickaxes');
    this.duration = 20;
    this.action = "Mine stone";
    this.color = '#875928';
    this.durability = 10;

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

class WoodHatchet extends Tool {
  constructor(game) {
    super(game, 'Wood Hatchet', 'Wood Hatchets');
    this.duration = 14;
    this.action = "Chop a tree";
    this.color = '#875928';
    this.durability = 10;

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

class Wood extends Resource {
  constructor(game) {
    super(game, 'wood log', 'wood logs');
    this.color = '#875928';
  }

  get seen() {
    return true;
  }
}

class Craft extends Task {
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

class Plank extends Resource {
  constructor(game) {
    super(game, 'plank', 'planks');
    this.color = '#b7834b';

    this.craft = new Craft({
      'wood': 1
    }, {
      'plank': 4
    });

    this.addTasks(this.craft);
  }

  tick() {
    if(this.craft.enabled) {
      this.unlocked = true;
    }
  }
}

class Sticks extends Resource {
  constructor(game) {
    super(game, 'stick', 'sticks');
    this.color = '#b7834b';

    this.craft = new Craft({
      'plank': 2
    }, {
      'stick': 4
    });

    this.addTasks(this.craft);
  }

  tick() {
    if(this.craft.enabled) {
      this.unlocked = true;
    }
  }
}

class Stone extends Resource {
  constructor(game) {
    super(game, 'stone', 'stones');
    this.color = '#333333';
  }
}

class Leaf extends Resource {
  constructor(game) {
    super(game, 'leaf', 'leaves');
    this.color = '#57a872';
  }
}

class Machine extends Resource {
  constructor(game, singular, plural = singular) {
    super(game, singular, plural);

    this.work = new Set();
  }

  get busy() {
    return this.work.size >= this.amount;
  }

  render(type) {
    if(!this.unlocked) return;

    if(type == 'machine') {
      return (h('div', {class: "machine", style: { color: this.color}}, [
        this.amount, " ", this.name,
        this.renderTasks(),
        h('div', {class: "progress-bar", style: { width: `${(this.progress('machine')) * 100}%`, backgroundColor: this.color}})
      ]));

    } else if(type == 'resource') {
      return undefined;
    }

    return super.render(type);
  }

  progress(type) {
    switch(type) {
      case 'machine':
        if(this.work.size == 0) return 0;
        let duration = 0;
        let time = 0;
        for(let work of this.work) {
          time += work.time;
          duration += work.duration;
        }
        return time / duration;
    }
    return 0;
  }

  queueWork(task) {
    if(this.busy) return false;
    this.work.add({
      duration: task.duration,
      time: 0,
      task: task
    });
    return true;
  }

  tick() {
    for(let work of this.work) {
      if(work.time >= work.duration) {
        work.task.finish();
        this.work.delete(work);
      }
      work.time++;
    }
  }
}

class CraftingTable extends Machine {
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



var items = Object.freeze({
	fists: Fists,
	wood_pickaxe: WoodPickaxe,
	wood_hatchet: WoodHatchet,
	wood: Wood,
	plank: Plank,
	stick: Sticks,
	stone: Stone,
	leaf: Leaf,
	crafting_table: CraftingTable
});

class Game {
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
    return (h('div', {id: "container"}, [
      h('section', {id: "main"}, [
        this.renderSection('main')
      ]),
      h('section', {id: "sidebar"}, [
        h('h3', null, ["Tools"]),
        this.renderSection('tool'),
        h('h3', null, ["Machines"]),
        this.renderSection('machine'),
        h('h3', null, ["Resources"]),
        this.renderSection('resource')
      ])
    ]));

    /*h('div', { props: { id: "container" } }, [
      h('section', { props: { id: 'main' } }, this.renderSection('main')),
      h('section', { props: { id: 'sidebar' } }, [
        h('h3', 'Tools'),
        ...this.renderSection('tool'),
        h('h3', 'Machines'),
        ...this.renderSection('machine'),
        h('h3', 'Resources'),
        ...this.renderSection('resource')
      ])
    ])*/
  }

  renderSection(type) {
    let result = [];
    for(let item of this.items.values()) {
      let node = item.render(type);
      if(node != undefined) result.push(node);
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

let node;
let game = new Game();

setInterval(function() {
  game.tick();
  patch(node, node = game.render());
}, 50);

}());
//# sourceMappingURL=bundle.js.map
