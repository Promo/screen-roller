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
    }

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
    }

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
                speed = (speed >= 0) ? speed : roller.options.speedAnimation;

                roller.runFunctionAnimation(nextScreen, speed);
                roller.currentScreen = nextScreen;
            }
        },

        beforeChangeSlide: function(index) {
            this.options.beforeMove();
            this.el.trigger('before-change-slide', { index: index });
        },

        afterChangeSlide: function(index) {
            this.options.afterMove();
            this.el.trigger('after-change-slide', { index: index });
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

        initModules: function(modules) {
            var el = this.el;
            
            $.each(modules, function(name, params) {
                if(typeof($.fn['screenroller-' + name]) === 'function') {
                    el['screenroller-' + name](params);
                } else {
                    console.error('module ', name,' do not connect');
                }
            });
        }
    };


    $.fn.screenroller = function(options) {

        options = $.extend(true, {
            modules: {
                hash: false,
                wheel: false,
                touch: false,
                menu: false,
                keyboard: false,
                'slide-animation': false,
                'influx-animation': false,
                'solid-mod': false
            },
            startSlide: 0,
            speedAnimation: 500,
            axisMove: 'y',
            baseClass: 'roller',
            screenClass: 'screen',
            beforeInit: function() {},
            afterInit: function() {},
            beforeMove: function() {},
            afterMove: function() {}
        }, options);

        options.beforeInit();

        var roller = Object.create(ScreenRoller);
        roller.init(this, options);
        roller.initModules(options.modules);

        options.afterInit();

        this.moveTo(roller.currentScreen, 0);

        return this;
    };
}(jQuery));