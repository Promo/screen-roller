(function($){
    //support solidMod
    var module = 'solidMod',
        methods = $.fn.screenroller.prototype,
        $win,
        $html,
        $body,
        $htmlbody,
        screenOffsets,
        solidModON;

    methods.build.solidMod = true;

    methods[module + 'Init'] = function() {
        var c = this;

        $win = $(window);
        $html = $('html');
        $body = $('body');
        $htmlbody = $('html, body');

        checkWindowSize.call(c);
        bindChangekWindowSize.call(c);
    };

    function onSolidMod() {
        var c = this,
            currentScreen = c.roller.currentScreen;

        if(solidModON) {
            return;
        }

        c.trigger('solid-mod-ON');

        c.removeInlineStyle();
        toggleSolidModClass.call(c, 'on');
        changeSolidModIndicator.call(c, true);
        updateScreenOffsets.call(c);
        bindScrollWindow.call(c);

        c.moveTo(currentScreen, 0);
    }

    function offSolidMod() {
        var c = this,
            currentScreen = c.roller.currentScreen;

        if(!solidModON) {
            return;
        }

        offScrollWindow.call(c);

        setTimeout(function() {
            changeSolidModIndicator.call(c, false);
            toggleSolidModClass.call(c, 'off');

            c.trigger('solid-mod-OFF');
            c.moveTo(currentScreen, 0);
        }, 1);

    }

    function checkWindowSize() {
        var c = this,
            r = this.roller;

        if(($win.height() < r.minHeight) || ($win.width() < r.minWidth)) {
            onSolidMod.call(c);
        } else {
            offSolidMod.call(c);
        }
    }

    function bindChangekWindowSize() {
        var c = this;

        $win.on('resize.screenroller', function() {
            checkWindowSize.call(c);
        });
    }

    function offChangekWindowSize() {
        $win.off('resize.screenroller');
    }

    function animatedScrollTop(index, speed) {
        var c = this,
            r = c.roller,
            scrollTop = screenOffsets[index];

        r.beforeMove(index);

        $htmlbody.stop(false, false);
        offScrollWindow.call(c);

        $html.animate({scrollTop: scrollTop}, speed, function() {
            bindScrollWindow.call(c);
            c.trigger('changeCurrentScreen', { index: index });
        });
    }

    function bindScrollWindow() {
        var c = this;

        $win.on('scroll.screenroller', function() {
            var currentScrollTop = $win.scrollTop();

            determineScreenByScrollTop.call(c, currentScrollTop);
        });
    }

    function offScrollWindow() {
        $win.off('scroll.screenroller');
    }

    function getScreenOffsets() {
        var c = this,
            $screens = c.roller.$screens,
            arrayOffsets = [];

        $screens.each(function(index) {
            arrayOffsets.push($screens.eq(index).offset().top);
        });

        return arrayOffsets;
    }

    function updateScreenOffsets() {
        var c = this;

        screenOffsets = getScreenOffsets.call(c);
    }

    function findNearestToTopScreen(scrollTop) {
        var nearestValue = Infinity,
            nearestScreenIndex;

        $.each(screenOffsets, function(index, val) {
            if(Math.abs(scrollTop - val) < nearestValue) {
                nearestValue = scrollTop - val;
                nearestScreenIndex = index;
            }
        });

        return nearestScreenIndex;
    }

    function determineScreenByScrollTop(scrollTop) {
        var c = this,
            r = c.roller,
            nearestToTop = findNearestToTopScreen.call(c, scrollTop);

        if(nearestToTop !== r.currentScreen) {
            r.currentScreen = nearestToTop;
        }
    }

    function toggleSolidModClass(state) {
        if(state === 'on'){
            $html.addClass('solid-mod');
        } else {
            $html.removeClass('solid-mod');
        }
    }

    function changeSolidModIndicator(state) {
        if(state) {
            solidModON = true;
        } else {
            solidModON = false;
        }
    }

    methods.selectAnimate = function(index, speed) {
        if(solidModON) {
            return animatedScrollTop;
        } else {
            return methods.selectPropertyAnimate.call(this, index, speed);
        }
    }
}(jQuery));