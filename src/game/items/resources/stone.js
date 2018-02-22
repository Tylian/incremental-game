import Resource from '../resource';

export default class Stone extends Resource {
  constructor(game) {
    super(game, 'stone', 'stones');
    this.color = '#333333';
  }
}