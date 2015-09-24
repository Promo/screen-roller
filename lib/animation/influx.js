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