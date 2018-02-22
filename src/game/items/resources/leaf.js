import Resource from '../resource';

export default class Leaf extends Resource {
  constructor(game) {
    super(game, 'leaf', 'leaves');
    this.color = '#57a872';
  }
}