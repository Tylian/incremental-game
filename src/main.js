import { init, h } from 'snabbdom';
import { classModule } from 'snabbdom/modules/class';
import { propsModule } from 'snabbdom/modules/props';
import { styleModule } from 'snabbdom/modules/style';
import { eventListenersModule } from 'snabbdom/modules/eventlisteners';
import Game from './game';

import './main.scss';

var patch = init([ classModule, propsModule, styleModule, eventListenersModule ]);

let container = document.getElementById('container');
let game = new Game();

setInterval(function() {
  game.tick();
  let vnode = game.render();
  container = patch(container, vnode);
}, 50);