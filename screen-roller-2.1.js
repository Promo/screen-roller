(function($){
    $.fn.screenroller = function(options) {
        var roller = {},
            data3d = methods.get3dData();

        options = $.extend({
            animationSpeed: 500,
            'baseClass': 'roller',
            'screenClass': 'screen',
            'screenPageClass': 'screen-page',
            'solidPageClass': 'solid-page',
            'minHeight' : 500,
            'minWidth': 700,
            'startScreen': null,
            'beforeInit': function(){},
            'afterInit': function(){},
            'afterMove': function(){},
            'changeScreen': function() {}
        }, options);

        roller.$screens = this.find('.' + options.screenClass);
        roller.countScreens = roller.$screens.size();
        roller.support3d = data3d.transform3d;
        roller.transformPrefix = data3d.transformPrefix;

        this.roller = $.extend(roller, options);

        methods.init.call(this);

        return this;
    };

    var methods = $.fn.screenroller.prototype;

    methods.build = {};

    methods.init = function() {
        this.roller.beforeInit();
        
        this.addClass(this.roller.baseClass);
        this.addClass(this.roller.screenPageClass);

        this.roller.currentScreen = methods.getFirstScreen.call(this);
        this.moveTo = methods.moveTo;

        this.moveTo(this.roller.currentScreen, 0);

        methods.build.solidMod && methods.determineMod.call(this);
        methods.build.solidMod && methods.bindChangeMod.call(this);

        this.roller.afterInit();
    };

    methods.getFirstScreen = function() {
        return this.roller.startScreen ? this.roller.startScreen : 0;
    };

    methods.moveTo = function(direction, speed) {
        var nextScreen = methods.getNextScreen.call(this, direction),
            animateFunction;


        if(nextScreen >= 0) {
            speed = (speed >= 0) ? speed : this.roller.animationSpeed;
            this.roller.currentScreen = nextScreen;

            animateFunction = methods.selectAnimate.call(this);
            animateFunction.call(this, nextScreen, speed);
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
            (typeof nextIndexScreen !== 'number') ) {
            return -1;
        }

        return nextIndexScreen;
    };

    methods.move3d = function(index, speed) {
        var $self = this;
        this.roller.beforeMove(index);

        this.css('transition-duration', speed / 1000 + 's');
        this.css(this.roller.transformPrefix, 'translate3d(0, ' + index * -100 +'%, 0)');

        this.off('transitionend webkitTransitionEnd');
        this.one('transitionend webkitTransitionEnd', function() {
            $self.roller.afterMove(index);
        });
    };

    methods.selectAnimate = function() {
        return methods.selectPropertyAnimate.call(this);
    };

    methods.selectPropertyAnimate = function() {
        return methods.move3d
    };

}(jQuery));

(function($){
    //support old browsers
    var methods = $.fn.screenroller.prototype;

    methods.build.oldBrowsers = true;

    methods.moveTop = function(index, speed) {
        var $self = this;
        this.roller.beforeMove(index);
        this.stop(false, true);
        this.animate({top: index * -100 + '%'}, speed, function() {
            $self.roller.afterMove(index);
        });
    };

    methods.selectPropertyAnimate = function() {
        if(this.roller.support3d) {
            return methods.move3d;
        } else {
            return methods.moveTop;
        }
    };
}(jQuery));

//support solid mod
(function($){
    var methods = $.fn.screenroller.prototype;

    methods.build.solidMod = true;

    methods.determineMod = function() {
        var $win = $(window),
            mod;

        mod = (($win.height() > this.roller.minHeight) &&
               ($win.width()  > this.roller.minWidth)) ?  'screen' : 'solid';

        if(mod !== this.roller.mod) {
            this.roller.mod = mod;
            methods.setMod[mod].call(this);
        }
    };

    methods.bindChangeMod = function() {
        var $self = this;

        $(window).on('resize.roller', function() {
            methods.determineMod.call($self);
        });
    };

    methods.setMod = {};

    methods.setMod['screen'] = function() {
        this.removeClass(this.roller.solidPageClass);
        this.addClass(this.roller.screenPageClass);

        this.moveTo(this.roller.currentScreen, 0);

        methods.removeScrollListener();

        this.roller.onScreenMod();
    };

    methods.setMod['solid'] = function() {
        this.removeClass(this.roller.screenPageClass);
        this.addClass(this.roller.solidPageClass);

        this.attr('style', '');

        this.moveTo(this.roller.currentScreen, 0);

        methods.spotOffsetsScreens.call(this);
        methods.addScrollListener.call(this);

        this.roller.onSolidMod();
    };

    methods.moveScrollTop = function(index, speed) {
        var $self = this,
            scrollTop = this.roller.$screens.eq(this.roller.currentScreen).offset().top;

        this.roller.beforeMove(index);
        $('html, body').stop(false, false);
        methods.removeScrollListener.call(this);
        $('html, body').animate({scrollTop: scrollTop}, speed, function() {
            methods.addScrollListener.call($self);
            $self.roller.afterMove(index);
        });
    };

    methods.addScrollListener = function() {
        var $self = this;
        $(window).on('scroll.screenroller', function() {
            methods.checkNearScreen.call($self)
        });
    };

    methods.removeScrollListener = function() {
        $(window).off('scroll.screenroller');
    };

    methods.checkNearScreen = function() {
        var nearestToCentre = methods.spotNearScreen.call(this);

        if (nearestToCentre !== this.roller.currentScreen) {
            this.roller.currentScreen = nearestToCentre;
            this.roller.changeScreen(nearestToCentre);
        }
    };

    methods.spotNearScreen = function() {

        var windowScrollTop = $(window).scrollTop(),
            nearValue = Infinity,
            nearest;

        $.each(this.roller.offsetScreens, function(index, val) {
            if(Math.abs(windowScrollTop - val) < nearValue) {
                nearValue = windowScrollTop - val;
                nearest = index;
            }
        });
        return nearest;
    };

    methods.spotOffsetsScreens = function() {
        var $self = this;

        this.roller.offsetScreens = [];
        this.roller.$screens.each(function() {
            $self.roller.offsetScreens.push($(this).offset().top);
        });
    };

    methods.selectAnimate = function(index, speed) {
        if(this.roller.mod === 'screen') {
            return methods.selectPropertyAnimate.call(this, index, speed);
        } else {
            return methods.moveScrollTop;
        }
    }
}(jQuery));

