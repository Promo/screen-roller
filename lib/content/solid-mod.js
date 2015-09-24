(function($){
    var methods = $.fn.screenroller.prototype;

    methods.build.solidMod = true;

    methods.solidModInit = function() {
        methods.determineMod.call(this);
        methods.bindChangeMod.call(this);
    };

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
        this.trigger('turnOnScreenMod');
        this.addClass(this.roller.animation);
        this.removeClass(this.roller.solidPageClass);

        this.moveTo(this.roller.currentScreen, 0);

        methods.removeScrollListener();
    };

    methods.setMod['solid'] = function() {
        this.trigger('turnOnSolidMod');
        this.addClass(this.roller.solidPageClass);
        this.removeClass(this.roller.animation);

        methods.spotOffsetsScreens.call(this);
        methods.addScrollListener.call(this);

        this.moveTo(this.roller.currentScreen, 0);
    };

    methods.moveScrollTop = function(index, speed) {
        var $self = this,
            scrollTop = this.roller.$screens.eq(index).offset().top;

        this.roller.beforeMove(index);
        $('html, body').stop(false, false);
        methods.removeScrollListener.call(this);
        $('html, body').animate({scrollTop: scrollTop}, speed, function() {
            methods.addScrollListener.call($self);
            $self.trigger('changeCurrentScreen', {index: index});
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
            this.trigger('changeCurrentScreen', {index: nearestToCentre});
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