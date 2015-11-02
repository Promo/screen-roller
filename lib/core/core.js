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
            var roller = this;

            roller.el   = el;
            roller.win  = $(window);
            roller.body = $('body');
            roller.html = $('html');
            roller.htmlbody = $('html, body');
            roller.options  = options;

            roller.transition  = testSupportsTransitions();
            roller.transform3d = testSupportsTransform3D();

            roller.currentScreen = roller.getIndexStartScreen();
            roller.screens       = roller.findScreens();

            el.roller = roller;
            el.moveTo = roller.moveTo.bind(roller);
        },

        moveTo: function(direction, speed) {
            var roller = this,
                nextScreen = roller.getNextScreen(direction);

            if(nextScreen >= 0) {
                speed = (speed >= 0) ? speed : roller.options.speedanimation;

                roller.runFunctionAnimation(nextScreen, speed);
                roller.currentScreen = nextScreen;
            }
        },

        runFunctionAnimation: function() {
            return false;
        },

        getNextScreen: function(direction) {
            var roller = this,
                nextIndexScreen;

            if(typeof direction  === 'string') {
                nextIndexScreen = (direction === 'prev') ? roller.currentScreen - 1 : roller.currentScreen + 1;
            }

            if(typeof direction === 'number') {
                nextIndexScreen = direction;
            }

            if( (nextIndexScreen < 0) ||
                (nextIndexScreen > roller.countScreens - 1) ||
                (typeof nextIndexScreen !== 'number') ) {
                return -1;
            }

            return nextIndexScreen;
        },

        getIndexStartScreen: function() {
            var options = this.options;

            return options.startScreen ? options.startScreen : 0;
        },

        findScreens: function() {
            var roller = this,
                screens = roller.el.find('.' + roller.options.screenClass);

            roller.countScreens = screens.size();

            return screens;
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
            influxDir: 'from-right',
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
            spinWheel: function(){},
            offSolidMod: function(){},
            onSolidMod: function(){}
        }, options);

        var roller = Object.create(ScreenRoller);

        roller.init(this, options);
        roller.initModules();

        this.moveTo(roller.currentScreen, 0);

        return this;
    };
}(jQuery));