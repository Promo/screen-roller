(function($){
    $.fn.screenroller = function(options) {
        var roller = {};

        options = $.extend({
            speedanimation: 1000,
            'baseClass': 'roller',
            'screenClass': 'screen',
            'screenPageClass': 'screen-page',
            'solidPageClass': 'solid-page',
            'minHeight' : 500,
            'minWidth': 700,
            'startScreen': null,

            //influx animation params
            'directionAnimation': 'from-right',
            'reverseAnimation': false,

            //touch params
            'mouseEmulateTouch': false,

            //callbacks
            'beforeInit': function(){},
            'afterInit': function(){},
            'afterMove': function(){},
            'changeScreen': function() {},
            'movement': function(){}
        }, options);

        roller.$screens = this.find('.' + options.screenClass);
        roller.countScreens = roller.$screens.size();

        this.roller = $.extend(roller, options);

        methods.init.call(this);

        return this;
    };

    var methods = $.fn.screenroller.prototype;

    methods.build = {};

    methods.init = function() {

        this.roller.beforeInit();

        this.roller.transition = methods.supportsTransitions.call(this);
        this.roller.transform3d = methods.supportsTransform3D.call(this);
        this.roller.typeAnimation = methods.determineTypeAnimation.call(this);

        this.moveTo = methods.moveTo;
        this.removeCSSTransition = removeCSSTransition;
        this.setTransform = setTransform;

        this.roller.currentScreen = this.roller.currentScreen || methods.getFirstScreen.call(this);
        methods.bindEvents.call(this);
        methods.initModules.call(this);

        this.moveTo(this.roller.currentScreen, 0);

        this.roller.afterInit();

        //console.log(this.roller.transition, ' - this.roller.transition');
        //console.log(this.roller.transform3d, ' - this.roller.transform3d');
        //console.log(this.roller.typeAnimation, ' - this.roller.typeAnimation');
    };

    methods.bindEvents = function() {
        var c = this;

        c.on('changeCurrentScreen', function(e, data) {
            c.roller.afterMove(data.index);
        });

        c.on('turnOnSolidMod', function() {
            c.roller.onSolidMod();

            //выключаем модуль touch
            c.offEventsTouch && c.offEventsTouch();

            //выключаем модуль wheel
            c.offEventsWheel && c.offEventsWheel();
        });

        c.on('turnOnScreenMod', function() {
            c.roller.onScreenMod();

            //включаем модуль touch
            c.bindEventsTouch && c.bindEventsTouch();

            //включаем модуль wheel
            c.bindEventsWheel && c.bindEventsWheel();
        });
    };

    methods.initModules = function() {
        var m,
            initFunction;

        for(m in methods.build) {
            initFunction = methods[m + 'Init'];
            initFunction && initFunction.call(this);
        }
    };

    methods.getFirstScreen = function() {
        return this.roller.startScreen ? this.roller.startScreen : 0;
    };

    methods.moveTo = function(direction, speed) {
        var nextScreen = methods.getNextScreen.call(this, direction),
            animateFunction;


        if(nextScreen >= 0) {
            speed = (speed >= 0) ? speed : this.roller.speedanimation;

            animateFunction = methods.selectAnimate.call(this);
            animateFunction.call(this, nextScreen, speed);

            this.roller.currentScreen = nextScreen;
        }
    };

    methods.getNextScreen = function(direction) {
        var nextIndexScreen;

        if(typeof direction  === 'string') {
            nextIndexScreen = (direction === 'up') ? this.roller.currentScreen - 1 : this.roller.currentScreen + 1;
        }

        if(typeof direction === 'number') {
            nextIndexScreen = direction;
        }

        if( (nextIndexScreen < 0) ||
            (nextIndexScreen > this.roller.countScreens - 1) ||
                //(nextIndexScreen === this.roller.currentScreen) ||
            (typeof nextIndexScreen !== 'number') ) {
            return -1;
        }

        return nextIndexScreen;
    };

    methods.selectAnimate = function() {
        return methods.selectPropertyAnimate.call(this);
    };

    methods.selectPropertyAnimate = function() {
        return methods[this.roller.typeAnimation];
    };

    methods.supportsTransitions = function() {
        return typeof document.body.style['transition'] === 'string' ? 'transition' : false;
    };

    methods.supportsTransform3D = function() {
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

    methods.determineTypeAnimation = function() {
        var r = this.roller;

        return (r.transition && r.transform3d) ? 'animateTransform' : 'animateOffset';
    };

    function removeCSSTransition() {
        this.css('transition', '0s');
    }

    function setTransform(value, axis) {
        var offset = { x: 0, y: 0 };

        axis === 'x' ? offset.x = value : offset.y = value;

        this.css('transform', 'translate3d(' + offset.x + 'px, ' + offset.y + 'px, 0)');
    }
}(jQuery));