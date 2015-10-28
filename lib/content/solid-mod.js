(function($){
    var SolidMod = {
        init: function () {
            var roller = this.roller;

            roller.animatedScrollTop = this.animatedScrollTop.bind(this);
            roller.runFunctionAnimation = this.runFunctionAnimation.bind(this);
            roller.solidModON = false;

            this.win = roller.win;
            this.html = roller.html;
            this.body = roller.body;
            this.htmlbody = roller.htmlbody;

            this.checkWindowSize();
            this.bindChangekWindowSize();
        },

        runFunctionAnimation: function(index, speed) {
            var roller = this.roller;

            if(roller.solidModON) {
                return roller.animatedScrollTop(index, speed);
            } else {
                return roller.selectTypeAnimation(index, speed);
            }
        },

        checkWindowSize: function () {
            var height = this.win.height(),
                width  = this.win.width(),
                minHeight = this.roller.options.minHeight,
                minWidth  = this.roller.options.minWidth;

            if((height < minHeight) || (width < minWidth)) {
                this.onSolidMod();
            } else {
                this.offSolidMod();
            }
        },

        bindChangekWindowSize: function () {
            var module = this;

            module.win.on('resize.screenroller', function() {
                module.checkWindowSize();
            });
        },

        offChangeWindowSize: function() {
            this.win.off('resize.screenroller');
        },

        onSolidMod: function() {
            var module = this,
                roller = this.roller,
                el = this.el;

            if(roller.solidModON) {
                return;
            }

            roller.clearStylesAnimation();

            module.toggleSolidModClass('on');
            module.changeSolidModIndicator(true);
            module.updateScreenOffsets();
            module.bindScrollWindow();

            el.moveTo(roller.currentScreen, 0);
            el.trigger('solid-mod-ON');
        },

        offSolidMod: function() {
            var module = this,
                roller = this.roller,
                el = module.el,
                currentScreen = roller.currentScreen;

            if(!roller.solidModON) {
                return;
            }

            module.offScrollWindow();

            roller.addStylesAnimation();

            setTimeout(function() {
                module.changeSolidModIndicator(false);
                module.toggleSolidModClass('off');

                el.moveTo(currentScreen, 0);
                el.trigger('solid-mod-OFF');
            }, 1);
        },

        toggleSolidModClass: function(state) {
            var html = this.html;

            if(state === 'on'){
                html.addClass('solid-mod');
            } else {
                html.removeClass('solid-mod');
            }
        },

        changeSolidModIndicator: function(state) {
            if(state) {
                this.roller.solidModON = true;
            } else {
                this.roller.solidModON = false;
            }
        },

        updateScreenOffsets: function() {
            this.screenOffsets = this.getScreenOffsets();
        },

        getScreenOffsets: function() {
            var screens = this.roller.screens;

            return screens.map(function(index){
                return screens.eq(index).offset().top;
            });
        },

        bindScrollWindow: function() {
            var module = this,
                win = this.win;

            win.on('scroll.screenroller', function() {
                var currentScrollTop = win.scrollTop();

                module.determineScreenByScrollTop(currentScrollTop);
            });
        },

        offScrollWindow: function() {
            this.win.off('scroll.screenroller');
        },

        determineScreenByScrollTop: function(scrollTop) {
            var nearestToTop = this.findNearestToTopScreen(scrollTop);

            if(nearestToTop !== this.roller.currentScreen) {
                this.roller.currentScreen = nearestToTop;
            }
        },

        findNearestToTopScreen: function(scrollTop) {
            var nearestValue = Infinity,
                nearestScreenIndex;

            $.each(this.screenOffsets, function(index, val) {
                if(Math.abs(scrollTop - val) < nearestValue) {
                    nearestValue = scrollTop - val;
                    nearestScreenIndex = index;
                }
            });

            return nearestScreenIndex;
        },

        animatedScrollTop: function(index, speed) {
            var module = this,
                el = module.el,
                scrollTop = this.screenOffsets[index];

            module.roller.options.beforeMove(index);
            module.htmlbody.stop(false, false);
            module.offScrollWindow();

            module.html.animate({ scrollTop: scrollTop }, speed, function() {
                module.bindScrollWindow();
                el.trigger('changeCurrentScreen', { index: index });
            });
        }
    };

    $.fn['screenroller-solid-mod'] = function() {
        this.roller['module-solid-mod'] = $.extend({ el: this, roller: this.roller }, Object.create(SolidMod));
        this.roller['module-solid-mod'].init();

        return this;
    };
}(jQuery));