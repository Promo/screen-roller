(function($) {
    var MODULE_NAME = 'simple-page';
    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
    var EVENT_RESIZE = 'resize.' + MODULE_NAME;
    var EVENT_ORINTATIONCHANGE = 'orientationchange.' + MODULE_NAME;
    var EVENT_SCROLL = 'scroll.' + MODULE_NAME;
    var EVENT_MOVE_SCREEN = 'move-screen.' + MODULE_NAME;
    var EVENT_TURNED_ON = 'module-has-turned-on.' + MODULE_NAME;
    var EVENT_TURNED_OFF = 'module-has-turned-off.' + MODULE_NAME;
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
        var module = this;

        if(!speed || speed == 0) {
            return $wrap.scrollTop(value);
        }

        $wrap.stop().animate({ scrollTop: value }, speed, function() {
            $el.trigger(EVENT_SCREEN_CHANGED, {
                direction: index,
                initiator: 'MODULE_NAME',
                unique: module.core.unique
            });
        });
    };

    var _trackPosition = function() {
        this.offsets = this.offsets || _calcOffsetsScreen.call(this);

        var offsets = this.offsets.slice();
        var currentScreen = this.core.currentScreen;
        var screenInView = _detectCurrentScreen.call(this, offsets);
        var module = this;

        if(screenInView !== 'undefined' && screenInView !== currentScreen) {
            this.core.$el.trigger(EVENT_REQUEST_MOVE, {
                direction: screenInView,
                speed: 0,
                initiator: MODULE_NAME,
                unique: module.core.unique
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

            module.core.$el.trigger(EVENT_TURNED_ON, {
                initiator: MODULE_NAME,
                type: MODULE_TYPE,
                unique: module.core.unique
            });

            setTimeout(function() {
                module.offsets = _calcOffsetsScreen.call(module);
                _scrollTo.call(module, module.core.currentScreen);
            }, 10);
        }

        if((wrapWidth > minWidth) && (wrapHeight > minHeight) && (module.enabled)) {
            module.disable();

            module.core.$el.trigger(EVENT_TURNED_OFF, {
                initiator: MODULE_NAME,
                type: MODULE_TYPE,
                unique: module.core.unique
            });
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

        //https://github.com/Promo/screen-roller/issues/9
        $win.on(EVENT_ORINTATIONCHANGE, function() {
            if(module.watching) {
                $win.scrollTop(0);
                setTimeout(function(){
                    $win.scrollTop(0);
                }, 500);
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
        $win.off(EVENT_ORINTATIONCHANGE); //https://github.com/Promo/screen-roller/issues/9
    };

    function SimplePage(params) {
        var options = $.extend(true, {}, DEFAULT_OPTIONS, params.options);

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