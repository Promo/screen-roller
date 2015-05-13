(function($){
    $.fn.roller = function(options) {
        var $self = this,
            $win = $(window),
            $html = $('html'),
            $body = $('body'),
            $htmlbody = $('html, body'),
            $tempNode = $('<div></div>'),
            addBind = {},
            onMod = {},
            runScrolling = {},
            calculateOffsetScreens = {},
            move = {},
            mod,
            nextIndexScreen,
            transform3d,
            transformPrefix,
            offsetScreens,
            nearValue,
            nearScreen;

        var options = $.extend({
            'baseClass': 'roller',
            'screenClass'      : 'screen',
            'screenPageClass': 'screen-page',
            'solidPageClass': 'solid-page',
            'minHeight' : 500,
            'minWidth': 500,
            'animationSpeed': 2500,
            'startScreen': 0,
            'showScrollBar': false,
            'beforeMove': function(){},
            'afterMove': function(){},
            'changeScreen': function(){},
            'onScreenMod': function(){},
            'onSolidMod': function(){}
        }, options);

        var init = function() {
            this.$screens = this.find('.' + options.screenClass);
            this.countScreens = this.$screens.size();
            this.currentScreen = ~~options.startScreen;
            this.animationSpeed = options.animationSpeed;
            this.moveTo = moveTo;
            this.addClass(options.baseClass);

            checkSupport3d();
            addCommonBind();
            determineMod();
        };

        var addCommonBind = function() {
            $win.on('resize.roller', function() {
                determineMod.call($self);
            });
        };

        var determineMod = function() {
            (($win.height() > options.minHeight) &&
            ( $win.width()  > options.minWidth)) ?  mod = options.screenPageClass : mod = options.solidPageClass;
                if(mod !== $self.mod) {
                    $self.mod = mod;
                    onMod[mod]();
                    addBind[mod]();
                }
        };

        var removeBinds = function() {
            $win.off('scroll.roller');
        };

        var moveTo = function(direction, speed, animateScrollBar) {
            speed = (speed <= 0) ? speed : options.animationSpeed;

            if(typeof direction  === 'string') {
                direction === 'up' ? nextIndexScreen = $self.currentScreen - 1 : nextIndexScreen = $self.currentScreen + 1;
            }

            if(typeof direction === 'number') {
                nextIndexScreen = direction;
            }

            if( (nextIndexScreen < 0) ||
                (nextIndexScreen > $self.countScreens - 1) ||
                (typeof nextIndexScreen !== 'number') ) {
                    return;
            }

            $self.currentScreen = nextIndexScreen;
            runScrolling[mod][transform3d](nextIndexScreen, speed);

            if(animateScrollBar !== false) {
                if(options.showScrollBar && $self.mod !== 'solid-page') {
                    removeBinds();
                    $htmlbody.stop(false, false).animate({ scrollTop: nextIndexScreen * 1000 }, speed, function(){
                        addBind[$self.mod]();
                    });
                }
            }
        };

        var checkSupport3d = function() {
            $body.append($tempNode);

            $.each([ '-webkit-transform', '-o-transform',  '-ms-transform', '-moz-transform', 'transform' ], function(i, val) {
                $tempNode.css(val, 'translate3d(0, 0, 0)');
                $tempNode.css(val) && $tempNode.css(val).match(/matrix3d/) ? transformPrefix = val : '';
            });

            $tempNode.remove();
            transform3d = transformPrefix ? 'support3d' : 'notSupport3d';
        };

        var determineCurrentScreen = function(centerWindow) {
            nearValue = 100000;
            nearScreen = 0;

            $.each(offsetScreens, function(i, val) {
                if(Math.abs(centerWindow - val) < nearValue) {
                    nearValue = centerWindow - val;
                    nearScreen = i;
                }
            });
            return nearScreen;
        };

        var checkPositionWindow = function() {
            nearScreen = determineCurrentScreen($win.scrollTop());
            if (nearScreen !== $self.currentScreen) {
                $self.currentScreen = nearScreen;
                options.changeScreen(nearScreen);

                if(options.showScrollBar && $self.mod !== 'solid-page') {
                    $self.moveTo(nearScreen, options.speed, false);
                }
            }
        };

        var addStrut = function() {
            if(options.showScrollBar) {
                $tempNode.height(($self.countScreens - 1) * 1000);
                $body.append($tempNode);
            }
        };

        var removeStrut = function() {
            $tempNode.remove();
        };

        move['3d'] = function(index, speed) {
            options.beforeMove(index);
            $self.css('transition-duration', speed / 1000 + 's');
            $self.css(transformPrefix, 'translate3d(0, ' + index * -100 +'%, 0)');
        };

        move['top'] = function(index, speed) {
            options.beforeMove(index);
            $self.stop(false, true);
            $self.animate({top: index * -100 + '%'}, speed, function() {
                options.afterMove(index);
            });
        };

        move['scrollTop'] = function(index, speed) {
            options.beforeMove(index);
            removeBinds();
            $htmlbody.stop(false, false);
            $htmlbody.animate({scrollTop: offsetScreens[$self.currentScreen]}, speed, function() {
                options.afterMove(index);
                addBind[$self.mod]();
            });
        };

        runScrolling[options.screenPageClass] = {};
        runScrolling[options.screenPageClass]['support3d']      = move['3d'];
        runScrolling[options.screenPageClass]['notSupport3d']   = move['top'];

        runScrolling[options.solidPageClass] = {};
        runScrolling[options.solidPageClass]['support3d']       = move['scrollTop'];
        runScrolling[options.solidPageClass]['notSupport3d']    = move['scrollTop'];

        onMod[options.screenPageClass] = function() {
            $html.addClass(options.screenPageClass);
            $html.removeClass(options.solidPageClass);

            calculateOffsetScreens[options.screenPageClass]();
            removeBinds();
            addStrut();
            moveTo($self.currentScreen, 0);
            options.onScreenMod();
        };

        onMod[options.solidPageClass] = function() {
            $html.addClass(options.solidPageClass);
            $html.removeClass(options.screenPageClass);

            $self.attr('style', '');

            calculateOffsetScreens[options.solidPageClass]();
            removeBinds();
            removeStrut();
            moveTo($self.currentScreen, 0);
            options.onSolidMod();
        };

        calculateOffsetScreens[options.screenPageClass] = function() {
            offsetScreens = [];
            $self.$screens.each(function() {
                offsetScreens.push($(this).index() * 1000);
            });
        };

        calculateOffsetScreens[options.solidPageClass] = function() {
            offsetScreens = [];
            $self.$screens.each(function() {
                offsetScreens.push($(this).offset().top);
            });
        };

        addBind[options.screenPageClass] = function() {
            console.log('Добавляем бинды для ', options.screenPageClass);
            $win.on('scroll.roller', function() {
                checkPositionWindow();
            });
        };

        addBind[options.solidPageClass] = function() {
            console.log('Добавляем бинды для ', options.solidPageClass);
            $win.on('scroll.roller', function() {
                checkPositionWindow();
            });
        };

        init.call(this);

        return this;
    };
}(jQuery));