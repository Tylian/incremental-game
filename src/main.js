import { h, patch } from 'picodom';
import Game from './game';

import './main.scss';

let node;
let game = new Game();

setInterval(function() {
  game.tick();
  patch(node, node = game.render());
}, 50);