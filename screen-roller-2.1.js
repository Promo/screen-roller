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


/*==== base animate ====*/

(function($){
    //support base animate
    var methods = $.fn.screenroller.prototype;

    methods.build.baseAnimate = true;

    methods.baseAnimateInit = function() {
        var c = this;

        c.addClass('base-animation');
        c.roller.animation = 'base-animation';

        c.on('turnOnSolidMod', function() {
            c.attr('style', '');
        });
    };

    methods.move3d = function(index, speed) {
        var с = this;
        с.roller.beforeMove(index);

        с.css('transition-duration', speed / 1000 + 's');
        с.css(с.roller.transformPrefix, 'translate3d(0, ' + index * -100 +'%, 0)');

        с.off('transitionend webkitTransitionEnd');
        с.one('transitionend webkitTransitionEnd', function() {
            с.trigger('changeCurrentScreen', {index: index});
        });
    };
}(jQuery));

(function($){
    //support old browsers for base animate
    var methods = $.fn.screenroller.prototype;

    methods.build.baseAnimateOldBrowsers = true;

    methods.moveTop = function(index, speed) {
        var $self = this;
        this.roller.beforeMove(index);
        this.stop(false, true);
        this.animate({top: index * -100 + '%'}, speed, function() {
            $self.trigger('changeCurrentScreen', {index: index});
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






/*==== influx animate ====*/

(function($){
    //support influx animation
    var methods = $.fn.screenroller.prototype;

    methods.build.influxAnimate = true;

    methods.influxAnimateInit = function() {
        var c = this;

        c.addClass('influx-animation');
        c.roller.animation = 'influx-animation';
        c.roller.initialPosition  = methods.getInitialPosition();
        c.roller.reverseDirettion = methods.getReverseDirettion();
        c.roller.$cloneScreens = [];

        methods.setInitialPosition.call(c, c.roller.directionAnimation);

        c.on('turnOnSolidMod', function() {
            c.roller.$screens.attr('style', '');

            methods.removeСlones.call(c, 0);
        });

        c.on('turnOnScreenMod', function() {
            methods.setInitialPosition.call(c, c.roller.directionAnimation);
        });
    };

    methods.getInitialPosition = function() {
        return {
            'from-bottom': 'translate3d(0, 100%, 0)',
            'from-right':  'translate3d(100%, 0, 0)',
            'from-left':   'translate3d(-100%, 0, 0)',
            'from-top':    'translate3d(0, -100%, 0)'
        }
    };

    methods.getReverseDirettion = function() {
        return {
            'from-bottom': 'from-top',
            'from-right':  'from-left',
            'from-left':   'from-right',
            'from-top':    'from-bottom'
        }
    };

    methods.setInitialPosition = function(direction) {
        var r = this.roller;
        r.$screens.css(r.transformPrefix, r.initialPosition[direction]);
    };

    methods.setDirection = function(index) {
        var directionAnimation = this.roller.directionAnimation,
            reverseDirettion   = this.roller.reverseDirettion;

        if(index >= this.roller.currentScreen) {
            methods.setInitialPosition.call(this, directionAnimation);
        } else {
            methods.setInitialPosition.call(this, reverseDirettion[directionAnimation]);
        }
    };

    methods.move3d = function(index, speed) {

        this.roller.reverseAnimation && methods.setDirection.call(this, index);

        var c = this,
            $animateScreen = c.roller.$screens.eq(index).clone(),
            transformPrefix = c.roller.transformPrefix;

        $animateScreen.addClass('clone');
        c.append($animateScreen);
        c.roller.$cloneScreens.push($animateScreen);
        c.roller.beforeMove(index);


        $animateScreen.css('transition-duration', speed / 1000 + 's');
        setTimeout(function() {

            $animateScreen.css(transformPrefix, 'translate3d(0, 0, 0)');
        }, 100);

        //при transition-duration = 0 событие transitionend не срабатывает, поэтому не удаляется
        //первый клонированный слайд
        $animateScreen.one('transitionend webkitTransitionEnd', function() {
            c.roller.$cloneScreens[0].hide();
            // в webkit дергает экран при удалении нод
            // используем timeout для фикса этого бага
            setTimeout(function() {
                c.roller.$cloneScreens[0] && c.roller.$cloneScreens[0].remove();
                c.roller.$cloneScreens.shift();
            }, 1000);

            c.trigger('changeCurrentScreen', {index: index});
        });
    };

    methods.removeСlones = function(retain) {
        $.each(this.roller.$cloneScreens, function(index, clone) {
            clone.remove();
        });
        this.roller.$cloneScreens = [];
    };
}(jQuery));

(function($){
    //support old browsers for influx animation
    var methods = $.fn.screenroller.prototype;

    methods.build.influxAnimateOldBrowsers = true;

    methods.getInitialPosition = function() {
        return {
            'support3d': {
                'from-bottom': 'translate3d(0, 100%, 0)',
                'from-right':  'translate3d(100%, 0, 0)',
                'from-left':   'translate3d(-100%, 0, 0)',
                'from-top':    'translate3d(0, -100%, 0)'
            },
            'notSupport3d': {
                'from-bottom': { top: '100%', left: 0 },
                'from-right':  { top: 0, left: '100%' },
                'from-left':   { top: 0, left: '-100%' },
                'from-top':    { top: '-100%', left: 0 }
            }
        }
    };

    methods.setInitialPosition = function(direction) {
        var r = this.roller;

        if(r.support3d) {
            r.$screens.css(r.transformPrefix, r.initialPosition['support3d'][direction]);
        } else {
            r.$screens.css(r.initialPosition['notSupport3d'][direction]);
        }
    };

    methods.selectPropertyAnimate = function() {

        if(this.roller.support3d) {
            return methods.move3d;
        } else {
            return methods.moveSide;
        }
    };

    methods.moveSide = function(index, speed) {
        this.roller.reverseAnimation && methods.setDirection.call(this, index);

        var c = this,
            $animateScreen = c.roller.$screens.eq(index).clone();

        $animateScreen.addClass('clone');

        c.append($animateScreen);
        c.roller.$cloneScreens.push($animateScreen);
        c.roller.beforeMove(index);

        $animateScreen.animate({ top: 0, left: 0}, speed, function() {
            if(c.roller.$cloneScreens.length > 1) {
                 //в webkit дергает экран при удалении нод
                // используем timeout для фикса этого бага
                setTimeout(function() {
                    c.roller.$cloneScreens[0] && c.roller.$cloneScreens[0].remove();
                    c.roller.$cloneScreens.shift();
                }, 1000);
            }
            c.trigger('changeCurrentScreen', {index: index});
        });
    };
}(jQuery));





/*==== solid mod ====*/
//support solid mod
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


(function($){
    //support hash
    var methods = $.fn.screenroller.prototype;

    methods.build.hash = true;

    methods.hashInit = function() {
        this.roller.screensHash = methods.getScreensHash.call(this);

        var matchIndex = methods.checkMatchHash.call(this);

        if(matchIndex !== -1) {
            this.roller.currentScreen = matchIndex;
        }
        
        methods.bindEventsHash.call(this);
    };
    
    methods.bindEventsHash = function() {
        var c = this,
            timer;

        methods.onEventChangeHash.call(c);

        c.on('changeCurrentScreen', function(e, data) {
            methods.offEventChangeHash.call(c);
            methods.changeHashByIndex.call(c, data.index);
            clearTimeout(timer);
            timer = setTimeout(function() {
                methods.onEventChangeHash.call(c);
            }, 100);
        });
    };

    methods.onEventChangeHash = function() {
        var c = this;
        $(window).on('hashchange.screenroller', function() {
            var matchHashIndex = methods.checkMatchHash.call(c);
            if(matchHashIndex !== -1) {
                c.moveTo(matchHashIndex);
            }
        });
    };

    methods.checkMatchHash = function() {
        var hashPageInInit = methods.getCurrentHash();

        return this.roller.screensHash.indexOf(hashPageInInit);
    };

    methods.offEventChangeHash = function() {
        $(window).off('hashchange.screenroller');
    };

    methods.changeHashByIndex = function(index) {
        var hash = methods.getHashById.call(this, index);

        hash && methods.changeHash(hash);
    };

    methods.getHashById = function(index) {
        return this.roller.screensHash[index];
    };

    methods.changeHash = function(hash) {
        window.location.hash = hash;
    };

    methods.getCurrentHash = function() {
        return window.location.hash.replace('#', '');
    };

    methods.getScreensHash = function() {
        return $.map(this.roller.$screens, function(screen){
            return $(screen).attr('data-hash');
        });
    };

}(jQuery));

