(function($){
    //support influx animation
    var methods = $.fn.screenroller.prototype;

    methods.build.influxAnimate = true;

    methods.influxAnimateInit = function() {
        var c = this,
            r = this.roller;

        c.addClass('influx-animation');

        r.animation = 'influx-animation';
        r.initialPosition  = methods.getInitialPosition.call(this);
        r.reverseDirettion = methods.getReverseDirettion.call(this);
        r.$cloneScreens = [];

        methods.setInitialPosition.call(c, r.directionAnimation);

        c.on('turnOnSolidMod', function() {
            r.$screens.attr('style', '');

            methods.removeСlones.call(c, 0);
        });

        c.on('turnOnScreenMod', function() {
            methods.setInitialPosition.call(c, r.directionAnimation);
        });
    };

    methods.getInitialPosition = function() {
        var r = this.roller;

        if(r.transition && r.transform3d) {
            return {
                'from-bottom': 'translate3d(0, 100%, 0)',
                'from-right':  'translate3d(100%, 0, 0)',
                'from-left':   'translate3d(-100%, 0, 0)',
                'from-top':    'translate3d(0, -100%, 0)'
            }
        } else {
            return {
                'from-bottom': { top: '100%', left: 0 },
                'from-right':  { top: 0, left: '100%' },
                'from-left':   { top: 0, left: '-100%' },
                'from-top':    { top: '-100%', left: 0 }
            }
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

        r.transition && r.transform3d ? r.$screens.css(r.transform3d, r.initialPosition[direction]) :
                                        r.$screens.css(r.initialPosition[direction]);
    };

    methods.setDirection = function(index) {
        var directionAnimation = this.roller.directionAnimation,
            reverseDirettion   = this.roller.reverseDirettion;

        index < this.roller.currentScreen ? directionAnimation = reverseDirettion[directionAnimation] : '';
        
        methods.setInitialPosition.call(this, directionAnimation);
    };

    methods.animateTransform = function(index, speed) {

        this.roller.reverseAnimation && methods.setDirection.call(this, index);

        var c = this,
            $animateScreen = c.roller.$screens.eq(index).clone(),
            transformPrefix = c.roller.transform3d;

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

    methods.animateOffset = function(index, speed) {
        var c = this,
            r = this.roller,
            $animateScreen;

        r.reverseAnimation && methods.setDirection.call(c, index);
        $animateScreen = c.roller.$screens.eq(index).clone();

        $animateScreen.addClass('clone');

        c.append($animateScreen);

        r.$cloneScreens.push($animateScreen);
        r.beforeMove(index);

        $animateScreen.animate({ top: 0, left: 0}, speed, function() {
            if(r.$cloneScreens.length > 1) {
                //в webkit дергает экран при удалении нод
                // используем timeout для фикса этого бага
                setTimeout(function() {
                    r.$cloneScreens[0] && r.$cloneScreens[0].remove();
                    r.$cloneScreens.shift();
                }, 1000);
            }
            c.trigger('changeCurrentScreen', {index: index});
        });
    };

    methods.removeСlones = function() {
        var r = this.roller;

        $.each(r.$cloneScreens, function(index, clone) {
            clone.remove();
        });

        r.$cloneScreens = [];
    };
}(jQuery));