(function ($) {
    var MODULE_TYPE = 'animation';
    var MODULE_NAME = 'fade-animation';
    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
    var CURRENT_NAME = 'screenroller__current';
    var NEXT_NAME = 'screenroller__next';

    var EVENT_MOVE_SCREEN = 'move-screen.' + MODULE_NAME;
    var EVENT_TURNED_ON = 'module-has-turned-on.' + MODULE_NAME;
    var EVENT_TOUCH_START = 'touch-start';
    var EVENT_TOUCH_MOVE = 'touch-move';
    var EVENT_TOUCH_END = 'touch-end';
    var EVENT_TOUCH_CANSEL = 'touch-cansel';
    var EVENT_RESTORE_OFFSET = 'restore-offset';
    var EVENT_FINISHED_ANIMATION = 'finished-animation';

    var _setStyles = function () {
        this.core.$wrap.addClass(MODULE_NAME);
    };

    var _removeStyles = function () {
        this.core.$wrap.removeClass(MODULE_NAME);
        this.core.$screens.attr('style', '').removeClass(NEXT_NAME).removeClass(CURRENT_NAME);
    };

    var _clearSpeed = function () {
        this.core.$screens.css('transition-duration', '');
    };

    var _getTransitionValue = function () {
        var axis = this.core.options.axis;
        var index = this.core.currentScreen;

        var $el = this.core.$screens.eq(index);
        var transformValues = $el.css('transform').split(', ');

        if (!transformValues || transformValues.length < 2) {
            return 0;
        }

        return axis === 'x' ? parseInt(transformValues[4]) : parseInt(transformValues[5]);
    };

    var _cssTransitionByDirections = function (directions) {
        if (directions < 0) {
            directions = -1;
        } else if (directions > 0) {
            directions = 1;

        }
        var offset = directions * (this.core.options.offset || 30);
        return ({
            y: 'translate3d(0, ' + offset + '%, 0)',
            x: 'translate3d(' + offset + '%, 0, 0)'
        })[this.core.options.axis];
    };

    var _buildTransitionByValue = function (value) {
        return ({
            x: ('translate3d(' + value + 'px, 0, 0)'),
            y: ('translate3d(0, ' + value + 'px, 0)')
        })[this.core.options.axis];
    };

    var _execTouchOffset = function (offest) {
        var index = this.core.currentScreen;

        var $el = this.core.$screens.eq(index);
        var value = _buildTransitionByValue.call(this, this.touchStart - offest);

        $el.css('transition-duration', '0s');
        $el.css('transform', value);
    };

    var _invetDirections = function (directions) {
        if (directions < 0) {
            directions = 1;
        } else if (directions > 0) {
            directions = -1;
        }
        return directions;
    };

    var _moveSection = function ($el, start, to) {
        var cssTransitionByDirections = _cssTransitionByDirections.bind(this);

        $el.css('transform', cssTransitionByDirections(start));
        _setSpeed(this.core.options.speed, $el);
        $el.css({
            'opacity': to === 0 ? 1 : 0,
            'transform': cssTransitionByDirections(to),
            'z-index': to === 0 ? 1 : 0
        });
    };

    var _animate = function (data) {
        var clearSpeed = _clearSpeed.bind(this);
        var moveSection = _moveSection.bind(this);

        var module = this;
        var index = data.index;
        var $el = this.core.$el;
        var $screens = this.core.$screens;
        var $current = $screens.eq(index);
        var $old = this.core.$screens.eq(this.core.oldScreens);
        var directions =  this.core.oldScreens-data.index ;

        clearSpeed();
        moveSection($old, 0, directions);
        moveSection($current, _invetDirections(directions), 0);

        this.core.oldScreens = index;

        $screens.off('transitionend webkitTransitionEnd');
        $current.on('transitionend webkitTransitionEnd', function () {
            $el.trigger(EVENT_FINISHED_ANIMATION, {
                direction: index,
                initiator: MODULE_NAME,
                unique: module.core.unique
            });
        }.bind(this));
    };

    var _addListeners = function () {
        var module = this;
        var $el = this.core.$el;

        $el.on(EVENT_MOVE_SCREEN, function (e, data) {
            if (module.enabled && data.unique === module.core.unique) {
                _animate.call(module, data);
                return false;
            }
        });

        $el.on(EVENT_TURNED_ON, function (e, data) {
            if (data.initiator === MODULE_NAME) {
                _animate.call(module, {
                    index: module.core.currentScreen,
                    speed: 0
                });
            }
        });

        $el.on(EVENT_TOUCH_START, function () {
            module.touchStart = _getTransitionValue.call(module);
            var index = this.core.currentScreen;

            var $screen = this.core.$screens.eq(index);
            $screen.css('transition-duration', '0s'); // TODO
            $screen.css('transform', _buildTransitionByValue.call(module, module.touchStart));
        });

        $el.on(EVENT_TOUCH_END, function () {
            delete module.touchStart;
        });

        $el.on(EVENT_TOUCH_CANSEL, function () {
            delete module.touchStart;
        });

        $el.on(EVENT_TOUCH_MOVE, function (e, data) {
            _execTouchOffset.call(module, data.offset); //TODO
        });

        $el.on(EVENT_RESTORE_OFFSET, function () {
            _animate.call(module, {
                index: module.core.currentScreen,
                speed: module.core.options.speed / 2
            });
        });
    };

    var _removeListeners = function () {
        var $el = this.core.$el;

        $el.off(EVENT_MOVE_SCREEN);
        $el.off(EVENT_TURNED_ON);
    };

    var _setStartState = function () {
        var cssTransitionByDirections = _cssTransitionByDirections.bind(this);

        var index = this.core.currentScreen;

        var $screens = this.core.$screens;
        this.core.oldScreens = index;
        var to = 0;
        for (var i = 0; i < this.core.countScreens; i++) {
            if (index < i) {
                to = 1;
            } else if (index === i) {
                to = 0;
            } else if (index > i) {
                to = -1;
            }
            var $el = $screens.eq(i);
            $el.css({
                'opacity': to === 0 ? 1 : 0,
                'transform': cssTransitionByDirections(to),
                'z-index': to === 0 ? 1 : 0
            });
        }

    }
        ;

    var _setSpeed = function (speed, $el) {
        speed = speed === 0 ? 1 : speed;
        $el.css('transition-duration', speed / 1000 + 's');
    };


    function FadeeAnimation(params) {
        this.core = params.roller;
        this.type = MODULE_TYPE;
        this.enable();


        _setStartState.call(this);
        _addListeners.call(this);
    }

    FadeeAnimation.prototype.enable = function () {
        if (!this.enabled) {
            this.enabled = true;
            this.core.$el.trigger(EVENT_TURNED_ON, {
                initiator: MODULE_NAME,
                type: MODULE_TYPE
            });
            _setStyles.call(this);
        }
    };

    FadeeAnimation.prototype.disable = function () {
        _removeStyles.call(this);
        this.enabled = false;
    };

    FadeeAnimation.prototype.destruct = function () {
        this.disable();
        _removeStyles.call(this);
        _removeListeners.call(this);
        delete this.core.modules[MODULE_NAME];
    };

    $.fn[PLAGIN_NAME] = function () {
        this.roller.modules[MODULE_NAME] = new FadeeAnimation({
            $el: this,
            roller: this.roller
        });

        return this;
    };
}(jQuery));