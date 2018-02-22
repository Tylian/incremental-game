import { h } from 'snabbdom';

export default class Task {
  constructor() {
    this.icon = 'question';
  }

  get enabled() { 
    return true;
  }

  render() {
    if(!this.enabled) return;
    return h('button', {
      props: { 'disabled': !this.enabled },
      class: { 'sub-action': true },
      on: { click: () => { this.activate(); } }
    }, h('i', {
      class: {
        'fa': true,
        ['fa-' + this.icon]: true 
      }
    }));
  }

  activate() {

  }
}