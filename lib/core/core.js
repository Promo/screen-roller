(function($){
    if (typeof Object.create !== "function") {
        Object.create = function (obj) {
            function F() {}
            F.prototype = obj;
            return new F();
        };
    }

    function testSupportsTransitions() {
        return typeof document.body.style['transition'] === 'string' ? 'transition' : false;
    };

    function testSupportsTransform3D() {
        var p,
            ps = ['transform', 'WebkitTransform', 'MozTransform', 'OTransform', 'msTransform'],
            div = document.createElement('div');

        while(p = ps.shift()) {
            if(div && div.style[p] !== undefined) {
                return p;
            }
        }
        return false;
    };

    var ScreenRoller = {
        init: function(el, options) {

            this.el = el;
            this.options = options;
            this.body = $('body');
            this.html = $('html');
            this.htmlbody = $('html, body');
            this.win = $(window);

            this.transition = testSupportsTransitions();
            this.transform3d = testSupportsTransform3D();

            this.typeAnimation = this.determineTypeAnimation();
            this.currentScreen = this.getIndexStartScreen();
            this.screens = this.findScreens();

            el.roller = this;
            el.moveTo = this.moveTo.bind(this);
            el.removeInlineStyle = this.removeInlineStyle.bind(this);
            el.removeCSSTransition = this.removeCSSTransition.bind(this);

            this.bindEvents();
        },

        moveTo: function(direction, speed) {
            var nextScreen = this.getNextScreen(direction);

            if(nextScreen >= 0) {
                speed = (speed >= 0) ? speed : this.options.speedanimation;

                this.runFunctionAnimation(nextScreen, speed);
                this.currentScreen = nextScreen;
            }
        },

        runFunctionAnimation: function() {
            return false;
        },

        getNextScreen: function(direction) {
            var nextIndexScreen;

            if(typeof direction  === 'string') {
                nextIndexScreen = (direction === 'prev') ? this.currentScreen - 1 : this.currentScreen + 1;
            }

            if(typeof direction === 'number') {
                nextIndexScreen = direction;
            }

            if( (nextIndexScreen < 0) ||
                (nextIndexScreen > this.countScreens - 1) ||
                    //(nextIndexScreen === this.roller.currentScreen) ||
                (typeof nextIndexScreen !== 'number') ) {
                return -1;
            }

            return nextIndexScreen;
        },

        determineTypeAnimation: function() {
            if(this.transition && this.transform3d) {
                return 'animateTransform';
            } else {
                return 'animateOffset';
            }
        },

        getIndexStartScreen: function() {
            return this.options.startScreen ? this.options.startScreen : 0;
        },

        findScreens: function() {
            var screens =  this.el.find('.' + this.options.screenClass);

            this.countScreens = screens.size();

            return screens;
        },

        bindEvents: function() {
            var el = this.el,
                roller = this;

            el.on('changeCurrentScreen', function(e, data) {
                el.roller.options.afterMove(data.index);
            });

            el.on('solid-mod-ON', function() {
                roller.options.onSolidMod();

                //выключаем модуль touch
                roller.offEventsTouch && roller.offEventsTouch();

                //выключаем модуль wheel
                roller.offEventsWheel && roller.offEventsWheel();
            });

            el.on('solid-mod-OFF', function() {
                el.roller.options.onScreenMod();

                //включаем модуль touch
                roller.bindEventsTouch && roller.bindEventsTouch();

                //включаем модуль wheel
                roller.bindEventsWheel && roller.bindEventsWheel();
            });
        },

        removeCSSTransition: function() {
            this.el.css('transition', '0s');
        },

        removeInlineStyle: function(target) {
            target = target || this.el;

            if(target) {
                target.attr('style', '');
            }
        },

        setClass: function(className) {
            this.el.addClass(className);
        },

        delClass: function(className) {
            this.el.removeClass(className);
        },

        removeClass: function(className) {
            this.el.removeClass(className);
        },

        initModules: function() {
            var el = this.el,
                modules = [
                    'screenroller-base-animation',
                    'screenroller-influx-animation',
                    'screenroller-wheel',
                    'screenroller-hash',
                    'screenroller-touch',
                    'screenroller-solid-mod'
                ];

            $.each(modules, function(index, module) {
                if(typeof($.fn[module]) === 'function') {
                    el[module]();
                }
            });
        }
    };


    $.fn.screenroller = function(options) {

        options = $.extend({
            speedanimation: 1000,
            baseClass: 'roller',
            screenClass: 'screen',
            screenPageClass: 'screen-page',
            solidPageClass: 'solid-page',
            minHeight : 500,
            minWidth: 700,
            startScreen: null,

            //influx animation params
            influxDirectionAnimation: 'from-right',
            reverseAnimation: false,

            //base animation params
            axisMove: 'x',

            //touch params
            mouseEmulateTouch: false,

            //callbacks
            beforeInit: function(){},
            afterInit: function(){},
            beforeMove: function(){},
            afterMove: function(){},
            changeScreen: function() {},
            movement: function(){},
            onScreenMod: function(){},
            onSolidMod: function(){}
        }, options);

        var roller = Object.create(ScreenRoller);

        roller.init(this, options);
        roller.initModules();

        this.moveTo(roller.currentScreen, 0);

        console.log(this);
        return this;
    };
}(jQuery));