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
        var module = this;
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
                initiator: MODULE_NAME,
                unique: module.core.unique
            });
        });
    };

    var _addListeners = function() {
        var module = this;
        var $el = this.core.$el;

        $el.on(EVENT_MOVE_SCREEN, function(e, data) {
            if(module.enabled && data.unique === module.core.unique) {
                _animate.call(module, data);
                return false;
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