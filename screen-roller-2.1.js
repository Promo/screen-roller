(function($){
    var data3d = (function(){
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
    }());
    
    $.fn.screenroller = function(options) {
        var roller = {};

        options = $.extend({
            animationSpeed: 500,
            'baseClass': 'roller',
            'screenClass': 'screen',
            'screenPageClass': 'screen-page',
            'solidPageClass': 'solid-page',
            'startScreen': null,
            'beforeInit': function(){},
            'afterInit': function(){},
            'afterMove': function(){}
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

    methods.init = function() {
        this.roller.beforeInit();

        this.addClass(this.roller.baseClass);
        this.addClass(this.roller.screenPageClass);

        this.roller.currentScreen = methods.getFirstScreen.call(this);
        this.moveTo = methods.moveTo;

        this.moveTo(this.roller.currentScreen, 0);
        this.roller.afterInit();
    };

    methods.getFirstScreen = function() {
        return this.roller.startScreen ? this.roller.startScreen : 0;
    };

    methods.moveTo = function(direction, speed) {
        var nextScreen = methods.getNextScreen.call(this, direction);

        if(nextScreen >= 0) {
            speed = (speed >= 0) ? speed : this.roller.animationSpeed;
            this.roller.currentScreen = nextScreen;
            methods.roll.call(this, nextScreen, speed);
        }
    };

    methods.getNextScreen = function(direction) {
        var nextIndexScreen;

        if(typeof direction  === 'string') {
            direction === 'up' ? nextIndexScreen = this.roller.currentScreen - 1 : nextIndexScreen = this.roller.currentScreen + 1;
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
        this.one('transitionend webkitTransitionEnd', function(e) {
            $self.roller.afterMove(index);
        });
    };

    //тут выбираем стратегию для прокрутки. По умолчанию это 3d
    methods.roll = function(index, speed) {
        methods.move3d.call(this, index, speed);
    };

    $.fn.screenroller.prototype.build = {};

}(jQuery));

(function($){
    //support old browsers
    var methods = $.fn.screenroller.prototype;

    $.fn.screenroller.prototype.build.oldBrowsers = true;

    methods.moveTop = function(index, speed) {
        var $self = this;
        this.roller.beforeMove(index);
        this.stop(false, true);
        this.animate({top: index * -100 + '%'}, speed, function() {
            $self.roller.afterMove(index);
        });
    };

    methods.roll = function(index, speed) {
        if(this.roller.support3d) {
            methods.move3d.call(this, index, speed);
        } else {
            methods.moveTop.call(this, index, speed);
        }
    };
}(jQuery));