/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var modules = __webpack_require__(1);

	modules.keys().forEach(function(name){
	    name && modules(name);
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var map = {
		"./animation/slide/slide-animation.css": 2,
		"./animation/slide/slide-animation.js": 6,
		"./content/simple-page/simple-page.css": 7,
		"./content/simple-page/simple-page.js": 9,
		"./control/keyboard/keyboard.js": 10,
		"./control/touch/touch.js": 11,
		"./control/wheel/wheel.js": 12,
		"./core/core.css": 13,
		"./core/core.js": 15,
		"./navigation/hash/hash.js": 16,
		"./navigation/menu/menu.js": 17
	};
	function webpackContext(req) {
		return __webpack_require__(webpackContextResolve(req));
	};
	function webpackContextResolve(req) {
		return map[req] || (function() { throw new Error("Cannot find module '" + req + "'.") }());
	};
	webpackContext.keys = function webpackContextKeys() {
		return Object.keys(map);
	};
	webpackContext.resolve = webpackContextResolve;
	module.exports = webpackContext;
	webpackContext.id = 1;


/***/ },
/* 2 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 3 */,
/* 4 */,
/* 5 */,
/* 6 */
/***/ function(module, exports) {

	(function($) {
	    var MODULE_TYPE = 'animation';
	    var MODULE_NAME = 'slide-animation';
	    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;

	    var EVENT_MOVE_SCREEN = 'move-screen.' + MODULE_NAME;
	    var EVENT_TURNED_ON = 'module-has-turned-on.' + MODULE_NAME;
	    var EVENT_TOUCH_START = 'touch-start';
	    var EVENT_TOUCH_MOVE = 'touch-move';
	    var EVENT_TOUCH_END = 'touch-end';
	    var EVENT_TOUCH_CANSEL = 'touch-cansel';
	    var EVENT_RESTORE_OFFSET = 'restore-offset';
	    var EVENT_FINISHED_ANIMATION = 'finished-animation';

	    var _setStyles = function() {
	        this.core.$wrap.addClass(MODULE_NAME);
	    };

	    var _removeStyles = function() {
	        this.core.$wrap.removeClass(MODULE_NAME);
	        this.core.$el.attr('style', '');
	    };

	    var _getTransitionValue = function() {
	        var axis = this.core.options.axis;
	        var $el = this.core.$el;
	        var transformValues = $el.css('transform').split(', ');

	        if(!transformValues || transformValues.length < 2) {
	            return 0;
	        }

	        return axis === 'x' ? parseInt(transformValues[ 4 ]) : parseInt(transformValues[ 5 ]);
	    };

	    var _cssTransitionByIndex = function(index) {
	        return ({
	            y: 'translate3d(0, ' + index * -100 + '%, 0)',
	            x: 'translate3d(' + index * -100 + '%, 0, 0)'
	        })[this.core.options.axis];
	    };

	    var _buildTransitionByValue = function(value) {
	        return ({
	            x: ('translate3d(' + value + 'px, 0, 0)'),
	            y: ('translate3d(0, ' + value + 'px, 0)')
	        })[this.core.options.axis];
	    };

	    var _execTouchOffset = function(offest) {
	        var $el = this.core.$el;
	        var value = _buildTransitionByValue.call(this, this.touchStart - offest);

	        $el.css('transition-duration', '0s');
	        $el.css('transform', value);
	    };

	    var _animate = function(data) {
	        var index = data.index;
	        var value = _cssTransitionByIndex.call(this, data.index);
	        var speed = data.speed === 0 ? 1 : data.speed;
	        var $el = this.core.$el;

	        $el.css('transition-duration', speed / 1000 + 's');
	        $el.css('transform', value);
	        $el.off('transitionend webkitTransitionEnd');
	        $el.on('transitionend webkitTransitionEnd', function() {
	            $el.trigger(EVENT_FINISHED_ANIMATION, {
	                direction: index,
	                initiator: MODULE_NAME
	            });
	        });
	    };

	    var _addListeners = function() {
	        var module = this;
	        var $el = this.core.$el;

	        $el.on(EVENT_MOVE_SCREEN, function(e, data) {
	            if(module.enabled) {
	                _animate.call(module, data);
	            }
	        });

	        $el.on(EVENT_TURNED_ON, function(e, data) {
	            if(data.initiator === MODULE_NAME) {
	                _animate.call(module, {
	                    index: module.core.currentScreen,
	                    speed: 0
	                });
	            }
	        });

	        $el.on(EVENT_TOUCH_START, function() {
	            module.touchStart = _getTransitionValue.call(module);

	            $el.css('transition-duration', '0s');
	            $el.css('transform', _buildTransitionByValue.call(module, module.touchStart));
	        });

	        $el.on(EVENT_TOUCH_END, function() {
	            delete module.touchStart;
	        });

	        $el.on(EVENT_TOUCH_CANSEL, function() {
	            delete module.touchStart;
	        });

	        $el.on(EVENT_TOUCH_MOVE, function(e, data) {
	            _execTouchOffset.call(module, data.offset);
	        });

	        $el.on(EVENT_RESTORE_OFFSET, function() {
	            _animate.call(module, {
	                index: module.core.currentScreen,
	                speed: module.core.options.speed / 2
	            });
	        });
	    };

	    var _removeListeners = function() {
	        var $el = this.core.$el;

	        $el.off(EVENT_MOVE_SCREEN);
	        $el.off(EVENT_TURNED_ON);
	    };

	    function SlideAnimation(params) {
	        this.core = params.roller;
	        this.type = MODULE_TYPE;
	        this.enable();

	        _addListeners.call(this);
	    }

	    SlideAnimation.prototype.enable = function() {
	        if(!this.enabled) {
	            this.enabled = true;
	            this.core.$el.trigger(EVENT_TURNED_ON, {
	                initiator: MODULE_NAME,
	                type: MODULE_TYPE
	            });
	            _setStyles.call(this);
	        }
	    };

	    SlideAnimation.prototype.disable = function() {
	        _removeStyles.call(this);
	        this.enabled = false;
	    };

	    SlideAnimation.prototype.destruct = function() {
	        this.disable();
	        _removeStyles.call(this);
	        _removeListeners.call(this);
	        delete this.core.modules[ MODULE_NAME ];
	    };

	    $.fn[ PLAGIN_NAME ] = function() {
	        this.roller.modules[ MODULE_NAME ] = new SlideAnimation({
	            $el: this,
	            roller: this.roller
	        });

	        return this;
	    };
	}(jQuery));

/***/ },
/* 7 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 8 */,
/* 9 */
/***/ function(module, exports) {

	(function($) {
	    var MODULE_NAME = 'simple-page';
	    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
	    var EVENT_RESIZE = 'resize.' + MODULE_NAME;
	    var EVENT_SCROLL = 'scroll.' + MODULE_NAME;
	    var EVENT_MOVE_SCREEN = 'move-screen.' + MODULE_NAME;
	    var EVENT_REQUEST_MOVE = 'request-move';
	    var EVENT_SCREEN_CHANGED = 'screen-has-changed';
	    var MODULE_TYPE = 'content';
	    var LOCKED_MODULES = [ 'animation', 'control' ];
	    var DEFAULT_OPTIONS = {
	        minWidth: 0,
	        minHeight: 0
	    };

	    var _setStyles = function() {
	        this.core.$wrap.addClass(MODULE_NAME);
	    };

	    var _removeStyles = function() {
	        this.core.$wrap.removeClass(MODULE_NAME);
	        var module = this;
	        setTimeout(function() {
	            module.core.$wrap.scrollTop(0);
	        }, 10);
	    };

	    var _disableOtherModules = function() {
	        var roller = this.core;
	        var damp = this.damp = [];
	        Object.keys(roller.modules).forEach(function(name) {
	            var module = roller.modules[ name ];
	            if(module.enabled) {
	                if(LOCKED_MODULES.indexOf(module.type) >= 0) {
	                    if(module.enabled) {
	                        module.disable();
	                        damp.push(name);
	                    }
	                }
	            }
	        });
	    };

	    var _enableOtherModules = function() {
	        var module = this;
	        var roller = module.core;

	        if(module.damp) {
	            while(module.damp.length) {
	                roller.modules[ module.damp.shift() ].enable();
	            }
	            delete  module.damp;
	        }
	    };

	    var _calcOffsetsScreen = function() {
	        var common = 0;
	        var offsets = this.core.$screens.map(function(index, screen) {
	            return common = parseInt($(screen).height()) + common;
	        }).toArray();

	        offsets.unshift(0);

	        return offsets;
	    };

	    var _detectCurrentScreen = function(offsets) {
	        var scrollTop = this.core.$wrap.scrollTop();

	        for(var i = 0; i < offsets.length; i++) {
	            if(scrollTop > offsets[ i ] && scrollTop < offsets[ i + 1 ]) {
	                return i;
	            }
	        }
	    };

	    var _scrollTo = function(index, speed) {
	        var $wrap = this.core.$wrap;
	        var $el = this.core.$el;
	        var value = this.offsets[ index ];

	        if(!speed || speed == 0) {
	            return $wrap.scrollTop(value);
	        }

	        $wrap.stop().animate({ scrollTop: value }, speed, function() {
	            $el.trigger(EVENT_SCREEN_CHANGED, { direction: index, initiator: 'MODULE_NAME' });
	        });
	    };

	    var _trackPosition = function() {
	        this.offsets = this.offsets || _calcOffsetsScreen.call(this);

	        var offsets = this.offsets.slice();
	        var currentScreen = this.core.currentScreen;
	        var screenInView = _detectCurrentScreen.call(this, offsets);
	        if(screenInView !== 'undefined' && screenInView !== currentScreen) {
	            this.core.$el.trigger(EVENT_REQUEST_MOVE, {
	                direction: screenInView,
	                speed: 0,
	                initiator: MODULE_NAME
	            });
	        }
	    };

	    var _processingResize = function() {
	        var module = this;
	        var $wrap = this.core.$wrap;

	        var wrapWidth = $wrap.width();
	        var wrapHeight = $wrap.height();
	        var minWidth = module.minWidth;
	        var minHeight = module.minHeight;

	        if(module.enabled) {
	            module.offsets = _calcOffsetsScreen.call(module);
	        }

	        if((wrapWidth < minWidth || wrapHeight < minHeight) && !module.enabled) {
	            module.enable();

	            setTimeout(function() {
	                module.offsets = _calcOffsetsScreen.call(module);
	                _scrollTo.call(module, module.core.currentScreen);
	            }, 10);
	        }

	        if((wrapWidth > minWidth) && (wrapHeight > minHeight) && (module.enabled)) {
	            module.disable();
	        }
	    };

	    var _addListeners = function() {
	        var module = this;
	        var $el = this.core.$el;
	        var $wrap = this.core.$wrap;
	        var $win = this.core.nodes.$win;

	        $el.on(EVENT_MOVE_SCREEN, function(e, data) {
	            if(module.enabled && data.initiator !== MODULE_NAME) {
	                _scrollTo.call(module, data.index, data.speed);
	            }
	        });

	        $wrap.on(EVENT_SCROLL, function() {
	            if(module.enabled) {
	                _trackPosition.call(module);
	            }
	        });

	        $win.on(EVENT_RESIZE, function() {
	            if(module.watching) {
	                _processingResize.call(module);
	            }
	        });
	    };

	    var _removeListeners = function() {
	        var $el = this.core.$el;
	        var $wrap = this.core.$wrap;
	        var $win = this.core.nodes.$win;
	        
	        $el.off(EVENT_MOVE_SCREEN);
	        $wrap.off(EVENT_SCROLL);
	        $win.off(EVENT_RESIZE);
	    };

	    function SimplePage(params) {
	        var options = $.extend(DEFAULT_OPTIONS, params.options);

	        this.core = params.roller;
	        this.minWidth = options.minWidth;
	        this.minHeight = options.minHeight;
	        this.type = MODULE_TYPE;
	        this.onWatching();
	        this.disable();

	        _addListeners.call(this);

	        this.core.nodes.$win.trigger(EVENT_RESIZE);
	    }

	    SimplePage.prototype.enable = function() {
	        _setStyles.call(this);
	        _disableOtherModules.call(this);
	        this.enabled = true;
	    };

	    SimplePage.prototype.disable = function() {
	        _removeStyles.call(this);
	        _enableOtherModules.call(this);
	        this.enabled = false;
	    };

	    SimplePage.prototype.onWatching = function() {
	        this.watching = true;
	    };

	    SimplePage.prototype.offWatching = function() {
	        this.watching = false;
	    };

	    SimplePage.prototype.destruct = function() {
	        _removeListeners.call(this);
	        delete this.core.modules[ MODULE_NAME ];
	    };

	    $.fn[ PLAGIN_NAME ] = function(options) {
	        this.roller.modules[ MODULE_NAME ] = new SimplePage({
	            $el: this,
	            roller: this.roller,
	            options: options
	        });

	        return this;
	    };
	}(jQuery));

/***/ },
/* 10 */
/***/ function(module, exports) {

	(function($) {
	    var MODULE_NAME = 'keyboard';
	    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
	    var MODULE_TYPE = 'control';
	    var EVENT_KEY = 'keydown.' + MODULE_NAME;
	    var EVENT_REQUEST_MOVE = 'request-move';

	    var PAGEUP = 33;
	    var PAGEDOWM = 34;

	    var END = 35;
	    var HOME = 36;

	    var ARROWUP = 38;
	    var ARROWDOWN = 40;

	    var DEFAULT_OPTIONS = {
	        next: [ PAGEDOWM, ARROWDOWN ],
	        prev: [ PAGEUP, ARROWUP ],
	        last: [ END ],
	        first: [ HOME ]
	    };

	    var _addListeners = function() {
	        var module = this;
	        var $win = this.core.nodes.$win;

	        $win.on(EVENT_KEY, function(e) {
	            if(module.enabled) {
	                _processingEvent.call(module, e);
	            }
	        });
	    };

	    var _removeListeners = function() {
	        var $win = this.core.nodes.$win;

	        $win.off(EVENT_KEY);
	    };

	    var _processingEvent = function(e) {
	        var $el = this.core.$el;

	        var code = e.keyCode;
	        var next = this.next;
	        var prev = this.prev;
	        var last = this.last;
	        var first = this.first;

	        if(next && next.indexOf(code) >= 0) {
	            $el.trigger(EVENT_REQUEST_MOVE, {
	                direction: 'next',
	                initiator: MODULE_NAME
	            });
	        }

	        if(prev && prev.indexOf(code) >= 0) {
	            $el.trigger(EVENT_REQUEST_MOVE, {
	                direction: 'prev',
	                initiator: MODULE_NAME
	            });
	        }

	        if(last && last.indexOf(code) >= 0) {
	            $el.trigger(EVENT_REQUEST_MOVE, {
	                direction: 'last',
	                initiator: MODULE_NAME
	            });
	        }

	        if(first && first.indexOf(code) >= 0) {
	            $el.trigger(EVENT_REQUEST_MOVE, {
	                direction: 'first',
	                initiator: MODULE_NAME
	            });
	        }
	    };

	    function Keyboard(params) {
	        var options = $.extend(DEFAULT_OPTIONS, params.options);

	        this.core = params.roller;
	        this.next = options.next;
	        this.prev = options.prev;
	        this.first = options.first;
	        this.last = options.last;
	        this.type = MODULE_TYPE;
	        this.enable();

	        _addListeners.call(this);
	    }

	    Keyboard.prototype.disable = function() {
	        this.enabled = false;
	    };

	    Keyboard.prototype.enable = function() {
	        this.enabled = true;
	    };

	    Keyboard.prototype.destruct = function() {
	        _removeListeners.call(this);
	        this.disable();
	        delete this.core.modules[ MODULE_NAME ];
	    };

	    $.fn[ PLAGIN_NAME ] = function(options) {
	        this.roller.modules[ MODULE_NAME ] = new Keyboard({
	            $el: this,
	            roller: this.roller,
	            options: options
	        });

	        return this;
	    };
	}(jQuery));

/***/ },
/* 11 */
/***/ function(module, exports) {

	(function($) {
	    var MODULE_NAME = 'touch';
	    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
	    var MODULE_TYPE = 'control';

	    var INNER_EVENT_TOUCH_START = 'touch-start';
	    var INNER_EVENT_TOUCH_MOVE = 'touch-move';
	    var INNER_EVENT_TOUCH_END = 'touch-end';

	    var INNER_EVENT_REQUEST_MOVE = 'request-move';
	    var INNER_EVENT_RESTORE_OFFSET = 'restore-offset';

	    var EVENT_MOUSE_DOWN = 'mousedown.' + MODULE_NAME;
	    var EVENT_MOUSE_MOVE = 'mousemove.' + MODULE_NAME;
	    var EVENT_MOUSE_UP = 'mouseup.' + MODULE_NAME;
	    var EVENT_MOUSE_LEAVE = 'mouseleave.' + MODULE_NAME;

	    var EVENT_TOUCH_START = 'touchstart.' + MODULE_NAME;
	    var EVENT_TOUCH_MOVE = 'touchmove.' + MODULE_NAME;
	    var EVENT_TOUCH_END = 'touchend.' + MODULE_NAME;
	    var EVENT_TOUCH_CANSEL = 'touchcancel.' + MODULE_NAME;

	    var DEFAULT_OPTIONS = {
	        mouseEmulate: true
	    };

	    var _addListeners = function() {
	        var module = this;
	        var $wrap = module.core.$wrap;

	        $wrap.on(EVENT_TOUCH_START, function(e) {
	            _processTouchStart.call(module, e);
	        });

	        $wrap.on(EVENT_TOUCH_MOVE, function(e) {
	            _processTouchMove.call(module, e);
	            return false;
	        });

	        $wrap.on(EVENT_TOUCH_END, function(e) {
	            _processTouchEnd.call(module, e);
	        });

	        $wrap.on(EVENT_TOUCH_CANSEL, function(e) {
	            _processTouchEnd.call(module, e);
	        });

	        if(module.mouseEmulate) {
	            $wrap.on(EVENT_MOUSE_DOWN, function(e) {
	                module.isMouseDown = true;
	                _processTouchStart.call(module, e);
	            });

	            $wrap.on(EVENT_MOUSE_MOVE, function(e) {
	                if(module.isMouseDown) {
	                    _processTouchMove.call(module, e);
	                }
	            });

	            $wrap.on(EVENT_MOUSE_UP, function(e) {
	                if(module.isMouseDown) {
	                    _processTouchEnd.call(module, e);
	                    module.isMouseDown = false;
	                }
	            });

	            $wrap.on(EVENT_MOUSE_LEAVE, function(e) {
	                if(module.isMouseDown) {
	                    _processTouchEnd.call(module, e);
	                    module.isMouseDown = false;
	                }
	            });
	        }
	    };

	    var _removeListeners = function() {
	        var $wrap = this.core.$wrap;

	        $wrap.off(EVENT_TOUCH_START);
	        $wrap.off(EVENT_TOUCH_MOVE);
	        $wrap.off(EVENT_TOUCH_END);
	        $wrap.off(EVENT_TOUCH_CANSEL);

	        if(this.mouseEmulate) {
	            $wrap.off(EVENT_MOUSE_DOWN);
	            $wrap.off(EVENT_MOUSE_MOVE);
	            $wrap.off(EVENT_MOUSE_UP);
	            $wrap.off(EVENT_MOUSE_LEAVE);
	        }
	    };

	    var _processTouchStart = function(e) {
	        var module = this;
	        var $el = module.core.$el;

	        module.lastMovement = '';
	        module.startPoint = _getcurrentPoint.call(this, e);

	        $el.trigger(INNER_EVENT_TOUCH_START, {
	            initiator: MODULE_NAME,
	            startPoint: module.startPoint,
	            event: e
	        });
	    };

	    var _processTouchMove = function(e) {
	        var $el = this.core.$el;
	        var currentPoint = _getcurrentPoint.call(this, e);
	        var lastPoint = this.lastPoint || currentPoint;
	        var startPoint = this.startPoint;
	        var offset = startPoint - currentPoint;

	        this.lastMovement = _getMoveDirection.call(this, lastPoint, currentPoint);
	        this.lastPoint = currentPoint;

	        $el.trigger(INNER_EVENT_TOUCH_MOVE, {
	            initiator: MODULE_NAME,
	            offset: offset,
	            event: e
	        });
	    };

	    var _processTouchEnd = function(e) {
	        var $el = this.core.$el;

	        var startPoint = this.startPoint || 0;
	        var finishPoint = this.lastPoint || this.startPoint;

	        var generalMovement = _getMoveDirection.call(this, startPoint, finishPoint);
	        var lastMovement = this.lastMovement || generalMovement;

	        $el.trigger(INNER_EVENT_TOUCH_END, {
	            generalMovement: generalMovement,
	            lastMovement: lastMovement,
	            event: e,
	            initiator: MODULE_NAME
	        });

	        if(generalMovement !== lastMovement) {
	            $el.trigger(INNER_EVENT_RESTORE_OFFSET, {
	                initiator: MODULE_NAME
	            });
	        }

	        if(generalMovement === lastMovement) {
	            var current = this.core.currentScreen;
	            var count = this.core.countScreens;

	            var currentIsFirst = (current === 0);
	            var currentIsLast = (current === count - 1);

	            if(generalMovement === 'next' && !currentIsLast) {
	                return $el.trigger(INNER_EVENT_REQUEST_MOVE, {
	                    direction: 'next',
	                    initiator: MODULE_NAME
	                });
	            }

	            if(generalMovement === 'prev' && !currentIsFirst) {
	                return $el.trigger(INNER_EVENT_REQUEST_MOVE, {
	                    direction: 'prev',
	                    initiator: MODULE_NAME
	                });
	            }

	            $el.trigger(INNER_EVENT_RESTORE_OFFSET, {
	                initiator: MODULE_NAME
	            });
	        }
	    };

	    var _getMoveDirection = function(startPoint, endPoint) {
	        if(startPoint === endPoint) {
	            return this.lastMovement;
	        }

	        return endPoint < startPoint ? 'next' : 'prev';
	    };

	    var _getcurrentPoint = function(e) {
	        var axis = this.core.options.axis;

	        return e[ 'originalEvent' ][ 'page' + axis.toUpperCase() ] ||
	               e[ 'originalEvent' ].changedTouches[ 0 ][ 'page' + axis.toUpperCase() ]; //android chrome
	    };

	    function Touch(params) {
	        var options = $.extend(DEFAULT_OPTIONS, params.options);

	        this.core = params.roller;
	        this.type = MODULE_TYPE;
	        this.mouseEmulate = options.mouseEmulate;
	        this.enable();
	    }

	    Touch.prototype.enable = function() {
	        _addListeners.call(this);
	        this.enabled = true;
	    };

	    Touch.prototype.disable = function() {
	        _removeListeners.call(this);
	        this.enabled = false;
	    };

	    Touch.prototype.destruct = function() {
	        _removeListeners.call(this);
	        delete this.core.modules[ MODULE_NAME ];
	    };

	    $.fn[ PLAGIN_NAME ] = function(options) {
	        this.roller.modules[ MODULE_NAME ] = new Touch({
	            roller: this.roller,
	            options: options
	        });

	        return this;
	    };
	}(jQuery));

/***/ },
/* 12 */
/***/ function(module, exports) {

	var WheelIndicator = (function(win, doc) {
	    var eventWheel = 'onwheel' in doc ? 'wheel' : 'mousewheel',

	        DEFAULTS = {
	            callback: function() {
	            },
	            elem: doc,
	            preventMouse: true
	        };

	    function Module(options) {
	        this._options = extend(DEFAULTS, options);
	        this._deltaArray = [ 0, 0, 0 ];
	        this._isAcceleration = false;
	        this._isStopped = true;
	        this._direction = '';
	        this._timer = '';
	        this._isWorking = true;

	        var self = this;
	        this._wheelHandler = function(event) {
	            if(self._isWorking) {
	                processDelta.call(self, event);

	                if(self._options.preventMouse) {
	                    preventDefault(event);
	                }
	            }
	        };

	        addEvent(this._options.elem, eventWheel, this._wheelHandler);
	    }

	    Module.prototype = {
	        constructor: Module,

	        turnOn: function() {
	            this._isWorking = true;

	            return this;
	        },

	        turnOff: function() {
	            this._isWorking = false;

	            return this;
	        },

	        setOptions: function(options) {
	            this._options = extend(this._options, options);

	            return this;
	        },

	        getOption: function(option) {
	            var neededOption = this._options[ option ];

	            if(neededOption !== undefined) {
	                return neededOption;
	            }

	            throw new Error('Unknown option');
	        },

	        destroy: function() {
	            removeEvent(this._options.elem, eventWheel, this._wheelHandler);

	            return this;
	        }
	    };

	    function triggerEvent(event) {
	        event.direction = this._direction;

	        this._options.callback.call(this, event);
	    }

	    var getDeltaY = function(event) {

	        if(event.wheelDelta && !event.deltaY) {
	            getDeltaY = function(event) {
	                return event.wheelDelta * -1;
	            };
	        } else {
	            getDeltaY = function(event) {
	                return event.deltaY;
	            };
	        }

	        return getDeltaY(event);
	    };

	    function preventDefault(event) {
	        event = event || win.event;

	        if(event.preventDefault) {
	            event.preventDefault();
	        } else {
	            event.returnValue = false;
	        }
	    }

	    function processDelta(event) {
	        var
	            self = this,
	            delta = getDeltaY(event);

	        if(delta === 0) return;

	        var direction = delta > 0 ? 'down' : 'up',
	            arrayLength = self._deltaArray.length,
	            changedDirection = false,
	            repeatDirection = 0,
	            sustainableDirection, i;

	        clearTimeout(self._timer);

	        self._timer = setTimeout(function() {
	            self._deltaArray = [ 0, 0, 0 ];
	            self._isStopped = true;
	            self._direction = direction;
	        }, 150);

	        //check how many of last three deltas correspond to certain direction
	        for(i = 0; i < arrayLength; i++) {
	            if(self._deltaArray[ i ] !== 0) {
	                self._deltaArray[ i ] > 0 ? ++repeatDirection : --repeatDirection;
	            }
	        }

	        //if all of last three deltas is greater than 0 or lesser than 0 then direction is switched
	        if(Math.abs(repeatDirection) === arrayLength) {
	            //determine type of sustainable direction
	            //(three positive or negative deltas in a row)
	            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

	            if(sustainableDirection !== self._direction) {
	                //direction is switched
	                changedDirection = true;
	                self._direction = direction;
	            }
	        }

	        //if wheel`s moving and current event is not the first in array
	        if(!self._isStopped) {
	            if(changedDirection) {
	                self._isAcceleration = true;

	                triggerEvent.call(this, event);
	            } else {
	                //check only if movement direction is sustainable
	                if(Math.abs(repeatDirection) === arrayLength) {
	                    //must take deltas to don`t get a bug
	                    //[-116, -109, -103]
	                    //[-109, -103, 1] - new impulse

	                    analyzeArray.call(this, event);
	                }
	            }
	        }

	        //if wheel is stopped and current delta value is the first in array
	        if(self._isStopped) {
	            self._isStopped = false;
	            self._isAcceleration = true;
	            self._direction = direction;

	            triggerEvent.call(this, event);
	        }

	        self._deltaArray.shift();
	        self._deltaArray.push(delta);
	    }

	    function analyzeArray(event) {
	        var
	            deltaArray0Abs = Math.abs(this._deltaArray[ 0 ]),
	            deltaArray1Abs = Math.abs(this._deltaArray[ 1 ]),
	            deltaArray2Abs = Math.abs(this._deltaArray[ 2 ]),
	            deltaAbs = Math.abs(getDeltaY(event));

	        if((deltaAbs > deltaArray2Abs) &&
	            (deltaArray2Abs > deltaArray1Abs) &&
	            (deltaArray1Abs > deltaArray0Abs)) {

	            if(!this._isAcceleration) {
	                triggerEvent.call(this, event);
	                this._isAcceleration = true;
	            }
	        }

	        if((deltaAbs < deltaArray2Abs) &&
	            (deltaArray2Abs <= deltaArray1Abs)) {
	            this._isAcceleration = false;
	        }
	    }

	    function addEvent(elem, type, handler) {
	        if(elem.addEventListener) {
	            elem.addEventListener(type, handler, false);
	        } else if(elem.attachEvent) {
	            elem.attachEvent('on' + type, handler);
	        }
	    }

	    function removeEvent(elem, type, handler) {
	        if(elem.removeEventListener) {
	            elem.removeEventListener(type, handler, false);
	        } else if(elem.detachEvent) {
	            elem.detachEvent('on' + type, handler);
	        }
	    }

	    function extend(defaults, options) {
	        var extended = {},
	            prop;

	        for(prop in defaults) {
	            if(Object.prototype.hasOwnProperty.call(defaults, prop)) {
	                extended[ prop ] = defaults[ prop ];
	            }
	        }

	        for(prop in options) {
	            if(Object.prototype.hasOwnProperty.call(options, prop)) {
	                extended[ prop ] = options[ prop ];
	            }
	        }

	        return extended;
	    }

	    return Module;
	}(window, document));

	(function($) {
	    var MODULE_NAME = 'wheel';
	    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
	    var MODULE_TYPE = 'control';
	    var EVENT_REQUEST_MOVE = 'request-move';

	    function Wheel(params) {
	        var module = this;
	        var $el = params.$el;

	        module.core = params.roller;
	        module.type = MODULE_TYPE;
	        module.enable();

	        module.indicator = new WheelIndicator({
	            preventMouse: false,
	            elem: module.core.$wrap.get(0),
	            callback: function(e) {
	                if(module.enabled) {
	                    var direction = e.direction && e.direction === 'down' ? 'next' : 'prev';

	                    $el.trigger(EVENT_REQUEST_MOVE, {
	                        direction: direction,
	                        initiator: MODULE_NAME
	                    });
	                }
	            }
	        });
	    }

	    Wheel.prototype.disable = function() {
	        this.enabled = false;
	    };

	    Wheel.prototype.enable = function() {
	        this.enabled = true;
	    };

	    Wheel.prototype.destruct = function() {
	        this.indicator && this.indicator.destroy();
	        this.disable();
	        delete this.core.modules[ MODULE_NAME ];
	    };

	    $.fn[ PLAGIN_NAME ] = function() {
	        this.roller.modules[ MODULE_NAME ] = new Wheel({
	            $el: this,
	            roller: this.roller
	        });

	        return this;
	    };
	}(jQuery));

/***/ },
/* 13 */
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ },
/* 14 */,
/* 15 */
/***/ function(module, exports) {

	(function($) {
	    var PLAGIN_NAME = 'screenroller';
	    var SCREEN_CLASS_NAME = 'screen';
	    var SCREEN_SELECTOR = '> .' + SCREEN_CLASS_NAME;
	    var WRAP_CLASS_NAME = 'wrap-roller';
	    var WRAP_NODE = '<div class="' + WRAP_CLASS_NAME + '"></div>';
	    var EVENT_REQUEST_MOVE = 'request-move';
	    var EVENT_MOVE_SCREEN = 'move-screen';
	    var PROPERTY_NAME = 'roller';
	    var DEFAULT_OPTIONS = {
	        modules: {
	            touch: true,
	            'slide-animation': true,
	            wheel: true,
	            menu: false,
	            keyboard: true,
	            hash: false,
	            'simple-page': false
	        },
	        speed: 500,
	        axis: 'y'
	    };
	    
	    var _getNextScreen = function(direction) {
	        var nextIndex = -1;
	        var currentIndex = this.currentScreen;
	        var countScreens = this.countScreens;

	        if(typeof direction === 'number') {
	            nextIndex = direction;
	        }

	        if(typeof direction === 'string') {
	            switch(direction) {
	            case 'prev':
	                nextIndex = currentIndex - 1;
	                break;
	            case 'next':
	                nextIndex = currentIndex + 1;
	                break;
	            case 'last':
	                nextIndex = countScreens - 1;
	                break;
	            case 'first':
	                nextIndex = 0;
	                break;
	            default:
	                nextIndex = -1;
	            }
	        }

	        if((nextIndex < 0) ||
	            (nextIndex > countScreens - 1) ||
	            (nextIndex === currentIndex)) {
	            nextIndex = -1;
	        }

	        return nextIndex;
	    };

	    var _initModules = function() {
	        var $el = this.$el;
	        var modules = this.options.modules;

	        this.modules = {};

	        $.each(modules, function(name, params) {
	            //if params null or false
	            if(params) {
	                //if params is boolean, when replace to object(write options in modules)
	                if(params === true) {
	                    modules[ name ] = {};
	                }

	                if(typeof($.fn[ PLAGIN_NAME + '-' + name ]) === 'function') {
	                    $el[ PLAGIN_NAME + '-' + name ](params);
	                } else {
	                    // eslint-disable-next-line no-console
	                    console && console.error('module ' + name + ' do not connect', 'error');
	                }
	            }
	        });
	    };

	    var _destructModules = function() {
	        var modules = this.modules;

	        $.each(modules, function(name) {
	            modules[ name ].destruct();
	        });
	    };

	    var _unwrap = function() {
	        this.$wrap.replaceWith(this.$el);
	    };

	    var _wrap = function() {
	        return this.$el.wrap(WRAP_NODE).parent();
	    };

	    var _move = function(params) {
	        if(this.enabled) {
	            var speed = params.speed;
	            var initiator = params.initiator;
	            var nextScreen = _getNextScreen.call(this, params.direction);

	            speed = speed >= 0 ? speed : this.options.speed;

	            if(nextScreen !== -1) {
	                this.currentScreen = nextScreen;

	                this.$el.trigger(EVENT_MOVE_SCREEN, {
	                    index: nextScreen,
	                    speed: speed,
	                    initiator: initiator
	                });
	            }
	        }
	    };

	    var _addListeners = function() {
	        var roller = this;

	        this.$el.on(EVENT_REQUEST_MOVE, function(e, params) {
	            _move.call(roller, params);
	        });
	    };

	    var _removeListeners = function() {
	        this.$el.off(EVENT_REQUEST_MOVE);
	    };

	    var _setStyles = function() {
	        this.$wrap.addClass('axis-' + this.options.axis);
	    };

	    var _removeStyles = function() {
	        this.$wrap.removeClass('axis-' + this.options.axis);
	    };

	    var ScreenRoller = function(params) {
	        this.$el = params.$el;
	        this.$el.roller = this;

	        this.options = $.extend(true, DEFAULT_OPTIONS, params.options);
	        this.nodes = {
	            $win: $(window),
	            $doc: $(document),
	            $body: $('body'),
	            $htmlbody: $('html, body')
	        };

	        this.$screens = this.$el.find(SCREEN_SELECTOR);
	        this.countScreens = this.$screens.size();
	        this.currentScreen = 0;
	        this.$wrap = _wrap.call(this);

	        this.$el.moveTo = this.moveTo.bind(this);

	        this.$el.data(PROPERTY_NAME, this);

	        this.enable();
	        _setStyles.call(this);
	        _addListeners.call(this);
	        _initModules.call(this);
	    };

	    ScreenRoller.prototype.enable = function() {
	        this.enabled = true;
	    };

	    ScreenRoller.prototype.disable = function() {
	        this.enabled = false;
	    };

	    ScreenRoller.prototype.destruct = function() {
	        var $el = this.$el;

	        _removeStyles.call(this);
	        _removeListeners.call(this);
	        _destructModules.call(this);
	        _unwrap.call(this);

	        delete $el.moveTo;
	        delete $el.data().roller;
	        delete $el.roller;
	    };

	    ScreenRoller.prototype.moveTo = function(direction, speed) {
	        _move.call(this, {
	            direction: direction,
	            speed: speed || 0,
	            initiator: 'user'
	        });
	    };

	    $.fn[ PLAGIN_NAME ] = function(options) {
	        new ScreenRoller({
	            $el: this,
	            options: options
	        });

	        return this;
	    };
	}(jQuery));

/***/ },
/* 16 */
/***/ function(module, exports) {

	(function($) {
	    var MODULE_NAME = 'hash';
	    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
	    var MODULE_TYPE = 'navigation';
	    var EVENT_SCREEN_MOVE = 'move-screen';
	    var EVENT_REQUEST_MOVE = 'request-move';
	    var EVENT_CHANGE_HASH = 'hashchange.' + MODULE_NAME;
	    var $WIN = $(window);

	    var _getHash = function() {
	        return window.location.hash.replace('#', '');
	    };

	    var _setHash = function(hash) {
	        window.location.hash = hash;
	    };

	    var _onHashWatcher = function() {
	        var module = this;

	        setTimeout(function() {
	            $WIN.on(EVENT_CHANGE_HASH, function() {
	                if(module.enabled) {
	                    _processingChangeHash.call(module);
	                }
	            });
	        }, 10);
	    };

	    var _offHashWatcher = function() {
	        $WIN.off(EVENT_CHANGE_HASH);
	    };

	    var _addListeners = function() {
	        var module = this;
	        var $el = this.core.$el;

	        $el.on(EVENT_SCREEN_MOVE, function(e, data) {

	            if(module.enabled) {
	                _processingRequestMove.call(module, data.index);
	            }
	        });

	        _onHashWatcher.call(module);
	    };

	    var _processingRequestMove = function(index) {
	        _offHashWatcher.call(this);

	        this.screensHash[ index ] ? _setHash(this.screensHash[ index ]) : null;

	        _onHashWatcher.call(this);
	    };

	    var _processingChangeHash = function() {
	        var hash = _getHash();
	        var index = this.screensHash.indexOf(hash);
	        var $el = this.core.$el;

	        if(index !== -1) {
	            $el.trigger(EVENT_REQUEST_MOVE, {
	                direction: index,
	                initiator: MODULE_NAME
	            });
	        }
	    };

	    var _removeListeners = function() {
	        var $el = this.core.$el;

	        $el.off(EVENT_SCREEN_MOVE);
	        _offHashWatcher();
	    };

	    function Hash(params) {
	        this.core = params.roller;
	        this.$el = params.$el;

	        this.screensHash = $.map(this.core.$screens, function(screen) {
	            return $(screen).attr('data-hash') || '';
	        });

	        this.type = MODULE_TYPE;
	        this.enable();

	        _addListeners.call(this);

	        //check at initialization
	        var hash = _getHash();
	        var index = this.screensHash.indexOf(hash);

	        if(index !== -1) {
	            this.$el.trigger(EVENT_REQUEST_MOVE, {
	                direction: index,
	                initiator: MODULE_NAME
	            });
	        } else {
	            _setHash(this.screensHash[ 0 ]);
	        }
	    }

	    Hash.prototype.enable = function() {
	        this.enabled = true;
	    };

	    Hash.prototype.disable = function() {
	        this.enabled = false;
	    };

	    Hash.prototype.destruct = function() {
	        _removeListeners.call(this);
	        this.disable();
	        delete this.core.modules[ MODULE_NAME ];
	    };

	    $.fn[ PLAGIN_NAME ] = function() {
	        this.roller.modules[ MODULE_NAME ] = new Hash({
	            $el: this,
	            roller: this.roller
	        });

	        return this;
	    };
	}(jQuery));

/***/ },
/* 17 */
/***/ function(module, exports) {

	(function($) {
	    var MODULE_NAME = 'menu';
	    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
	    var MODULE_TYPE = 'navigation';
	    var EVENT_CLICK = 'click.' + MODULE_NAME;
	    var EVENT_REQUEST_MOVE = 'request-move';

	    var _addListeners = function() {
	        var module = this;
	        var $el = this.core.$el;
	        module.$items.on(EVENT_CLICK, function() {
	            if(module.enabled) {
	                $el.trigger(EVENT_REQUEST_MOVE, {
	                    direction: $(this).index(),
	                    type: MODULE_NAME
	                });
	            }
	        });
	    };

	    var _removerListeners = function() {
	        this.$items.off(EVENT_CLICK);
	    };

	    function Menu(params) {
	        this.$items = params.options.items.slice();
	        this.core = params.roller;
	        this.type = MODULE_TYPE;
	        this.enable();

	        _addListeners.call(this);
	    }

	    Menu.prototype.enable = function() {
	        this.enabled = true;
	    };

	    Menu.prototype.disable = function() {
	        this.enabled = false;
	    };

	    Menu.prototype.destruct = function() {
	        this.disable();
	        _removerListeners.call(this);
	        delete this.core.modules[ MODULE_NAME ];
	    };

	    $.fn[ PLAGIN_NAME ] = function(options) {
	        this.roller.modules[ MODULE_NAME ] = new Menu({
	            $el: this,
	            roller: this.roller,
	            options: options
	        });

	        return this;
	    };
	}(jQuery));

/***/ }
/******/ ]);