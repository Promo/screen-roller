(function($){
    $.fn.screenroller = function(options) {
        var roller = {},
            data3d = methods.get3dData();

        options = $.extend({
            speedanimation: 500,
            'baseClass': 'roller',
            'screenClass': 'screen',
            'screenPageClass': 'screen-page',
            'solidPageClass': 'solid-page',
            'minHeight' : 500,
            'minWidth': 700,
            'startScreen': null,
            //influx animation
            'directionAnimation': 'from-right',
            'reverseAnimation': false,
            'beforeInit': function(){},
            'afterInit': function(){},
            'afterMove': function(){},
            'changeScreen': function() {}
        }, options);

        roller.$screens = this.find('.' + options.screenClass);
        roller.countScreens = roller.$screens.size();

        roller.support3d = !!data3d.transform3d;
        roller.transformPrefix = data3d.transformPrefix;

        this.roller = $.extend(roller, options);

        methods.init.call(this);

        return this;
    };

    var methods = $.fn.screenroller.prototype;

    methods.build = {};

    methods.init = function() {

        this.roller.beforeInit();

        this.moveTo = methods.moveTo;

        this.roller.currentScreen = this.roller.currentScreen || methods.getFirstScreen.call(this);
        methods.initModules.call(this);
        methods.bindEvents.call(this);

        this.moveTo(this.roller.currentScreen, 0);

        this.roller.afterInit();
    };

    methods.bindEvents = function() {
        var c = this;

        c.on('changeCurrentScreen', function(e, data) {
            c.roller.afterMove(data.index);
        });

        c.on('turnOnSolidMod', function() {
            c.roller.onSolidMod();
        });

        c.on('turnOnScreenMod', function() {
            c.roller.onScreenMod();
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

    methods.get3dData = function() {
        var $tempNode = $('<div></div>'),
            result = {};

        $('body').append($tempNode);

        $.each([ '-webkit-transform', '-o-transform',  '-ms-transform', '-moz-transform', 'transform' ], function(i, val) {
            $tempNode.css(val, 'translate3d(-1px, 0px, -1px)');
            $tempNode.css(val) && $tempNode.css(val).match(/matrix3d/) ? result.transformPrefix = val : '';
        });

        $tempNode.remove();
        result.transform3d = result.transformPrefix ? 'support3d' : 'notSupport3d';

        return result;
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
        return methods.move3d
    };

}(jQuery));