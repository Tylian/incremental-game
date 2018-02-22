import { h } from 'picodom';

export default class Task {
  constructor() {
    this.icon = 'question';
  }

  get enabled() { 
    return true;
  }

  render() {
    if(!this.enabled) return;
    return (<button onclick={() => { this.activate() }} class="sub-action">
      <i class={`fa fa-${this.icon}`}></i>
    </button>);
  }

  activate() {

  }
}