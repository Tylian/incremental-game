(function () {
'use strict';

function vnode(sel, data, children, text, elm) {
    var key = data === undefined ? undefined : data.key;
    return { sel: sel, data: data, children: children,
        text: text, elm: elm, key: key };
}

//# sourceMappingURL=vnode.js.map

var array = Array.isArray;
function primitive(s) {
    return typeof s === 'string' || typeof s === 'number';
}
//# sourceMappingURL=is.js.map

function createElement(tagName) {
    return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
    return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
    return document.createTextNode(text);
}
function createComment(text) {
    return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
    parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
    node.removeChild(child);
}
function appendChild(node, child) {
    node.appendChild(child);
}
function parentNode(node) {
    return node.parentNode;
}
function nextSibling(node) {
    return node.nextSibling;
}
function tagName(elm) {
    return elm.tagName;
}
function setTextContent(node, text) {
    node.textContent = text;
}
function getTextContent(node) {
    return node.textContent;
}
function isElement(node) {
    return node.nodeType === 1;
}
function isText(node) {
    return node.nodeType === 3;
}
function isComment(node) {
    return node.nodeType === 8;
}
var htmlDomApi = {
    createElement: createElement,
    createElementNS: createElementNS,
    createTextNode: createTextNode,
    createComment: createComment,
    insertBefore: insertBefore,
    removeChild: removeChild,
    appendChild: appendChild,
    parentNode: parentNode,
    nextSibling: nextSibling,
    tagName: tagName,
    setTextContent: setTextContent,
    getTextContent: getTextContent,
    isElement: isElement,
    isText: isText,
    isComment: isComment,
};

//# sourceMappingURL=htmldomapi.js.map

function addNS(data, children, sel) {
    data.ns = 'http://www.w3.org/2000/svg';
    if (sel !== 'foreignObject' && children !== undefined) {
        for (var i = 0; i < children.length; ++i) {
            var childData = children[i].data;
            if (childData !== undefined) {
                addNS(childData, children[i].children, children[i].sel);
            }
        }
    }
}
function h(sel, b, c) {
    var data = {}, children, text, i;
    if (c !== undefined) {
        data = b;
        if (array(c)) {
            children = c;
        }
        else if (primitive(c)) {
            text = c;
        }
        else if (c && c.sel) {
            children = [c];
        }
    }
    else if (b !== undefined) {
        if (array(b)) {
            children = b;
        }
        else if (primitive(b)) {
            text = b;
        }
        else if (b && b.sel) {
            children = [b];
        }
        else {
            data = b;
        }
    }
    if (array(children)) {
        for (i = 0; i < children.length; ++i) {
            if (primitive(children[i]))
                children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
        }
    }
    if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' &&
        (sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
        addNS(data, children, sel);
    }
    return vnode(sel, data, children, text, undefined);
}


//# sourceMappingURL=h.js.map

//# sourceMappingURL=thunk.js.map

function isUndef(s) { return s === undefined; }
function isDef(s) { return s !== undefined; }
var emptyNode = vnode('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
    return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode$$1) {
    return vnode$$1.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
    var i, map = {}, key, ch;
    for (i = beginIdx; i <= endIdx; ++i) {
        ch = children[i];
        if (ch != null) {
            key = ch.key;
            if (key !== undefined)
                map[key] = i;
        }
    }
    return map;
}
var hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function init$1(modules, domApi) {
    var i, j, cbs = {};
    var api = domApi !== undefined ? domApi : htmlDomApi;
    for (i = 0; i < hooks.length; ++i) {
        cbs[hooks[i]] = [];
        for (j = 0; j < modules.length; ++j) {
            var hook = modules[j][hooks[i]];
            if (hook !== undefined) {
                cbs[hooks[i]].push(hook);
            }
        }
    }
    function emptyNodeAt(elm) {
        var id = elm.id ? '#' + elm.id : '';
        var c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
        return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
    }
    function createRmCb(childElm, listeners) {
        return function rmCb() {
            if (--listeners === 0) {
                var parent_1 = api.parentNode(childElm);
                api.removeChild(parent_1, childElm);
            }
        };
    }
    function createElm(vnode$$1, insertedVnodeQueue) {
        var i, data = vnode$$1.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.init)) {
                i(vnode$$1);
                data = vnode$$1.data;
            }
        }
        var children = vnode$$1.children, sel = vnode$$1.sel;
        if (sel === '!') {
            if (isUndef(vnode$$1.text)) {
                vnode$$1.text = '';
            }
            vnode$$1.elm = api.createComment(vnode$$1.text);
        }
        else if (sel !== undefined) {
            // Parse selector
            var hashIdx = sel.indexOf('#');
            var dotIdx = sel.indexOf('.', hashIdx);
            var hash = hashIdx > 0 ? hashIdx : sel.length;
            var dot = dotIdx > 0 ? dotIdx : sel.length;
            var tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
            var elm = vnode$$1.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag)
                : api.createElement(tag);
            if (hash < dot)
                elm.setAttribute('id', sel.slice(hash + 1, dot));
            if (dotIdx > 0)
                elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
            for (i = 0; i < cbs.create.length; ++i)
                cbs.create[i](emptyNode, vnode$$1);
            if (array(children)) {
                for (i = 0; i < children.length; ++i) {
                    var ch = children[i];
                    if (ch != null) {
                        api.appendChild(elm, createElm(ch, insertedVnodeQueue));
                    }
                }
            }
            else if (primitive(vnode$$1.text)) {
                api.appendChild(elm, api.createTextNode(vnode$$1.text));
            }
            i = vnode$$1.data.hook; // Reuse variable
            if (isDef(i)) {
                if (i.create)
                    i.create(emptyNode, vnode$$1);
                if (i.insert)
                    insertedVnodeQueue.push(vnode$$1);
            }
        }
        else {
            vnode$$1.elm = api.createTextNode(vnode$$1.text);
        }
        return vnode$$1.elm;
    }
    function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
        for (; startIdx <= endIdx; ++startIdx) {
            var ch = vnodes[startIdx];
            if (ch != null) {
                api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
            }
        }
    }
    function invokeDestroyHook(vnode$$1) {
        var i, j, data = vnode$$1.data;
        if (data !== undefined) {
            if (isDef(i = data.hook) && isDef(i = i.destroy))
                i(vnode$$1);
            for (i = 0; i < cbs.destroy.length; ++i)
                cbs.destroy[i](vnode$$1);
            if (vnode$$1.children !== undefined) {
                for (j = 0; j < vnode$$1.children.length; ++j) {
                    i = vnode$$1.children[j];
                    if (i != null && typeof i !== "string") {
                        invokeDestroyHook(i);
                    }
                }
            }
        }
    }
    function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
        for (; startIdx <= endIdx; ++startIdx) {
            var i_1 = void 0, listeners = void 0, rm = void 0, ch = vnodes[startIdx];
            if (ch != null) {
                if (isDef(ch.sel)) {
                    invokeDestroyHook(ch);
                    listeners = cbs.remove.length + 1;
                    rm = createRmCb(ch.elm, listeners);
                    for (i_1 = 0; i_1 < cbs.remove.length; ++i_1)
                        cbs.remove[i_1](ch, rm);
                    if (isDef(i_1 = ch.data) && isDef(i_1 = i_1.hook) && isDef(i_1 = i_1.remove)) {
                        i_1(ch, rm);
                    }
                    else {
                        rm();
                    }
                }
                else {
                    api.removeChild(parentElm, ch.elm);
                }
            }
        }
    }
    function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
        var oldStartIdx = 0, newStartIdx = 0;
        var oldEndIdx = oldCh.length - 1;
        var oldStartVnode = oldCh[0];
        var oldEndVnode = oldCh[oldEndIdx];
        var newEndIdx = newCh.length - 1;
        var newStartVnode = newCh[0];
        var newEndVnode = newCh[newEndIdx];
        var oldKeyToIdx;
        var idxInOld;
        var elmToMove;
        var before;
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            if (oldStartVnode == null) {
                oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
            }
            else if (oldEndVnode == null) {
                oldEndVnode = oldCh[--oldEndIdx];
            }
            else if (newStartVnode == null) {
                newStartVnode = newCh[++newStartIdx];
            }
            else if (newEndVnode == null) {
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newStartVnode)) {
                patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
                oldStartVnode = oldCh[++oldStartIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else if (sameVnode(oldEndVnode, newEndVnode)) {
                patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
                oldEndVnode = oldCh[--oldEndIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldStartVnode, newEndVnode)) {
                patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
                oldStartVnode = oldCh[++oldStartIdx];
                newEndVnode = newCh[--newEndIdx];
            }
            else if (sameVnode(oldEndVnode, newStartVnode)) {
                patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
                api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
                oldEndVnode = oldCh[--oldEndIdx];
                newStartVnode = newCh[++newStartIdx];
            }
            else {
                if (oldKeyToIdx === undefined) {
                    oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
                }
                idxInOld = oldKeyToIdx[newStartVnode.key];
                if (isUndef(idxInOld)) {
                    api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    newStartVnode = newCh[++newStartIdx];
                }
                else {
                    elmToMove = oldCh[idxInOld];
                    if (elmToMove.sel !== newStartVnode.sel) {
                        api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
                    }
                    else {
                        patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
                        oldCh[idxInOld] = undefined;
                        api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
                    }
                    newStartVnode = newCh[++newStartIdx];
                }
            }
        }
        if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
            if (oldStartIdx > oldEndIdx) {
                before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
                addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
            }
            else {
                removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
            }
        }
    }
    function patchVnode(oldVnode, vnode$$1, insertedVnodeQueue) {
        var i, hook;
        if (isDef(i = vnode$$1.data) && isDef(hook = i.hook) && isDef(i = hook.prepatch)) {
            i(oldVnode, vnode$$1);
        }
        var elm = vnode$$1.elm = oldVnode.elm;
        var oldCh = oldVnode.children;
        var ch = vnode$$1.children;
        if (oldVnode === vnode$$1)
            return;
        if (vnode$$1.data !== undefined) {
            for (i = 0; i < cbs.update.length; ++i)
                cbs.update[i](oldVnode, vnode$$1);
            i = vnode$$1.data.hook;
            if (isDef(i) && isDef(i = i.update))
                i(oldVnode, vnode$$1);
        }
        if (isUndef(vnode$$1.text)) {
            if (isDef(oldCh) && isDef(ch)) {
                if (oldCh !== ch)
                    updateChildren(elm, oldCh, ch, insertedVnodeQueue);
            }
            else if (isDef(ch)) {
                if (isDef(oldVnode.text))
                    api.setTextContent(elm, '');
                addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
            }
            else if (isDef(oldCh)) {
                removeVnodes(elm, oldCh, 0, oldCh.length - 1);
            }
            else if (isDef(oldVnode.text)) {
                api.setTextContent(elm, '');
            }
        }
        else if (oldVnode.text !== vnode$$1.text) {
            api.setTextContent(elm, vnode$$1.text);
        }
        if (isDef(hook) && isDef(i = hook.postpatch)) {
            i(oldVnode, vnode$$1);
        }
    }
    return function patch(oldVnode, vnode$$1) {
        var i, elm, parent;
        var insertedVnodeQueue = [];
        for (i = 0; i < cbs.pre.length; ++i)
            cbs.pre[i]();
        if (!isVnode(oldVnode)) {
            oldVnode = emptyNodeAt(oldVnode);
        }
        if (sameVnode(oldVnode, vnode$$1)) {
            patchVnode(oldVnode, vnode$$1, insertedVnodeQueue);
        }
        else {
            elm = oldVnode.elm;
            parent = api.parentNode(elm);
            createElm(vnode$$1, insertedVnodeQueue);
            if (parent !== null) {
                api.insertBefore(parent, vnode$$1.elm, api.nextSibling(elm));
                removeVnodes(parent, [oldVnode], 0, 0);
            }
        }
        for (i = 0; i < insertedVnodeQueue.length; ++i) {
            insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
        }
        for (i = 0; i < cbs.post.length; ++i)
            cbs.post[i]();
        return vnode$$1;
    };
}
//# sourceMappingURL=snabbdom.js.map

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var _class = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
function updateClass(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldClass = oldVnode.data.class, klass = vnode.data.class;
    if (!oldClass && !klass)
        return;
    if (oldClass === klass)
        return;
    oldClass = oldClass || {};
    klass = klass || {};
    for (name in oldClass) {
        if (!klass[name]) {
            elm.classList.remove(name);
        }
    }
    for (name in klass) {
        cur = klass[name];
        if (cur !== oldClass[name]) {
            elm.classList[cur ? 'add' : 'remove'](name);
        }
    }
}
exports.classModule = { create: updateClass, update: updateClass };
exports.default = exports.classModule;
//# sourceMappingURL=class.js.map
});

unwrapExports(_class);
var _class_1 = _class.classModule;

var props = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
function updateProps(oldVnode, vnode) {
    var key, cur, old, elm = vnode.elm, oldProps = oldVnode.data.props, props = vnode.data.props;
    if (!oldProps && !props)
        return;
    if (oldProps === props)
        return;
    oldProps = oldProps || {};
    props = props || {};
    for (key in oldProps) {
        if (!props[key]) {
            delete elm[key];
        }
    }
    for (key in props) {
        cur = props[key];
        old = oldProps[key];
        if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
            elm[key] = cur;
        }
    }
}
exports.propsModule = { create: updateProps, update: updateProps };
exports.default = exports.propsModule;
//# sourceMappingURL=props.js.map
});

unwrapExports(props);
var props_1 = props.propsModule;

var style = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
var raf = (typeof window !== 'undefined' && window.requestAnimationFrame) || setTimeout;
var nextFrame = function (fn) { raf(function () { raf(fn); }); };
function setNextFrame(obj, prop, val) {
    nextFrame(function () { obj[prop] = val; });
}
function updateStyle(oldVnode, vnode) {
    var cur, name, elm = vnode.elm, oldStyle = oldVnode.data.style, style = vnode.data.style;
    if (!oldStyle && !style)
        return;
    if (oldStyle === style)
        return;
    oldStyle = oldStyle || {};
    style = style || {};
    var oldHasDel = 'delayed' in oldStyle;
    for (name in oldStyle) {
        if (!style[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.removeProperty(name);
            }
            else {
                elm.style[name] = '';
            }
        }
    }
    for (name in style) {
        cur = style[name];
        if (name === 'delayed' && style.delayed) {
            for (var name2 in style.delayed) {
                cur = style.delayed[name2];
                if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
                    setNextFrame(elm.style, name2, cur);
                }
            }
        }
        else if (name !== 'remove' && cur !== oldStyle[name]) {
            if (name[0] === '-' && name[1] === '-') {
                elm.style.setProperty(name, cur);
            }
            else {
                elm.style[name] = cur;
            }
        }
    }
}
function applyDestroyStyle(vnode) {
    var style, name, elm = vnode.elm, s = vnode.data.style;
    if (!s || !(style = s.destroy))
        return;
    for (name in style) {
        elm.style[name] = style[name];
    }
}
function applyRemoveStyle(vnode, rm) {
    var s = vnode.data.style;
    if (!s || !s.remove) {
        rm();
        return;
    }
    var name, elm = vnode.elm, i = 0, compStyle, style = s.remove, amount = 0, applied = [];
    for (name in style) {
        applied.push(name);
        elm.style[name] = style[name];
    }
    compStyle = getComputedStyle(elm);
    var props = compStyle['transition-property'].split(', ');
    for (; i < props.length; ++i) {
        if (applied.indexOf(props[i]) !== -1)
            amount++;
    }
    elm.addEventListener('transitionend', function (ev) {
        if (ev.target === elm)
            --amount;
        if (amount === 0)
            rm();
    });
}
exports.styleModule = {
    create: updateStyle,
    update: updateStyle,
    destroy: applyDestroyStyle,
    remove: applyRemoveStyle
};
exports.default = exports.styleModule;
//# sourceMappingURL=style.js.map
});

unwrapExports(style);
var style_1 = style.styleModule;

var eventlisteners = createCommonjsModule(function (module, exports) {
Object.defineProperty(exports, "__esModule", { value: true });
function invokeHandler(handler, vnode, event) {
    if (typeof handler === "function") {
        // call function handler
        handler.call(vnode, event, vnode);
    }
    else if (typeof handler === "object") {
        // call handler with arguments
        if (typeof handler[0] === "function") {
            // special case for single argument for performance
            if (handler.length === 2) {
                handler[0].call(vnode, handler[1], event, vnode);
            }
            else {
                var args = handler.slice(1);
                args.push(event);
                args.push(vnode);
                handler[0].apply(vnode, args);
            }
        }
        else {
            // call multiple handlers
            for (var i = 0; i < handler.length; i++) {
                invokeHandler(handler[i]);
            }
        }
    }
}
function handleEvent(event, vnode) {
    var name = event.type, on = vnode.data.on;
    // call event handler(s) if exists
    if (on && on[name]) {
        invokeHandler(on[name], vnode, event);
    }
}
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function updateEventListeners(oldVnode, vnode) {
    var oldOn = oldVnode.data.on, oldListener = oldVnode.listener, oldElm = oldVnode.elm, on = vnode && vnode.data.on, elm = (vnode && vnode.elm), name;
    // optimization for reused immutable handlers
    if (oldOn === on) {
        return;
    }
    // remove existing listeners which no longer used
    if (oldOn && oldListener) {
        // if element changed or deleted we remove all existing listeners unconditionally
        if (!on) {
            for (name in oldOn) {
                // remove listener if element was changed or existing listeners removed
                oldElm.removeEventListener(name, oldListener, false);
            }
        }
        else {
            for (name in oldOn) {
                // remove listener if existing listener removed
                if (!on[name]) {
                    oldElm.removeEventListener(name, oldListener, false);
                }
            }
        }
    }
    // add new listeners which has not already attached
    if (on) {
        // reuse existing listener or create new
        var listener = vnode.listener = oldVnode.listener || createListener();
        // update vnode for listener
        listener.vnode = vnode;
        // if element changed or added we add all needed listeners unconditionally
        if (!oldOn) {
            for (name in on) {
                // add listener if element was changed or new listeners added
                elm.addEventListener(name, listener, false);
            }
        }
        else {
            for (name in on) {
                // add listener if new listener added
                if (!oldOn[name]) {
                    elm.addEventListener(name, listener, false);
                }
            }
        }
    }
}
exports.eventListenersModule = {
    create: updateEventListeners,
    update: updateEventListeners,
    destroy: updateEventListeners
};
exports.default = exports.eventListenersModule;
//# sourceMappingURL=eventlisteners.js.map
});

unwrapExports(eventlisteners);
var eventlisteners_1 = eventlisteners.eventListenersModule;

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
      return h('div', { class: { resource: true }, style: { color: this.color } }, [
        `${this.amount} ${this.name}`,
        ...this.renderTasks()
      ]); 
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
      return h('button', { 
        class: { action: true },
        style: { backgroundColor: this.color },
        props: { disabled: !this.enabled },
        on: {
          click: () => {
            if(this.disabled) return;
            this.remaining = this.duration;
          }
        }
      }, [
        h('div', {
          class: { 'action-progress': true },
          style: { width: `${(1 - this.progress('action')) * 100}%` } 
        }),
        h('span', this.action)
      ]);
    } else if(type == 'tool') {
      return h('div', { class: { tool: true }, style: { color: this.color } }, [
        `${this.amount} ${this.name}`,
        ...this.renderTasks(),
        h('div', { class: { 'progress-bar': true }, style: { width: `${(this.progress('durability')) * 100}%`, backgroundColor: this.color } })
      ]); 
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

class Wood$1 extends Resource {
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
      return h('div', { class: { machine: true }, style: { color: this.color } }, [
        `${this.amount} ${this.name}`,
        ...this.renderTasks(),
        h('div', { class: { 'progress-bar': true }, style: { width: `${(this.progress('machine')) * 100}%`, backgroundColor: this.color } })
      ]); 
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
	leaf: Wood$1,
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

var patch = init$1([ _class_1, props_1, style_1, eventlisteners_1 ]);

let container = document.getElementById('container');
let game = new Game();

setInterval(function() {
  game.tick();
  let vnode = game.render();
  container = patch(container, vnode);
}, 50);

}());
//# sourceMappingURL=bundle.js.map
