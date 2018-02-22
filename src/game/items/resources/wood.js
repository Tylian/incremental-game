import Resource from '../resource';

export default class Wood extends Resource {
  constructor(game) {
    super(game, 'wood log', 'wood logs');
    this.color = '#875928';
  }

  get seen() {
    return true;
  }
}