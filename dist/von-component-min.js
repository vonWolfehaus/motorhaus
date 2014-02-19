
var von = {};
von['math_Vec2'] = function () {
    var Vec2 = function (x, y) {
        if (typeof x === 'undefined')
            x = 0;
        if (typeof y === 'undefined')
            y = 0;
        this.x = x;
        this.y = y;
    };
    Vec2.prototype.setLength = function (value) {
        var oldLength = this.getLength();
        if (oldLength !== 0 && value !== oldLength) {
            this.multiplyScalar(value / oldLength);
        }
        return this;
    };
    Vec2.prototype.getLength = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vec2.prototype.getLengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vec2.prototype.setAngle = function (value) {
        var len = this.getAngle();
        this.x = Math.cos(value) * len;
        this.y = Math.sin(value) * len;
        return this;
    };
    Vec2.prototype.getAngle = function () {
        return Math.atan2(this.y, this.x);
    };
    Vec2.prototype.rotateBy = function (theta) {
        var x = this.x, y = this.y;
        var cos = Math.cos(theta), sin = Math.sin(theta);
        this.x = x * cos - y * sin;
        this.y = x * sin + y * cos;
        return this;
    };
    Vec2.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    Vec2.prototype.addScalar = function (s) {
        this.x += s;
        this.y += s;
        return this;
    };
    Vec2.prototype.subtract = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    Vec2.prototype.subtractScalar = function (s) {
        this.x -= s;
        this.y -= s;
        return this;
    };
    Vec2.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };
    Vec2.prototype.multiplyScalar = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    Vec2.prototype.divide = function (v) {
        if (v.x === 0 || v.y === 0)
            return this;
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    Vec2.prototype.divideScalar = function (s) {
        if (s === 0)
            return this;
        this.x /= s;
        this.y /= s;
        return this;
    };
    Vec2.prototype.perp = function () {
        this.y = -this.y;
        return this;
    };
    Vec2.prototype.negate = function () {
        this.x = -this.x;
        this.y = -this.y;
        return this;
    };
    Vec2.prototype.clamp = function (min, max) {
        if (this.x < min.x) {
            this.x = min.x;
        } else if (this.x > max.x) {
            this.x = max.x;
        }
        if (this.y < min.y) {
            this.y = min.y;
        } else if (this.y > max.y) {
            this.y = max.y;
        }
        return this;
    };
    Vec2.prototype.dotProduct = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vec2.prototype.crossProd = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    Vec2.prototype.truncate = function (max) {
        var i, l = this.getLength();
        if (l === 0 || l < max)
            return this;
        this.x /= l;
        this.y /= l;
        this.multiplyScalar(max);
        return this;
    };
    Vec2.prototype.angleTo = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return Math.atan2(dy, dx);
    };
    Vec2.prototype.distanceTo = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    Vec2.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x, dy = this.y - v.y;
        return dx * dx + dy * dy;
    };
    Vec2.prototype.lerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        return this;
    };
    Vec2.prototype.slerp = function (v, alpha) {
        var dot = this.dotProduct(v);
        var dx = this.x - v.x, dy = this.y - v.y;
        if (dot < -1)
            dot = -1;
        if (dot > 1)
            dot = 1;
        var theta = Math.acos(dot) * alpha;
        dx *= dot;
        dy *= dot;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len !== 0) {
            dx /= len;
            dy /= len;
        }
        this.multiplyScalar(Math.cos(theta));
        var sin = Math.sin(theta);
        this.x += dx * sin;
        this.y += dy * sin;
        return this;
    };
    Vec2.prototype.nlerp = function (v, alpha) {
        this.x += (v.x - this.x) * alpha;
        this.y += (v.y - this.y) * alpha;
        var length = this.getLength();
        if (length === 0)
            return this;
        this.x /= length;
        this.y /= length;
        return this;
    };
    Vec2.prototype.normalize = function () {
        var length = this.getLength();
        if (length === 0)
            return this;
        this.x /= length;
        this.y /= length;
        return this;
    };
    Vec2.prototype.reset = function (x, y) {
        x = x ? x : 0;
        y = y ? y : 0;
        this.x = x;
        this.y = y;
        return this;
    };
    Vec2.prototype.equals = function (v) {
        if (this.x === v.x && this.y === v.y)
            return true;
        return false;
    };
    Vec2.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vec2.prototype.clone = function () {
        return new Vec2(this.x, this.y);
    };
    Vec2.prototype.draw = function (ctx, startX, startY, drawingColor) {
        startX = !!startX ? startX : 0;
        startY = !!startY ? startY : 0;
        drawingColor = !!drawingColor ? drawingColor : 'rgb(0, 250, 0)';
        ctx.strokeStyle = drawingColor;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
    };
    Vec2.prototype.toString = function () {
        return '[' + this.x + ', ' + this.y + ']';
    };
    Vec2.draw = function (ctx, v1, v2, drawingColor, camOffsetX, camOffsetY) {
        camOffsetX = camOffsetX || 0;
        camOffsetY = camOffsetY || 0;
        ctx.strokeStyle = !!drawingColor ? drawingColor : 'rgb(250, 10, 10)';
        ctx.beginPath();
        ctx.moveTo(v1.x + camOffsetX, v1.y + camOffsetY);
        ctx.lineTo(v2.x + camOffsetX, v2.y + camOffsetY);
        ctx.stroke();
    };
    window.Vec2 = Vec2;
    return Vec2;
}();
/**
 * @source https://github.com/martinwells/gamecore.js
 * Hoisted to the global namespace for convenience.
 */
von['core_LinkedList'] = function () {
    var LinkedListNode = function () {
        this.obj = null;
        this.next = null;
        this.prev = null;
        this.free = true;
    };
    window.LinkedListNode = LinkedListNode;
    var LinkedList = function () {
        this.first = null;
        this.last = null;
        this.length = 0;
        this.objToNodeMap = {};
        this.uniqueId = Date.now() + '' + Math.floor(Math.random() * 1000);
        this.priority = 0;
        this.getNode = function (obj) {
            return this.objToNodeMap[obj.uniqueId];
        };
        this.addNode = function (obj) {
            var node = new LinkedListNode();
            node.obj = obj;
            node.prev = null;
            node.next = null;
            node.free = false;
            this.objToNodeMap[obj.uniqueId] = node;
            return node;
        };
        this.add = function (obj) {
            var node = this.objToNodeMap[obj.uniqueId];
            if (!node) {
                node = this.addNode(obj);
            } else {
                if (node.free === false)
                    return;
                node.obj = obj;
                node.free = false;
                node.next = null;
                node.prev = null;
            }
            if (!this.first) {
                this.first = node;
                this.last = node;
                node.next = null;
                node.prev = null;
            } else {
                if (this.last == null) {
                    throw new Error('Hmm, no last in the list -- that shouldn\'t happen here');
                }
                this.last.next = node;
                node.prev = this.last;
                this.last = node;
                node.next = null;
            }
            this.length++;
            if (this.showDebug)
                this.dump('after add');
        };
        this.has = function (obj) {
            return !!this.objToNodeMap[obj.uniqueId];
        };
        this.moveUp = function (obj) {
            this.dump('before move up');
            var c = this.getNode(obj);
            if (!c)
                throw 'Oops, trying to move an object that isn\'t in the list';
            if (c.prev == null)
                return;
            var b = c.prev;
            var a = b.prev;
            if (c == this.last)
                this.last = b;
            var oldCNext = c.next;
            if (a)
                a.next = c;
            c.next = b;
            c.prev = b.prev;
            b.next = oldCNext;
            b.prev = c;
            if (this.first == b)
                this.first = c;
        };
        this.moveDown = function (obj) {
            var b = this.getNode(obj);
            if (!b)
                throw 'Oops, trying to move an object that isn\'t in the list';
            if (b.next == null)
                return;
            var c = b.next;
            this.moveUp(c.obj);
            if (this.last == c)
                this.last = b;
        };
        this.sort = function (compare) {
            var sortArray = [];
            var i, l, node = this.first;
            while (node) {
                sortArray.push(node.object());
                node = node.next();
            }
            this.clear();
            sortArray.sort(compare);
            l = sortArray.length;
            for (i = 0; i < l; i++) {
                this.add(sortArray[i]);
            }
        };
        this.remove = function (obj) {
            var node = this.getNode(obj);
            if (node == null || node.free == true) {
                return false;
            }
            if (node.prev != null)
                node.prev.next = node.next;
            if (node.next != null)
                node.next.prev = node.prev;
            if (node.prev == null)
                this.first = node.next;
            if (node.next == null)
                this.last = node.prev;
            node.free = true;
            node.prev = null;
            node.next = null;
            this.length--;
            return true;
        };
        this.shift = function () {
            var node = this.first;
            if (this.length === 0)
                return null;
            if (node.prev) {
                node.prev.next = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            }
            this.first = node.next;
            if (!node.next)
                this.last = null;
            node.free = true;
            node.prev = null;
            node.next = null;
            this.length--;
            return node.obj;
        };
        this.pop = function () {
            var node = this.last;
            if (this.length === 0)
                return null;
            if (node.prev) {
                node.prev.next = node.next;
            }
            if (node.next) {
                node.next.prev = node.prev;
            }
            this.last = node.prev;
            if (!node.prev)
                this.first = null;
            node.free = true;
            node.prev = null;
            node.next = null;
            this.length--;
            return node.obj;
        };
        this.clear = function () {
            var next = this.first;
            while (next) {
                next.free = true;
                next = next.next;
            }
            this.first = null;
            this.length = 0;
        };
        this.dispose = function () {
            var next = this.first;
            while (next) {
                next.obj = null;
                next = next.next;
            }
            this.first = null;
            this.objToNodeMap = null;
        };
        this.dump = function (msg) {
            console.log('====================' + msg + '=====================');
            var a = this.first;
            while (a != null) {
                console.log('{' + a.obj.toString() + '} previous=' + (a.prev ? a.prev.obj : 'NULL'));
                a = a.next();
            }
            console.log('===================================');
            console.log('Last: {' + (this.last ? this.last.obj : 'NULL') + '} ' + 'First: {' + (this.first ? this.first.obj : 'NULL') + '}');
        };
    };
    window.LinkedList = LinkedList;
    return LinkedList;
}();
/*
	Global state resources object that also manages components. No idea why I called it 'Kai'.
	I consider this the most important part of the engine, since it makes the whole entity-component thing work.
	
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
von['core_Kai'] = function (require, math_Vec2, core_LinkedList) {
    return {
        engine: null,
        stage: null,
        renderHook: null,
        world: null,
        mouse: null,
        keys: null,
        pads: null,
        cache: null,
        load: null,
        debugCtx: null,
        debugMessages: true,
        components: [],
        componentsSorted: [],
        postComponents: [],
        componentDefinitions: [],
        numComponents: 0,
        width: window.innerWidth,
        height: window.innerHeight,
        ready: false,
        inputBlocked: true,
        expect: function (entity, prop, Clazz) {
            var i;
            if (!entity[prop]) {
                if (!Clazz) {
                    for (i = 0; i < this.componentDefinitions.length; i++) {
                        Clazz = this.componentDefinitions[i];
                        if (Clazz.accessor === prop) {
                            break;
                        }
                    }
                    if (!Clazz) {
                        throw new Error('[Kai.expect] The component "' + prop + '" does not exist. You might have forgotten to create a component list object (just like VonComponents.js), or forgot to add this component to that list.');
                    }
                    this.addComponent(entity, Clazz);
                    if (this.debugMessages) {
                        console.info('[Kai.expect] ' + prop.toUpperCase() + ' component was added to ' + entity.toString() + ' with default values');
                    }
                } else {
                    entity[prop] = new Clazz();
                }
            }
            return entity[prop];
        },
        registerComponents: function (factoryList) {
            var i, k, def, list, len = factoryList.length, Factory, exportedComponents = {};
            for (i = 0; i < len; i++) {
                Factory = factoryList[i];
                k = this.numComponents;
                exportedComponents[Factory.className] = {
                    accessor: Factory.accessor,
                    proto: Factory,
                    index: k,
                    priority: Factory.priority
                };
                this.numComponents++;
                if (!!this.components[k]) {
                    continue;
                }
                list = new LinkedList();
                list.priority = Factory.priority;
                this.components[k] = list;
                this.componentDefinitions[k] = exportedComponents[Factory.className];
                this.componentsSorted[k] = list;
                if (Factory.post) {
                    this.postComponents.push(list);
                }
                if (this.debugMessages) {
                    console.info('[Kai] Registered ' + Factory.className);
                }
            }
            function compare(a, b) {
                return a.priority - b.priority;
            }
            this.componentsSorted.sort(compare);
            this.postComponents.sort(compare);
            return exportedComponents;
        },
        addComponent: function (entity, compDef, options, arr) {
            var prop = compDef.accessor, compInstance = null;
            options = options || null;
            if (entity.hasOwnProperty(prop)) {
                if (this.debugMessages) {
                    console.warn('[Kai.addComponent] "' + prop + '" already exists on entity ' + entity.toString());
                }
                return;
            }
            compInstance = new compDef.proto(entity, options);
            this.components[compDef.index].add(compInstance);
            if (typeof arr === 'undefined') {
                entity[prop] = compInstance;
            } else {
                arr.push(compInstance);
            }
        },
        removeComponent: function (entity, compDef) {
            var prop = compDef.accessor;
            if (entity.hasOwnProperty(prop)) {
                this.components[compDef.index].remove(entity[prop]);
                entity[prop].dispose();
                entity[prop] = null;
            }
        }
    };
}({}, von['math_Vec2'], von['core_LinkedList']);
von['core_Signal'] = function () {
    var SignalBinding = function (signal, listener, isOnce, listenerContext, priority) {
        if (typeof priority === 'undefined') {
            priority = 0;
        }
        this.active = true;
        this.params = null;
        this._listener = listener;
        this._isOnce = isOnce;
        this.context = listenerContext;
        this._signal = signal;
        this.priority = priority || 0;
    };
    SignalBinding.prototype.execute = function (paramsArr) {
        var handlerReturn;
        var params;
        if (this.active && !!this._listener) {
            params = this.params ? this.params.concat(paramsArr) : paramsArr;
            handlerReturn = this._listener.apply(this.context, params);
            if (this._isOnce) {
                this.detach();
            }
        }
        return handlerReturn;
    };
    SignalBinding.prototype.detach = function () {
        return this.isBound() ? this._signal.remove(this._listener, this.context) : null;
    };
    SignalBinding.prototype.isBound = function () {
        return !!this._signal && !!this._listener;
    };
    SignalBinding.prototype.isOnce = function () {
        return this._isOnce;
    };
    SignalBinding.prototype.getListener = function () {
        return this._listener;
    };
    SignalBinding.prototype.getSignal = function () {
        return this._signal;
    };
    SignalBinding.prototype._destroy = function () {
        delete this._signal;
        delete this._listener;
        delete this.context;
    };
    SignalBinding.prototype.toString = function () {
        return '[SignalBinding isOnce:' + this._isOnce + ', isBound:' + this.isBound() + ', active:' + this.active + ']';
    };
    window.SignalBinding = SignalBinding;
    var Signal = function () {
        this._bindings = [];
        this._prevParams = null;
        this.memorize = false;
        this._shouldPropagate = true;
        this.active = true;
    };
    Signal.prototype.validateListener = function (listener, fnName) {
        if (typeof listener !== 'function') {
            throw new Error('listener is a required param of {fn}() and should be a Function.'.replace('{fn}', fnName));
        }
    };
    Signal.prototype._registerListener = function (listener, isOnce, listenerContext, priority) {
        var prevIndex = this._indexOfListener(listener, listenerContext);
        var binding;
        if (prevIndex !== -1) {
            binding = this._bindings[prevIndex];
            if (binding.isOnce() !== isOnce) {
                throw new Error('You cannot add' + (isOnce ? '' : 'Once') + '() then add' + (!isOnce ? '' : 'Once') + '() the same listener without removing the relationship first.');
            }
        } else {
            binding = new SignalBinding(this, listener, isOnce, listenerContext, priority);
            this._addBinding(binding);
        }
        if (this.memorize && this._prevParams) {
            binding.execute(this._prevParams);
        }
        return binding;
    };
    Signal.prototype._addBinding = function (binding) {
        var n = this._bindings.length;
        do {
            --n;
        } while (this._bindings[n] && binding.priority <= this._bindings[n].priority);
        this._bindings.splice(n + 1, 0, binding);
    };
    Signal.prototype._indexOfListener = function (listener, context) {
        var n = this._bindings.length;
        var cur;
        while (n--) {
            cur = this._bindings[n];
            if (cur.getListener() === listener && cur.context === context) {
                return n;
            }
        }
        return -1;
    };
    Signal.prototype.has = function (listener, context) {
        if (typeof context === 'undefined') {
            context = null;
        }
        return this._indexOfListener(listener, context) !== -1;
    };
    Signal.prototype.add = function (listener, listenerContext, priority) {
        if (typeof listenerContext === 'undefined') {
            listenerContext = null;
        }
        if (typeof priority === 'undefined') {
            priority = 0;
        }
        this.validateListener(listener, 'add');
        return this._registerListener(listener, false, listenerContext, priority);
    };
    Signal.prototype.addOnce = function (listener, listenerContext, priority) {
        if (typeof listenerContext === 'undefined') {
            listenerContext = null;
        }
        if (typeof priority === 'undefined') {
            priority = 0;
        }
        this.validateListener(listener, 'addOnce');
        return this._registerListener(listener, true, listenerContext, priority);
    };
    Signal.prototype.remove = function (listener, context) {
        if (typeof context === 'undefined') {
            context = null;
        }
        this.validateListener(listener, 'remove');
        var i = this._indexOfListener(listener, context);
        if (i !== -1) {
            this._bindings[i]._destroy();
            this._bindings.splice(i, 1);
        }
        return listener;
    };
    Signal.prototype.removeAll = function () {
        var n = this._bindings.length;
        while (n--) {
            this._bindings[n]._destroy();
        }
        this._bindings.length = 0;
    };
    Signal.prototype.getNumListeners = function () {
        return this._bindings.length;
    };
    Signal.prototype.halt = function () {
        this._shouldPropagate = false;
    };
    Signal.prototype.dispatch = function () {
        var paramsArr = [];
        for (var _i = 0; _i < arguments.length - 0; _i++) {
            paramsArr[_i] = arguments[_i + 0];
        }
        if (!this.active) {
            return;
        }
        var n = this._bindings.length;
        var bindings;
        if (this.memorize) {
            this._prevParams = paramsArr;
        }
        if (!n) {
            return;
        }
        bindings = this._bindings.slice(0);
        this._shouldPropagate = true;
        do {
            n--;
        } while (bindings[n] && this._shouldPropagate && bindings[n].execute(paramsArr) !== false);
    };
    Signal.prototype.forget = function () {
        this._prevParams = null;
    };
    Signal.prototype.dispose = function () {
        this.removeAll();
        delete this._bindings;
        delete this._prevParams;
    };
    Signal.prototype.toString = function () {
        return '[Signal active:' + this.active + ' numListeners:' + this.getNumListeners() + ']';
    };
    Signal.VERSION = '1.0.0';
    window.Signal = Signal;
    return Signal;
}();
von['core_CommTower'] = function (core_Signal) {
    return {
        requestState: new Signal(),
        pause: new Signal(),
        resume: new Signal()
    };
}(von['core_Signal']);
/*
	Handles game states. Also fires off resource loading done by states, and acts as proxy between the Engine and States.
	
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
von['core_StateManager'] = function (require, core_Kai, core_CommTower) {
    var Kai = core_Kai;
    var Tower = core_CommTower;
    var StateManager = function () {
        this.states = {};
        this.currentIdx = null;
        this.currentState = null;
        this.ready = false;
        this.queue = [];
    };
    StateManager.prototype = {
        init: function () {
            Tower.requestState.add(this.switchState, this);
            Kai.load.onLoadComplete.add(this.loadComplete, this);
            this.next();
        },
        add: function (key, state) {
            var newState;
            if (typeof state === 'object') {
                newState = state;
            } else if (typeof state === 'function') {
                newState = new state();
            }
            if (this.checkState(key, newState) === false) {
                return;
            }
            this.states[key] = newState;
            return newState;
        },
        remove: function (key) {
            delete this.states[key];
        },
        switchState: function (key, clearCache) {
            if (!this.states[key]) {
                console.warn('[StateManager.switchState] ' + key + ' not found');
                return;
            }
            this.ready = false;
            this.queue.push(key);
            if (typeof clearCache === 'undefined') {
                clearCache = false;
            }
            this.next(clearCache);
        },
        next: function (clearCache) {
            if (this.queue.length === 0 || Kai.ready === false) {
                return;
            }
            Kai.inputBlocked = true;
            if (clearCache) {
                Kai.cache.dispose();
            }
            if (!!this.currentIdx) {
                this.currentState = this.states[this.currentIdx];
                this.currentState.dispose();
            }
            this.currentIdx = this.queue.shift();
            this.currentState = this.states[this.currentIdx];
            Kai.load.reset();
            this.currentState.preload();
            Kai.load.start();
        },
        checkState: function (key, state) {
            var valid = false;
            if (!!this.states[key]) {
                console.error('[StateManager.checkState] Duplicate key: ' + key);
                return false;
            }
            if (!!state) {
                if (state['preload'] && state['create'] && state['update'] && state['draw'] && state['dispose']) {
                    valid = true;
                }
                if (!valid) {
                    console.error('[StateManager.checkState] Invalid State "' + key + '" given. Must contain all required functions.');
                    return false;
                }
                return true;
            } else {
                console.error('[StateManager.checkState] No state found with the key: ' + key);
                return false;
            }
            return valid;
        },
        loadComplete: function () {
            this.currentState.create();
            Kai.inputBlocked = false;
            this.ready = true;
        },
        dispose: function () {
            this.states = null;
            this.queue = null;
        }
    };
    return StateManager;
}({}, von['core_Kai'], von['core_CommTower']);
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
von['utils_RequestAnimationFrame'] = function () {
    var RequestAnimationFrame = function (game) {
        var vendors = [
                'ms',
                'moz',
                'webkit',
                'o'
            ];
        this.game = game;
        this.isRunning = false;
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; x++) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'];
        }
        this._isSetTimeOut = false;
        this._onLoop = null;
        this._timeOutID = null;
    };
    RequestAnimationFrame.prototype = {
        start: function () {
            this.isRunning = true;
            var _this = this;
            if (!window.requestAnimationFrame) {
                this._isSetTimeOut = true;
                this._onLoop = function () {
                    return _this.updateSetTimeout();
                };
                this._timeOutID = window.setTimeout(this._onLoop, 0);
            } else {
                this._isSetTimeOut = false;
                this._onLoop = function (time) {
                    return _this.updateRAF(time);
                };
                this._timeOutID = window.requestAnimationFrame(this._onLoop);
            }
        },
        updateRAF: function (time) {
            this.game.update(time);
            this._timeOutID = window.requestAnimationFrame(this._onLoop);
        },
        updateSetTimeout: function () {
            this.game.update(Date.now());
            this._timeOutID = window.setTimeout(this._onLoop, this.game.time.timeToCall);
        },
        stop: function () {
            if (this._isSetTimeOut) {
                clearTimeout(this._timeOutID);
            } else {
                window.cancelAnimationFrame(this._timeOutID);
            }
            this.isRunning = false;
        },
        isSetTimeOut: function () {
            return this._isSetTimeOut;
        },
        isRAF: function () {
            return this._isSetTimeOut === false;
        }
    };
    return RequestAnimationFrame;
}();
/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2013 Photon Storm Ltd.
 * @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
 */
von['utils_Loader'] = function (require, core_Kai) {
    var Kai = core_Kai;
    var Loader = function () {
        this.baseURL = '';
        this.crossOrigin = '';
        this.isLoading = false;
        this.progress = 0;
        this.onFileComplete = new Signal();
        this.onFileError = new Signal();
        this.onLoadStart = new Signal();
        this.onLoadComplete = new Signal();
        this._fileList = [];
        this._fileIndex = 0;
        this._xhr = new XMLHttpRequest();
    };
    Loader.prototype = {
        image: function (key, url, overwrite) {
            if (typeof overwrite === 'undefined') {
                overwrite = false;
            }
            if (overwrite) {
                this._replaceInFileList('image', key, url);
            } else {
                this._addToFileList('image', key, url);
            }
            return this;
        },
        spritesheet: function (key, url, frameWidth, frameHeight, frameMax) {
            if (typeof frameMax === 'undefined') {
                frameMax = -1;
            }
            this._addToFileList('spritesheet', key, url, {
                frameWidth: frameWidth,
                frameHeight: frameHeight,
                frameMax: frameMax
            });
            return this;
        },
        text: function (key, url, overwrite) {
            if (typeof overwrite === 'undefined') {
                overwrite = false;
            }
            if (overwrite) {
                this._replaceInFileList('text', key, url);
            } else {
                this._addToFileList('text', key, url);
            }
            return this;
        },
        audio: function (key, urls, autoDecode) {
            if (typeof autoDecode === 'undefined') {
                autoDecode = true;
            }
            this.addToFileList('audio', key, urls, {
                buffer: null,
                autoDecode: autoDecode
            });
            return this;
        },
        removeFile: function (type, key) {
            var file = this.getAsset(type, key);
            if (file !== false) {
                this._fileList.splice(file.index, 1);
            }
        },
        removeAll: function () {
            this._fileList.length = 0;
        },
        start: function () {
            if (this.isLoading) {
                return;
            }
            this.progress = 0;
            this.hasLoaded = false;
            this.isLoading = true;
            this.onLoadStart.dispatch(this._fileList.length);
            if (this._fileList.length > 0) {
                this._fileIndex = 0;
                this._progressChunk = 100 / this._fileList.length;
                this._loadFile();
            } else {
                this.progress = 100;
                this.hasLoaded = true;
                this.onLoadComplete.dispatch();
            }
        },
        reset: function () {
            this.preloadSprite = null;
            this.isLoading = false;
            this._fileList.length = 0;
            this._fileIndex = 0;
        },
        getAsset: function (type, key) {
            if (this._fileList.length > 0) {
                for (var i = 0; i < this._fileList.length; i++) {
                    if (this._fileList[i].type === type && this._fileList[i].key === key) {
                        return {
                            index: i,
                            file: this._fileList[i]
                        };
                    }
                }
            }
            return false;
        },
        totalLoadedFiles: function () {
            var total = 0;
            for (var i = 0; i < this._fileList.length; i++) {
                if (this._fileList[i].loaded) {
                    total++;
                }
            }
            return total;
        },
        totalQueuedFiles: function () {
            var i, total = 0;
            for (i = 0; i < this._fileList.length; i++) {
                if (this._fileList[i].loaded === false) {
                    total++;
                }
            }
            return total;
        },
        checkKeyExists: function (type, key) {
            if (this._fileList.length > 0) {
                for (var i = 0; i < this._fileList.length; i++) {
                    if (this._fileList[i].type === type && this._fileList[i].key === key) {
                        return true;
                    }
                }
            }
            return false;
        },
        _addToFileList: function (type, key, url, properties) {
            var entry = {
                    type: type,
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
            if (typeof properties !== 'undefined') {
                for (var prop in properties) {
                    entry[prop] = properties[prop];
                }
            }
            if (this.checkKeyExists(type, key)) {
                console.warn('[Loader] "' + key + '" already exists, use overwrite if you want to replace it in cache');
            } else {
                this._fileList.push(entry);
            }
        },
        _replaceInFileList: function (type, key, url, properties) {
            var entry = {
                    type: type,
                    key: key,
                    url: url,
                    data: null,
                    error: false,
                    loaded: false
                };
            if (typeof properties !== 'undefined') {
                for (var prop in properties) {
                    entry[prop] = properties[prop];
                }
            }
            if (this.checkKeyExists(type, key) === false) {
                this._fileList.push(entry);
            }
        },
        _loadFile: function () {
            if (!this._fileList[this._fileIndex]) {
                console.warn('Phaser.Loader _loadFile invalid index ' + this._fileIndex);
                return;
            }
            var file = this._fileList[this._fileIndex];
            var self = this;
            switch (file.type) {
            case 'image':
            case 'spritesheet':
            case 'textureatlas':
            case 'bitmapfont':
            case 'tileset':
                file.data = new Image();
                file.data.name = file.key;
                file.data.onload = function () {
                    return self._fileComplete(self._fileIndex);
                };
                file.data.onerror = function () {
                    return self._fileError(self._fileIndex);
                };
                file.data.crossOrigin = this.crossOrigin;
                file.data.src = this.baseURL + file.url;
                break;
            case 'audio':
                break;
            case 'text':
                this._xhr.open('GET', this.baseURL + file.url, true);
                this._xhr.responseType = 'text';
                this._xhr.onload = function () {
                    return self._fileComplete(self._fileIndex);
                };
                this._xhr.onerror = function () {
                    return self._fileError(self._fileIndex);
                };
                this._xhr.send();
                break;
            }
        },
        _nextFile: function (previousIndex, success) {
            this.progress = Math.round(this.progress + this._progressChunk);
            if (this.progress > 100) {
                this.progress = 100;
            }
            if (this.preloadSprite !== null) {
                if (this.preloadSprite.direction === 0) {
                    this.preloadSprite.crop.width = Math.floor(this.preloadSprite.width / 100 * this.progress);
                } else {
                    this.preloadSprite.crop.height = Math.floor(this.preloadSprite.height / 100 * this.progress);
                }
                this.preloadSprite.sprite.crop = this.preloadSprite.crop;
            }
            this.onFileComplete.dispatch(this.progress, this._fileList[previousIndex].key, success, this.totalLoadedFiles(), this._fileList.length);
            if (this.totalQueuedFiles() > 0) {
                this._fileIndex++;
                this._loadFile();
            } else {
                this.hasLoaded = true;
                this.isLoading = false;
                this.removeAll();
                this.onLoadComplete.dispatch();
            }
        },
        _getAudioURL: function (urls) {
            return null;
        },
        _fileError: function (index) {
            this._fileList[index].loaded = true;
            this._fileList[index].error = true;
            this.on_fileError.dispatch(this._fileList[index].key, this._fileList[index]);
            console.warn('Phaser.Loader error loading file: ' + this._fileList[index].key + ' from URL ' + this._fileList[index].url);
            this._nextFile(index, false);
        },
        _fileComplete: function (index) {
            if (!this._fileList[index]) {
                console.warn('Phaser.Loader _fileComplete invalid index ' + index);
                return;
            }
            var file = this._fileList[index];
            file.loaded = true;
            var loadNext = true;
            var self = this;
            switch (file.type) {
            case 'image':
                Kai.cache.addImage(file.key, file.url, file.data);
                break;
            case 'spritesheet':
                Kai.cache.addSpriteSheet(file.key, file.url, file.data, file.frameWidth, file.frameHeight, file.frameMax);
                break;
            case 'tileset':
                Kai.cache.addTileset(file.key, file.url, file.data, file.tileWidth, file.tileHeight, file.tileMax, file.tileMargin, file.tileSpacing);
                break;
            case 'audio':
                break;
            case 'text':
                file.data = this._xhr.responseText;
                Kai.cache.addText(file.key, file.url, file.data);
                break;
            case 'script':
                file.data = document.createElement('script');
                file.data.language = 'javascript';
                file.data.type = 'text/javascript';
                file.data.defer = false;
                file.data.text = this._xhr.responseText;
                document.head.appendChild(file.data);
                break;
            }
            if (loadNext) {
                this._nextFile(index, true);
            }
        },
        _jsonLoadComplete: function (index) {
            if (!this._fileList[index]) {
                console.warn('Phaser.Loader _jsonLoadComplete invalid index ' + index);
                return;
            }
            var file = this._fileList[index];
            var data = JSON.parse(this._xhr.responseText);
            file.loaded = true;
            if (file.type === 'tilemap') {
                Kai.cache.addTilemap(file.key, file.url, data, file.format);
            } else {
                Kai.cache.addTextureAtlas(file.key, file.url, file.data, data, file.format);
            }
            this._nextFile(index, true);
        }
    };
    return Loader;
}({}, von['core_Kai']);
/**
* @author       Richard Davey <rich@photonstorm.com>
* @copyright    2013 Photon Storm Ltd.
* @license      {@link https://github.com/photonstorm/phaser/blob/master/license.txt|MIT License}
*/
von['utils_Cache'] = function () {
    var Cache = function () {
        this._canvases = {};
        this._images = {};
        this._textures = {};
        this._sounds = {};
        this._text = {};
        this._tilemaps = {};
        this._tilesets = {};
        this._bitmapDatas = {};
        this.addDefaultImage();
        this.addMissingImage();
        this.onSoundUnlock = new Signal();
    };
    Cache.prototype = {
        addCanvas: function (key, canvas, context) {
            this._canvases[key] = {
                canvas: canvas,
                context: context
            };
        },
        addBitmapData: function (key, bitmapData) {
            this._bitmapDatas[key] = bitmapData;
            return bitmapData;
        },
        addSpriteSheet: function (key, url, data, frameWidth, frameHeight, frameMax) {
        },
        addTileset: function (key, url, data, tileWidth, tileHeight, tileMax, tileMargin, tileSpacing) {
        },
        addTilemap: function (key, url, mapData, format) {
        },
        addTextureAtlas: function (key, url, data, atlasData, format) {
        },
        addBitmapFont: function (key, url, data, xmlData) {
        },
        addDefaultImage: function () {
            var img = new Image();
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAAXRSTlMAQObYZgAAABVJREFUeF7NwIEAAAAAgKD9qdeocAMAoAABm3DkcAAAAABJRU5ErkJggg==';
            this._images['__default'] = {
                url: null,
                data: img,
                spriteSheet: false
            };
        },
        addMissingImage: function () {
            var img = new Image();
            img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAJ9JREFUeNq01ssOwyAMRFG46v//Mt1ESmgh+DFmE2GPOBARKb2NVjo+17PXLD8a1+pl5+A+wSgFygymWYHBb0FtsKhJDdZlncG2IzJ4ayoMDv20wTmSMzClEgbWYNTAkQ0Z+OJ+A/eWnAaR9+oxCF4Os0H8htsMUp+pwcgBBiMNnAwF8GqIgL2hAzaGFFgZauDPKABmowZ4GL369/0rwACp2yA/ttmvsQAAAABJRU5ErkJggg==';
            this._images['__missing'] = {
                url: null,
                data: img,
                spriteSheet: false
            };
        },
        addText: function (key, url, data) {
            this._text[key] = {
                url: url,
                data: data
            };
        },
        addImage: function (key, url, data) {
            this._images[key] = {
                url: url,
                data: data,
                spriteSheet: false
            };
        },
        addSound: function (key, url, data, webAudio, audioTag) {
            webAudio = webAudio || true;
            audioTag = audioTag || false;
            var decoded = false;
            if (audioTag) {
                decoded = true;
            }
            this._sounds[key] = {
                url: url,
                data: data,
                isDecoding: false,
                decoded: decoded,
                webAudio: webAudio,
                audioTag: audioTag
            };
        },
        reloadSound: function (key) {
            var _this = this;
            if (this._sounds[key]) {
                this._sounds[key].data.src = this._sounds[key].url;
                this._sounds[key].data.addEventListener('canplaythrough', function () {
                    return _this.reloadSoundComplete(key);
                }, false);
                this._sounds[key].data.load();
            }
        },
        reloadSoundComplete: function (key) {
            if (this._sounds[key]) {
                this._sounds[key].locked = false;
                this.onSoundUnlock.dispatch(key);
            }
        },
        updateSound: function (key, property, value) {
            if (this._sounds[key]) {
                this._sounds[key][property] = value;
            }
        },
        decodedSound: function (key, data) {
            this._sounds[key].data = data;
            this._sounds[key].decoded = true;
            this._sounds[key].isDecoding = false;
        },
        getCanvas: function (key) {
            if (this._canvases[key]) {
                return this._canvases[key].canvas;
            }
            return null;
        },
        getBitmapData: function (key) {
            if (this._bitmapDatas[key]) {
                return this._bitmapDatas[key];
            }
            return null;
        },
        checkImageKey: function (key) {
            if (this._images[key]) {
                return true;
            }
            return false;
        },
        getImage: function (key) {
            if (this._images[key]) {
                return this._images[key].data;
            }
            return null;
        },
        getTilesetImage: function (key) {
            if (this._tilesets[key]) {
                return this._tilesets[key].data;
            }
            return null;
        },
        getTileset: function (key) {
            if (this._tilesets[key]) {
                return this._tilesets[key].tileData;
            }
            return null;
        },
        getTilemapData: function (key) {
            if (this._tilemaps[key]) {
                return this._tilemaps[key];
            }
            return null;
        },
        getFrameData: function (key) {
            if (this._images[key] && this._images[key].frameData) {
                return this._images[key].frameData;
            }
            return null;
        },
        getFrameByIndex: function (key, frame) {
            if (this._images[key] && this._images[key].frameData) {
                return this._images[key].frameData.getFrame(frame);
            }
            return null;
        },
        getFrameByName: function (key, frame) {
            if (this._images[key] && this._images[key].frameData) {
                return this._images[key].frameData.getFrameByName(frame);
            }
            return null;
        },
        getFrame: function (key) {
            if (this._images[key] && this._images[key].spriteSheet === false) {
                return this._images[key].frame;
            }
            return null;
        },
        getTextureFrame: function (key) {
            if (this._textures[key]) {
                return this._textures[key].frame;
            }
            return null;
        },
        getTexture: function (key) {
            if (this._textures[key]) {
                return this._textures[key];
            }
            return null;
        },
        getSound: function (key) {
            if (this._sounds[key]) {
                return this._sounds[key];
            }
            return null;
        },
        getSoundData: function (key) {
            if (this._sounds[key]) {
                return this._sounds[key].data;
            }
            return null;
        },
        isSoundDecoded: function (key) {
            if (this._sounds[key]) {
                return this._sounds[key].decoded;
            }
        },
        isSoundReady: function (key) {
            return this._sounds[key] && this._sounds[key].decoded && this.game.sound.touchLocked === false;
        },
        isSpriteSheet: function (key) {
            if (this._images[key]) {
                return this._images[key].spriteSheet;
            }
            return false;
        },
        getText: function (key) {
            if (this._text[key]) {
                return this._text[key].data;
            }
            return null;
        },
        getKeys: function (array) {
            var item, output = [];
            for (item in array) {
                if (item !== '__default') {
                    output.push(item);
                }
            }
            return output;
        },
        getImageKeys: function () {
            return this.getKeys(this._images);
        },
        getSoundKeys: function () {
            return this.getKeys(this._sounds);
        },
        getTextKeys: function () {
            return this.getKeys(this._text);
        },
        removeCanvas: function (key) {
            delete this._canvases[key];
        },
        removeImage: function (key) {
            delete this._images[key];
        },
        removeSound: function (key) {
            delete this._sounds[key];
        },
        removeText: function (key) {
            delete this._text[key];
        },
        dispose: function () {
            var item;
            for (item in this._canvases) {
                delete this._canvases[item['key']];
            }
            for (item in this._images) {
                delete this._images[item['key']];
            }
            for (item in this._sounds) {
                delete this._sounds[item['key']];
            }
            for (item in this._text) {
                delete this._text[item['key']];
            }
        }
    };
    return Cache;
}();
von['components_input_MouseController'] = function (Kai) {
    return function MouseController() {
        this.position = new Vec2();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.down = false;
        this.shift = false;
        this.ctrl = false;
        var _self = this, _downPrev = false;
        function onDown(evt) {
            if (Kai.inputBlocked) {
                return;
            }
            _self.position.x = evt.pageX;
            _self.position.y = evt.pageY;
            _self.down = true;
            _self.shift = !!evt.shiftKey;
            _self.ctrl = !!evt.ctrlKey;
            _self.onDown.dispatch(_self.position);
        }
        function onUp(evt) {
            if (!_self.down || Kai.inputBlocked) {
                return;
            }
            _self.position.x = evt.pageX;
            _self.position.y = evt.pageY;
            _self.down = false;
            _self.shift = !!evt.shiftKey;
            _self.ctrl = !!evt.ctrlKey;
            _self.onUp.dispatch(_self.position);
        }
        function onMove(evt) {
            evt.preventDefault();
            _self.position.x = evt.pageX;
            _self.position.y = evt.pageY;
            _self.shift = !!evt.shiftKey;
            _self.ctrl = !!evt.ctrlKey;
        }
        function onContext(evt) {
            evt.preventDefault();
            return false;
        }
        (function init() {
            document.addEventListener('mousedown', onDown, false);
            document.addEventListener('mouseup', onUp, false);
            document.addEventListener('mouseout', onUp, false);
            document.addEventListener('mousemove', onMove, false);
            document.addEventListener('contextmenu', onContext, false);
        }());
    };
}(von['core_Kai']);
von['components_input_KeyboardController'] = function (Kai) {
    var KeyboardController = function () {
        this.key = -1;
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.shift = false;
        this.ctrl = false;
        this._keys = {};
        this._prev = null;
        document.addEventListener('keydown', this._processDown.bind(this), false);
        document.addEventListener('keyup', this._processUp.bind(this), false);
    };
    KeyboardController.prototype = {
        _processDown: function (evt) {
            var key = this._keys[evt.keyCode];
            if (Kai.inputBlocked || this.key === this._prev) {
                return;
            }
            this.shift = !!evt.shiftKey;
            this.ctrl = !!evt.ctrlKey;
            this.key = evt.keyCode;
            if (key && key.isDown) {
                this._keys[evt.keyCode].duration = performance.now() - key.timeDown;
            } else {
                if (!key) {
                    this._keys[evt.keyCode] = {
                        isDown: true,
                        timeDown: performance.now(),
                        timeUp: 0,
                        duration: 0
                    };
                } else {
                    this._keys[evt.keyCode].isDown = true;
                    this._keys[evt.keyCode].timeDown = performance.now();
                    this._keys[evt.keyCode].duration = 0;
                }
            }
            this.onDown.dispatch(this.key);
            this._prev = this.key;
        },
        _processUp: function (evt) {
            if (Kai.inputBlocked) {
                return;
            }
            this.key = -1;
            this.shift = false;
            this.ctrl = false;
            if (this._keys[evt.keyCode]) {
                this._keys[evt.keyCode].isDown = false;
                this._keys[evt.keyCode].timeUp = performance.now();
            } else {
                this._keys[evt.keyCode] = {
                    isDown: false,
                    timeDown: performance.now(),
                    timeUp: performance.now(),
                    duration: 0
                };
            }
            this.onUp.dispatch(evt.keyCode, this._keys[evt.keyCode].timeUp - this._keys[evt.keyCode].timeDown);
        },
        activate: function () {
            for (var key in this._keys) {
                this._keys[key].isDown = false;
            }
        },
        justPressed: function (keycode, duration) {
            if (typeof duration === 'undefined') {
                duration = 100;
            }
            if (this._keys[keycode] && this._keys[keycode].isDown && this._keys[keycode].duration < duration) {
                return true;
            }
            return false;
        },
        justReleased: function (keycode, duration) {
            if (typeof duration === 'undefined') {
                duration = 100;
            }
            if (this._keys[keycode] && this._keys[keycode].isDown === false && performance.now() - this._keys[keycode].timeUp < duration) {
                return true;
            }
            return false;
        },
        isDown: function (keycode) {
            if (this._keys[keycode]) {
                return this._keys[keycode].isDown;
            }
            return false;
        },
        A: 'A'.charCodeAt(0),
        B: 'B'.charCodeAt(0),
        C: 'C'.charCodeAt(0),
        D: 'D'.charCodeAt(0),
        E: 'E'.charCodeAt(0),
        F: 'F'.charCodeAt(0),
        G: 'G'.charCodeAt(0),
        H: 'H'.charCodeAt(0),
        I: 'I'.charCodeAt(0),
        J: 'J'.charCodeAt(0),
        K: 'K'.charCodeAt(0),
        L: 'L'.charCodeAt(0),
        M: 'M'.charCodeAt(0),
        N: 'N'.charCodeAt(0),
        O: 'O'.charCodeAt(0),
        P: 'P'.charCodeAt(0),
        Q: 'Q'.charCodeAt(0),
        R: 'R'.charCodeAt(0),
        S: 'S'.charCodeAt(0),
        T: 'T'.charCodeAt(0),
        U: 'U'.charCodeAt(0),
        V: 'V'.charCodeAt(0),
        W: 'W'.charCodeAt(0),
        X: 'X'.charCodeAt(0),
        Y: 'Y'.charCodeAt(0),
        Z: 'Z'.charCodeAt(0),
        ZERO: '0'.charCodeAt(0),
        ONE: '1'.charCodeAt(0),
        TWO: '2'.charCodeAt(0),
        THREE: '3'.charCodeAt(0),
        FOUR: '4'.charCodeAt(0),
        FIVE: '5'.charCodeAt(0),
        SIX: '6'.charCodeAt(0),
        SEVEN: '7'.charCodeAt(0),
        EIGHT: '8'.charCodeAt(0),
        NINE: '9'.charCodeAt(0),
        NUMPAD_0: 96,
        NUMPAD_1: 97,
        NUMPAD_2: 98,
        NUMPAD_3: 99,
        NUMPAD_4: 100,
        NUMPAD_5: 101,
        NUMPAD_6: 102,
        NUMPAD_7: 103,
        NUMPAD_8: 104,
        NUMPAD_9: 105,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_ADD: 107,
        NUMPAD_ENTER: 108,
        NUMPAD_SUBTRACT: 109,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        F1: 112,
        F2: 113,
        F3: 114,
        F4: 115,
        F5: 116,
        F6: 117,
        F7: 118,
        F8: 119,
        F9: 120,
        F10: 121,
        F11: 122,
        F12: 123,
        F13: 124,
        F14: 125,
        F15: 126,
        COLON: 186,
        EQUALS: 187,
        UNDERSCORE: 189,
        QUESTION_MARK: 191,
        TILDE: 192,
        OPEN_BRACKET: 219,
        BACKWARD_SLASH: 220,
        CLOSED_BRACKET: 221,
        QUOTES: 222,
        BACKSPACE: 8,
        TAB: 9,
        CLEAR: 12,
        ENTER: 13,
        SHIFT: 16,
        CONTROL: 17,
        ALT: 18,
        CAPS_LOCK: 20,
        ESC: 27,
        SPACEBAR: 32,
        PAGE_UP: 33,
        PAGE_DOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        INSERT: 45,
        DELETE: 46,
        HELP: 47,
        NUM_LOCK: 144
    };
    return KeyboardController;
}(von['core_Kai']);
/*
	The Engine holds the state manager, fires it off when the document is ready, and runs the one and only update loop. It ties all the other core modules together, setting everything up.
	
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
von['core_Engine'] = function (require, core_Kai, core_CommTower, core_StateManager, utils_RequestAnimationFrame, utils_Loader, utils_Cache, components_input_MouseController, components_input_KeyboardController) {
    var Kai = core_Kai;
    var Tower = core_CommTower;
    var StateManager = core_StateManager;
    var RAF = utils_RequestAnimationFrame;
    var Loader = utils_Loader;
    var Cache = utils_Cache;
    var MouseController = components_input_MouseController;
    var KeyboardController = components_input_KeyboardController;
    var Engine = function () {
        if (Kai.debugMessages) {
            console.log('[Engine] Initializing');
        }
        this.state = new StateManager();
        this.raf = new RAF(this);
        this._paused = false;
        var self = this;
        this._onInit = function () {
            return self.init();
        };
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            window.setTimeout(this._onInit, 0);
        } else {
            document.addEventListener('DOMContentLoaded', this._onInit, false);
            window.addEventListener('load', this._onInit, false);
        }
    };
    Engine.prototype = {
        constructor: Engine,
        init: function () {
            if (Kai.ready) {
                return;
            }
            var self = this;
            if (!document.body) {
                window.setTimeout(this._onInit, 20);
                return;
            }
            document.removeEventListener('DOMContentLoaded', this._onInit);
            window.removeEventListener('load', this._onInit);
            window.addEventListener('focus', function (evt) {
                self._paused = false;
                Tower.resume.dispatch();
            }, false);
            window.addEventListener('blur', function (evt) {
                self._paused = true;
                Tower.pause.dispatch();
            }, false);
            Kai.engine = this;
            Kai.mouse = new MouseController();
            Kai.keys = new KeyboardController();
            Kai.cache = new Cache();
            Kai.load = new Loader();
            Kai.ready = true;
            this.state.init();
            Kai.inputBlocked = false;
            if (Kai.debugMessages) {
                console.log('[Engine] Ready');
            }
            this.raf.start();
        },
        start: function (state) {
            if (Kai.ready) {
                return;
            }
            this.state.switchState(state);
        },
        update: function () {
            var i, node, obj, list = Kai.componentsSorted, len = list.length;
            if (this._paused) {
                return;
            }
            if (this.state.ready) {
                for (i = 0; i < len; i++) {
                    if (!list[i])
                        continue;
                    node = list[i].first;
                    if (node && !node.obj.update) {
                        continue;
                    }
                    while (node) {
                        obj = node.obj;
                        if (obj.active) {
                            obj.update();
                        }
                        node = node.next;
                    }
                }
                list = Kai.postComponents;
                len = list.length;
                for (i = 0; i < len; i++) {
                    if (!list[i])
                        continue;
                    node = list[i].first;
                    while (node) {
                        obj = node.obj;
                        if (obj.active) {
                            obj.postUpdate();
                        }
                        node = node.next;
                    }
                }
                this.state.currentState.update();
            } else {
            }
            if (Kai.renderHook) {
                Kai.renderHook();
            }
        },
        dispose: function () {
        }
    };
    return Engine;
}({}, von['core_Kai'], von['core_CommTower'], von['core_StateManager'], von['utils_RequestAnimationFrame'], von['utils_Loader'], von['utils_Cache'], von['components_input_MouseController'], von['components_input_KeyboardController']);
// JavaScript utility functions
von['utils_Tools'] = {
    isPlainObject: function (obj) {
        if (typeof obj !== 'object' || obj.nodeType || obj === obj.window) {
            return false;
        }
        try {
            if (obj.constructor && !hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch (e) {
            return false;
        }
        return true;
    },
    merge: function () {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === 'boolean') {
            deep = target;
            target = arguments[1] || {};
            i = 2;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (this.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && Array.isArray(src) ? src : [];
                        } else {
                            clone = src && this.isPlainObject(src) ? src : {};
                        }
                        target[name] = this.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
};
von['entities_World'] = function (require, utils_Tools) {
    var Tools = utils_Tools;
    return {
        width: 1,
        height: 1,
        depth: 1,
        scale: 1,
        gravity: 8,
        friction: 0.98,
        elapsed: 0.01666,
        broadphase: null,
        map: null,
        camera: null,
        set: function (settings) {
            Tools.merge(this, settings);
        }
    };
}({}, von['utils_Tools']);
/*
	All game objects must extend this, since many core components assume these properties exist on everything.
	
	@author Corey Birnbaum http://coldconstructs.com/ @vonWolfehaus
*/
von['core_Base'] = function () {
    var Base = function () {
        this.uniqueId = Math.random().toString(36).slice(2) + Date.now();
        this.active = false;
    };
    return Base;
}();
von['components_physics_AABB2'] = function (require, utils_Tools, entities_World, core_Base) {
    var Tools = utils_Tools;
    var World = entities_World;
    var AABB2 = function (entity, settings) {
        core_Base.call(this);
        this.width = 50;
        this.height = 50;
        this.min = new Vec2();
        this.max = new Vec2();
        this.mass = 100;
        this.invmass = 0;
        this.restitution = 0.6;
        this.solid = true;
        Tools.merge(this, settings);
        this.entity = entity;
        this._halfWidth = this.width / 2;
        this._halfHeight = this.height / 2;
        this.position = entity.position;
        this.velocity = entity.velocity;
        this.min.x = this.position.x - this._halfWidth;
        this.min.y = this.position.y - this._halfHeight;
        this.max.x = this.position.x + this._halfWidth;
        this.max.y = this.position.y + this._halfHeight;
        this.setMass(this.mass);
    };
    AABB2.accessor = 'body';
    AABB2.className = 'BODY_AABB2';
    AABB2.priority = 1;
    AABB2.prototype = {
        constructor: AABB2,
        setMass: function (newMass) {
            this.mass = newMass;
            if (newMass <= 0) {
                this.invmass = 0;
            } else {
                this.invmass = 1 / newMass;
            }
        },
        activate: function () {
            this.setMass(this.mass);
        },
        update: function () {
            this.velocity.y += World.gravity * World.elapsed;
            this.position.x += this.velocity.x * World.elapsed;
            this.position.y += this.velocity.y * World.elapsed;
            if (this.position.x < this._halfWidth) {
                this.position.x = this._halfWidth;
                this.velocity.x = -this.velocity.x * this.restitution;
            } else if (this.position.x + this._halfWidth > World.width) {
                this.position.x = World.width - this._halfWidth;
                this.velocity.x = -this.velocity.x * this.restitution;
            }
            if (this.position.y < this._halfWidth) {
                this.position.y = this._halfWidth;
                this.velocity.y = -this.velocity.y * this.restitution;
            } else if (this.position.y + this._halfHeight > World.height) {
                this.position.y = World.height - this._halfHeight;
                this.velocity.y = -this.velocity.y * this.restitution;
            }
            this.min.x = this.position.x - this._halfWidth;
            this.min.y = this.position.y - this._halfHeight;
            this.max.x = this.position.x + this._halfWidth;
            this.max.y = this.position.y + this._halfHeight;
        },
        dispose: function () {
            this.entity = null;
            this.position = null;
            this.velocity = null;
        }
    };
    return AABB2;
}({}, von['utils_Tools'], von['entities_World'], von['core_Base']);
von['components_physics_AABB3'] = function (require, utils_Tools, entities_World, core_Base) {
    var Tools = utils_Tools;
    var World = entities_World;
    var AABB3 = function (entity, settings) {
        core_Base.call(this);
        this.width = 50;
        this.height = 50;
        this.depth = 50;
        this.min = new THREE.Vector3();
        this.max = new THREE.Vector3();
        this.mass = 100;
        this.invmass = 0;
        this.restitution = 0.6;
        Tools.merge(this, settings);
        this.entity = entity;
        this._halfWidth = this.width / 2;
        this._halfHeight = this.height / 2;
        this._halfDepth = this.depth / 2;
        this.position = entity.position;
        this.velocity = entity.velocity;
        this.min.x = this.position.x - this._halfWidth;
        this.min.y = this.position.y - this._halfHeight;
        this.min.z = this.position.z - this._halfDepth;
        this.max.x = this.position.x + this._halfWidth;
        this.max.y = this.position.y + this._halfHeight;
        this.max.z = this.position.z + this._halfDepth;
        this.setMass(this.mass);
    };
    AABB3.accessor = 'body';
    AABB3.className = 'BODY_AABB3';
    AABB3.priority = 1;
    AABB3.prototype = {
        constructor: AABB3,
        setMass: function (newMass) {
            this.mass = newMass;
            if (newMass <= 0) {
                this.invmass = 0;
            } else {
                this.invmass = 1 / newMass;
            }
        },
        activate: function () {
            this.setMass(this.mass);
        },
        update: function () {
            this.velocity.y += World.gravity * World.elapsed;
            this.position.x += this.velocity.x * World.elapsed;
            this.position.y += this.velocity.y * World.elapsed;
            this.position.z += this.velocity.z * World.elapsed;
            if (this.position.x < 0) {
                this.position.x = 0;
                this.velocity.x = -this.velocity.x * this.restitution;
            } else if (this.position.x + this._halfWidth > World.width) {
                this.position.x = World.width - this._halfWidth;
                this.velocity.x = -this.velocity.x * this.restitution;
            }
            if (this.position.y < 0) {
                this.position.y = 0;
                this.velocity.y = -this.velocity.y * this.restitution;
            } else if (this.position.y + this._halfHeight > World.height) {
                this.position.y = World.height - this._halfHeight;
                this.velocity.y = -this.velocity.y * this.restitution;
            }
            this.min.x = this.position.x - this._halfWidth;
            this.min.y = this.position.y - this._halfHeight;
            this.min.z = this.position.z - this._halfDepth;
            this.max.x = this.position.x + this._halfWidth;
            this.max.y = this.position.y + this._halfHeight;
            this.max.z = this.position.z + this._halfDepth;
        },
        dispose: function () {
            this.entity = null;
            this.position = null;
            this.velocity = null;
        }
    };
    return AABB3;
}({}, von['utils_Tools'], von['entities_World'], von['core_Base']);
von['physics_PhysicsConstants'] = function (require) {
    return {
        BOUNDARY_WRAP: 'wrap',
        BOUNDARY_BOUNCE: 'bounce',
        BOUNDARY_DISABLE: 'disable'
    };
}({});
von['utils_DebugDraw'] = function () {
    var tau = Math.PI * 2;
    var DebugDraw = {
            circle: function (ctx, x, y, radius, color) {
                color = color || 'rgb(200, 10, 30)';
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, tau);
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.stroke();
            },
            point: function (ctx, p, color) {
                color = color || 'rgb(200, 10, 30)';
                ctx.beginPath();
                ctx.arc(p.x, p.y, 2, 0, tau);
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.stroke();
            },
            rectangle: function (ctx, x, y, sizeX, sizeY, color) {
                color = color || 'rgb(200, 10, 30)';
                ctx.beginPath();
                ctx.lineWidth = 1;
                ctx.strokeStyle = color;
                ctx.strokeRect(x - sizeX * 0.5, y - sizeY * 0.5, sizeX, sizeY);
            }
        };
    return DebugDraw;
}();
von['components_physics_RadialCollider2'] = function (require, core_Kai, utils_Tools, entities_World, physics_PhysicsConstants, utils_DebugDraw, core_Base) {
    var Kai = core_Kai;
    var Tools = utils_Tools;
    var World = entities_World;
    var PhysicsConstants = physics_PhysicsConstants;
    var DebugDraw = utils_DebugDraw;
    var RadialColider2 = function (entity, settings) {
        core_Base.call(this);
        this.radius = 25;
        this.mass = 100;
        this.invmass = 0;
        this.restitution = 0.8;
        this.maxSpeed = 200;
        this.solid = true;
        this.hasAccel = false;
        this.hasFriction = false;
        this.autoAdd = true;
        this.collisionId = this.uniqueId;
        this.boundaryBehavior = PhysicsConstants.BOUNDARY_BOUNCE;
        Tools.merge(this, settings);
        this.onCollision = new Signal();
        this.entity = entity;
        this.position = Kai.expect(entity, 'position', Vec2);
        this.velocity = Kai.expect(entity, 'velocity', Vec2);
        if (this.hasAccel) {
            this.accel = Kai.expect(entity, 'accel', Vec2);
        }
        this.setMass(this.mass);
    };
    RadialColider2.accessor = 'body';
    RadialColider2.className = 'BODY_RADIAL_COLLIDER2';
    RadialColider2.priority = 100;
    RadialColider2.post = true;
    RadialColider2.prototype = {
        constructor: RadialColider2,
        setMass: function (newMass) {
            this.mass = newMass;
            if (newMass <= 0) {
                this.invmass = 0;
            } else {
                this.invmass = 1 / newMass;
            }
        },
        activate: function () {
            this.solid = true;
            this.active = true;
            if (this.autoAdd) {
                World.broadphase.add(this);
            }
        },
        disable: function () {
            this.solid = false;
            this.active = false;
            if (this.autoAdd) {
                World.broadphase.remove(this);
            }
        },
        postUpdate: function () {
            this.velocity.y += World.gravity * World.elapsed;
            if (this.hasAccel) {
                this.velocity.x += this.accel.x;
                this.velocity.y += this.accel.y;
                this.velocity.truncate(this.maxSpeed);
            }
            if (this.hasFriction) {
                this.velocity.x *= World.friction;
                this.velocity.y *= World.friction;
            }
            this.position.x += this.velocity.x * World.elapsed;
            this.position.y += this.velocity.y * World.elapsed;
            switch (this.boundaryBehavior) {
            case PhysicsConstants.BOUNDARY_DISABLE:
                if (this.position.x < this.radius || this.position.x + this.radius > World.width || this.position.y < this.radius || this.position.y + this.radius > World.height) {
                    this.onCollision.dispatch(null);
                }
                break;
            case PhysicsConstants.BOUNDARY_BOUNCE:
                if (this.position.x < this.radius) {
                    this.position.x = this.radius;
                    this.velocity.x = -this.velocity.x * this.restitution;
                } else if (this.position.x + this.radius > World.width) {
                    this.position.x = World.width - this.radius;
                    this.velocity.x = -this.velocity.x * this.restitution;
                }
                if (this.position.y < this.radius) {
                    this.position.y = this.radius;
                    this.velocity.y = -this.velocity.y * this.restitution;
                } else if (this.position.y + this.radius > World.height) {
                    this.position.y = World.height - this.radius;
                    this.velocity.y = -this.velocity.y * this.restitution;
                }
                break;
            case PhysicsConstants.BOUNDARY_WRAP:
                if (this.position.x < this.radius) {
                    this.position.x += World.width + this.radius;
                } else if (this.position.x + this.radius > World.width) {
                    this.position.x -= World.width - this.radius;
                }
                if (this.position.y < this.radius) {
                    this.position.y += World.height + this.radius;
                } else if (this.position.y + this.radius > World.height) {
                    this.position.y -= World.height - this.radius;
                }
                break;
            }
        },
        debugDraw: function (ctx) {
            if (World.camera) {
                DebugDraw.circle(ctx, this.position.x - World.camera.position.x, this.position.y - World.camera.position.y, this.radius);
            } else {
                DebugDraw.circle(ctx, this.position.x, this.position.y, this.radius);
            }
        },
        dispose: function () {
            this.onCollision.dispose();
            this.entity = null;
            this.position = null;
            this.velocity = null;
            this.onCollision = null;
        }
    };
    return RadialColider2;
}({}, von['core_Kai'], von['utils_Tools'], von['entities_World'], von['physics_PhysicsConstants'], von['utils_DebugDraw'], von['core_Base']);
von['physics_Manifold'] = function () {
    this.a = null;
    this.b = null;
    this.penetration = 0;
    this.normal = new Vec2();
};
von['physics_Physics2'] = function (require, physics_Manifold) {
    var Manifold = physics_Manifold;
    return {
        _scratch: new Vec2(),
        _normal: new Vec2(),
        _impulse: new Vec2(),
        _manifold: new Manifold(),
        resolve: function (a, b, m) {
            this._scratch.reset(b.velocity.x - a.velocity.x, b.velocity.y - a.velocity.y);
            var velAlongNormal = this._scratch.dotProduct(m.normal);
            if (velAlongNormal > 0) {
                return;
            }
            var e = Math.min(a.restitution, b.restitution);
            var j = -(1 + e) * velAlongNormal;
            j /= a.invmass + b.invmass;
            this._impulse.reset(m.normal.x * j, m.normal.y * j);
            a.velocity.x -= a.invmass * this._impulse.x;
            a.velocity.y -= a.invmass * this._impulse.y;
            b.velocity.x += b.invmass * this._impulse.x;
            b.velocity.y += b.invmass * this._impulse.y;
        },
        testAABBvsAABB: function (a, b) {
            if (a.min.x > b.max.x)
                return false;
            if (a.min.y > b.max.y)
                return false;
            if (a.max.x < b.min.x)
                return false;
            if (a.max.y < b.min.y)
                return false;
            return true;
        },
        separateAABBvsAABB: function (a, b) {
            if (a.max.x < b.min.x || a.min.x > b.max.x)
                return null;
            if (a.max.y < b.min.y || a.min.y > b.max.y)
                return null;
            this._normal.reset(b.position.x - a.position.x, b.position.y - a.position.y);
            var a_extent = (a.max.x - a.min.x) / 2;
            var b_extent = (b.max.x - b.min.x) / 2;
            var x_overlap = a_extent + b_extent - Math.abs(this._normal.x);
            if (x_overlap > 0) {
                a_extent = (a.max.y - a.min.y) / 2;
                b_extent = (b.max.y - b.min.y) / 2;
                var y_overlap = a_extent + b_extent - Math.abs(this._normal.y);
                if (y_overlap > 0) {
                    if (x_overlap < y_overlap) {
                        if (this._normal.x < 0) {
                            this._manifold.normal.reset(-1, 0);
                        } else {
                            this._manifold.normal.reset(1, 0);
                        }
                        this._manifold.penetration = x_overlap;
                    } else {
                        if (this._normal.y < 0) {
                            this._manifold.normal.reset(0, -1);
                        } else {
                            this._manifold.normal.reset(0, 1);
                        }
                        this._manifold.penetration = y_overlap;
                    }
                    var correctionX = this._manifold.penetration * this._manifold.normal.x;
                    var correctionY = this._manifold.penetration * this._manifold.normal.y;
                    var cim = a.invmass + b.invmass;
                    a.position.x -= correctionX * (a.invmass / cim);
                    a.position.y -= correctionY * (a.invmass / cim);
                    b.position.x += correctionX * (b.invmass / cim);
                    b.position.y += correctionY * (b.invmass / cim);
                    return this._manifold;
                }
            }
            return null;
        },
        testCircleVsCircle: function (a, b) {
            var dx = b.position.x - a.position.x;
            var dy = b.position.y - a.position.y;
            var dist = dx * dx + dy * dy;
            var radii = a.radius + b.radius;
            if (dist < radii * radii) {
                return true;
            }
            return false;
        },
        separateCircleVsCircle: function (a, b) {
            var dx = b.position.x - a.position.x;
            var dy = b.position.y - a.position.y;
            var dist = dx * dx + dy * dy;
            var radii = a.radius + b.radius;
            var rSqr = radii * radii;
            var cim, j, correctionX, correctionY;
            if (dist < rSqr) {
                dist = Math.sqrt(dx * dx + dy * dy);
                if (dist === 0) {
                    dist = a.radius + b.radius - 1;
                    dx = dy = radii;
                    this._manifold.penetration = a.radius;
                    this._manifold.normal.reset(1, 0);
                } else {
                    this._manifold.penetration = rSqr - dist;
                    this._manifold.normal.reset(dx, dy).normalize();
                }
                j = (radii - dist) / dist;
                correctionX = dx * j;
                correctionY = dy * j;
                cim = a.invmass + b.invmass;
                a.position.x -= correctionX * (a.invmass / cim);
                a.position.y -= correctionY * (a.invmass / cim);
                b.position.x += correctionX * (b.invmass / cim);
                b.position.y += correctionY * (b.invmass / cim);
                return this._manifold;
            }
            return null;
        }
    };
}({}, von['physics_Manifold']);
von['components_physics_CollisionGridScanner'] = function (require, utils_Tools, entities_World, physics_Physics2, core_Base) {
    var Tools = utils_Tools;
    var World = entities_World;
    var Physics = physics_Physics2;
    var CollisionGridScanner = function (entity, settings) {
        core_Base.call(this);
        this.scanRadius = 1;
        Tools.merge(this, settings);
        this.onCollision = new Signal();
        this.entity = entity;
        this._body = entity.body;
        this._nearby = new LinkedList();
        this._grid = World.broadphase;
    };
    CollisionGridScanner.accessor = 'collisionScanner';
    CollisionGridScanner.className = 'COLLISION_SCANNER_RADIAL';
    CollisionGridScanner.priority = 5;
    CollisionGridScanner.prototype = {
        constructor: CollisionGridScanner,
        activate: function () {
            this.active = true;
        },
        disable: function () {
            this.active = false;
        },
        update: function () {
            var node, obj, m;
            this._grid.getNeighbors(this._body, this.scanRadius, this._nearby);
            node = this._nearby.first;
            while (node) {
                obj = node.obj;
                if (Physics.testCircleVsCircle(obj, this._body)) {
                    this.onCollision.dispatch(obj);
                    break;
                }
                node = node.next;
            }
        },
        dispose: function () {
            this.onCollision.dispose();
            this.entity = null;
            this.position = null;
            this.onCollision = null;
        }
    };
    return CollisionGridScanner;
}({}, von['utils_Tools'], von['entities_World'], von['physics_Physics2'], von['core_Base']);
von['components_Health'] = function (require, utils_Tools, core_Base) {
    var Tools = utils_Tools;
    var Health = function (entity, settings) {
        core_Base.call(this);
        this.max = 100;
        this.overage = 0;
        this.alive = false;
        this.active = false;
        Tools.merge(this, settings);
        this.onDeath = new Signal();
        this.onDamage = new Signal();
        this.onHeal = new Signal();
        this.onFull = new Signal();
        this.onActivate = new Signal();
        this.entity = entity;
        this._meter = 0;
    };
    Health.accessor = 'health';
    Health.className = 'HEALTH';
    Health.priority = 1;
    Health.prototype = {
        constructor: Health,
        activate: function () {
            this._meter = this.max;
            this.alive = true;
            this.onActivate.dispatch(this._meter, this.entity);
        },
        change: function (amount) {
            if (!this.alive)
                return 0;
            this._meter += amount;
            if (this._meter <= 0) {
                this._meter = 0;
                this.alive = false;
                this.onDeath.dispatch(amount, this.entity);
            } else {
                if (this._meter > this.max + this.overage) {
                    this._meter = this.max;
                    this.onFull.dispatch(amount);
                }
                if (amount < 0)
                    this.onDamage.dispatch(amount);
                else
                    this.onHeal.dispatch(amount);
            }
            return this._meter;
        },
        drain: function (amount) {
            if (!this.alive)
                return 0;
            if (this._meter > this.max) {
                this._meter -= amount;
                if (this._meter <= this.max) {
                    this._meter = this.max;
                    this.onFull.dispatch(amount);
                }
            }
            return this._meter;
        },
        dispose: function () {
            this.onDeath.dispose();
            this.onDamage.dispose();
            this.onHeal.dispose();
            this.onFull.dispose();
            this.entity = null;
            this.deathSignal = null;
            this.onDamage = null;
            this.onHeal = null;
            this.onFull = null;
        }
    };
    return Health;
}({}, von['utils_Tools'], von['core_Base']);
von['components_input_TwinStickMovement'] = function (require, utils_Tools, core_Base) {
    var Tools = utils_Tools;
    var TwinStickMovement = function (entity, settings) {
        core_Base.call(this);
        this.speed = 1;
        this.pad = null;
        Tools.merge(this, settings);
        this.entity = entity;
        this.accel = entity.accel;
        this.rotation = entity.rotation;
        this.active = false;
    };
    TwinStickMovement.accessor = 'input';
    TwinStickMovement.className = 'INPUT_TWINSTICK';
    TwinStickMovement.priority = 20;
    TwinStickMovement.prototype = {
        constructor: TwinStickMovement,
        activate: function () {
            this.accel.x = this.accel.y = 0;
            this.rotation.x = this.rotation.y = 0;
            this.active = true;
        },
        update: function () {
            this.accel.copy(this.pad.leftAxis).multiplyScalar(this.speed);
            this.rotation.copy(this.pad.rightAxis);
        },
        dispose: function () {
            this.entity = null;
            this.accel = null;
            this.rotation = null;
        }
    };
    return TwinStickMovement;
}({}, von['utils_Tools'], von['core_Base']);
von['components_Timer'] = function (require, utils_Tools, core_Base) {
    var Tools = utils_Tools;
    var Timer = function (entity, settings) {
        core_Base.call(this);
        this.repeat = -1;
        this.immediateDispatch = false;
        this.interval = 1000;
        Tools.merge(this, settings);
        this.onInterval = new Signal();
        this.entity = entity;
        this._timer = 0;
        this._numTicks = 0;
        this._currentRepeat = this.repeat;
        this.disable();
    };
    Timer.accessor = 'timer';
    Timer.className = 'TIMER';
    Timer.priority = 13;
    Timer.prototype = {
        constructor: Timer,
        activate: function () {
            this._timer = performance.now();
            this.active = true;
            this._currentRepeat = this.repeat;
            this._numTicks = 0;
            if (this.immediateDispatch) {
                this._numTicks++;
                this.onInterval.dispatch(this._numTicks);
            }
        },
        disable: function () {
            this.active = false;
        },
        reset: function () {
            this._timer = performance.now();
            this._numTicks = 0;
            if (this.active && this.immediateDispatch) {
                this._numTicks++;
                this.onInterval.dispatch(this._numTicks);
            }
        },
        update: function () {
            if (performance.now() - this._timer >= this.interval) {
                this._numTicks++;
                this.onInterval.dispatch(this._numTicks);
                if (this.repeat !== -1 && this._currentRepeat-- === 0) {
                    this.disable();
                    return;
                }
                this._timer = performance.now();
            }
        },
        dispose: function () {
            this.onInterval.dispose();
            this.onInterval = null;
            this.entity = null;
        }
    };
    return Timer;
}({}, von['utils_Tools'], von['core_Base']);
von['math_MathTools'] = {
    TAU: Math.PI * 2,
    clamp: function (val, min, max) {
        return Math.max(min, Math.min(max, val));
    },
    sign: function (val) {
        return number && number / Math.abs(number);
    },
    random: function (min, max) {
        if (arguments.length === 1) {
            return Math.random() * min - min * 0.5;
        }
        return Math.random() * (max - min) + min;
    },
    randomInt: function (min, max) {
        if (arguments.length === 1) {
            return Math.floor(Math.random() * min - min * 0.5);
        }
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
};
/**
 * 
 */
von['components_behaviors_Wander'] = function (require, utils_Tools, math_MathTools, core_Base) {
    var Tools = utils_Tools;
    var MathTools = math_MathTools;
    var Wander = function (entity, settings) {
        core_Base.call(this);
        this.maxSpeed = 20;
        this.jitterAngle = 1;
        this.targetDistance = 20;
        this.targetRadius = 10;
        Tools.merge(this, settings);
        this.entity = entity;
        this._wanderAngle = 0;
        this._circleCenter = new Vec2();
        this._displacement = new Vec2();
        this.position = entity.position;
        this.velocity = entity.velocity;
        this.accel = entity.accel;
        this.rotation = entity.rotation;
    };
    Wander.accessor = 'wander';
    Wander.className = 'WANDER_BEHAVIOR';
    Wander.priority = 10;
    Wander.prototype = {
        constructor: Wander,
        activate: function () {
            this.active = true;
        },
        disable: function () {
            this.active = false;
        },
        update: function () {
            this._circleCenter.copy(this.velocity);
            this._circleCenter.normalize();
            this._circleCenter.multiplyScalar(this.targetDistance);
            this._displacement.reset(0, -1);
            this._displacement.multiplyScalar(this.targetRadius);
            this.setAngle(this._displacement, this._wanderAngle);
            this._wanderAngle += Math.random() * this.jitterAngle - this.jitterAngle * 0.5;
            this.velocity.add(this._circleCenter.add(this._displacement));
            this.velocity.truncate(this.maxSpeed);
            this.rotation.copy(this.velocity);
        },
        setAngle: function (vector, value) {
            var len = vector.getLength();
            vector.x = Math.cos(value) * len;
            vector.y = Math.sin(value) * len;
        },
        getShortRotation: function (angle) {
            angle %= MathTools.TAU;
            if (angle > Math.PI) {
                angle -= MathTools.TAU;
            } else if (angle < -Math.PI) {
                angle += MathTools.TAU;
            }
            return angle;
        },
        dispose: function () {
            this.entity = null;
            this.position = null;
        }
    };
    return Wander;
}({}, von['utils_Tools'], von['math_MathTools'], von['core_Base']);
/**
 * Class description
 */
von['components_GridTargeter'] = function (require, entities_World, utils_Tools, core_Base) {
    var World = entities_World;
    var Tools = utils_Tools;
    var GridTargeter = function (entity, settings) {
        core_Base.call(this);
        this.searchInterval = 1000;
        this.scanRadius = 400;
        this.collisionId = entity.collisionId;
        this.target = null;
        Tools.merge(this, settings);
        this.entity = entity;
        this._nearby = new LinkedList();
        this._grid = World.broadphase;
        this._timer = 0;
        this.position = entity.position;
    };
    GridTargeter.accessor = 'gridTargeter';
    GridTargeter.className = 'GRID_TARGETER';
    GridTargeter.priority = 10;
    GridTargeter.prototype = {
        constructor: GridTargeter,
        activate: function () {
            this.active = true;
            this.target = null;
            this.collisionId = this.entity.collisionId;
            this._findTarget();
        },
        disable: function () {
            this.active = false;
            this.target = null;
        },
        update: function () {
            if (performance.now() - this._timer >= this.searchInterval) {
                this._findTarget();
                this._timer = performance.now();
            }
        },
        dispose: function () {
            this.entity = null;
            this.position = null;
        },
        _findTarget: function () {
            var node, obj, m;
            this._nearby.clear();
            this._grid.getNearby(this.position, this.scanRadius, this._nearby);
            node = this._nearby.first;
            while (node) {
                obj = node.obj;
                if (obj && obj.entity.id !== this.entity.id) {
                    this.target = obj;
                    return;
                }
                node = node.next;
            }
            this.target = null;
        }
    };
    return GridTargeter;
}({}, von['entities_World'], von['utils_Tools'], von['core_Base']);
/*
	requirejs passes in the loaded classes into the callback's arguments pseudo-array,
	so we take advantage of that and go through that array, creating a plain object
	wrapper for each component that holds vital information about it, which we use in Engine
	and, in fact, by all entities as well. Check out Kai.registerComponents to see what I'm
	talking about.
	
	Those plain object wrappers (which I call component "definitions") allows us to dynamically
	augment entities at runtime, since we reference the definition and not the prototype directly.
	
	Kai creates an array of LinkedLists. Each List is a component type, containing all the instances
	of that type. The Engine grabs and loops through every List and calls `update()` anything in it.
	
	A lot of assumptions must be made for this to work, so I created the Templates to make building
	stuff a lot easier, and not have to remember what's what.
	
	@author Corey Birnbaum
*/
von['components_VonComponents'] = function (components_physics_AABB2, components_physics_AABB3, components_physics_RadialCollider2, components_physics_CollisionGridScanner, components_Health, components_input_TwinStickMovement, components_Timer, components_behaviors_Wander, components_GridTargeter) {
    return core_Kai.registerComponents(arguments);
}(von['components_physics_AABB2'], von['components_physics_AABB3'], von['components_physics_RadialCollider2'], von['components_physics_CollisionGridScanner'], von['components_Health'], von['components_input_TwinStickMovement'], von['components_Timer'], von['components_behaviors_Wander'], von['components_GridTargeter']);