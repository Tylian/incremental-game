import { h } from 'picodom';
import Resource from './resource';

export default class Machine extends Resource {
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
      return (<div class="machine" style={{ color: this.color}}>
        {this.amount} {this.name}
        {this.renderTasks()}
        <div class="progress-bar" style={{ width: `${(this.progress('machine')) * 100}%`, backgroundColor: this.color }}></div>
      </div>);

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