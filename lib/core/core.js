(function($) {
    var PLAGIN_NAME = 'screenroller';
    var SCREEN_CLASS_NAME = 'screen';
    var SCREEN_SELECTOR = '.' + SCREEN_CLASS_NAME;
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