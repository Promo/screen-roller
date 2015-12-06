(function($){
    var SolidMod = {
        init: function () {
            var module = this,
                roller = module.roller;

            roller.onWatcherSolidMod    = module.onWatcherSolidMod.bind(module);
            roller.offWatcherSolidMod   = module.offWatcherSolidMod.bind(module);

            roller.onSolidMod           = module.onSolidMod.bind(module);
            roller.offSolidMod          = module.offSolidMod.bind(module);

            roller.animatedScrollTop    = module.animatedScrollTop.bind(module);
            roller.runFunctionAnimation = module.runFunctionAnimation.bind(module);

            roller.solidModOn = false;

            module.win  = roller.win;
            module.html = roller.html;
            module.body = roller.body;
            module.htmlbody = roller.htmlbody;

            module.onWatcherSolidMod();
            module.processWindowResize();
        },

        onWatcherSolidMod: function() {
            var module = this;

            module.win.on('resize.screenroller', function() {
                module.processWindowResize();
            });
        },

        offWatcherSolidMod: function() {
            this.win.off('resize.screenroller');
        },

        onSolidMod: function() {
            var module = this,
                roller = module.roller,
                el     = module.el;

            //setTimeout fixes bug in safari
            setTimeout(function(){
                roller.clearStylesAnimation();
                module.offScreenModFeatures();
                module.toggleSolidModClass('on');

                module.changeSolidModIndicator(true);
                module.updateScreenOffsets();
                module.onWatcherScrollWindow();

                el.trigger('onSolidMod');
                el.moveTo(roller.currentScreen, 0);

                roller.options.onSolidMod();
            }, 1);
        },

        offSolidMod: function() {
            var module = this,
                roller = module.roller,
                el     = module.el,
                currentScreen = roller.currentScreen;


            module.offWatcherScrollWindow();
            module.changeSolidModIndicator(false);
            module.toggleSolidModClass('off');
            module.onScreenModFeatures();

            roller.addStylesAnimation();

            el.trigger('offSolidMod');
            el.moveTo(currentScreen, 0);

            roller.options.offSolidMod();
        },

        offScreenModFeatures: function() {
            var roller = this.roller;
            //turn off module touch
            roller.offWatcherTouch && roller.offWatcherTouch();

            //turn off module wheel
            roller.offWatcherWheel && roller.offWatcherWheel();

            //turn off module keyboard
            roller.offWatcherKeyboard && roller.offWatcherKeyboard();
        },

        onScreenModFeatures: function() {
            var roller = this.roller;
            //turn on module touch
            roller.onWatcherTouch && roller.onWatcherTouch();

            //turn on module wheel
            roller.onWatcherWheel && roller.onWatcherWheel();

            //turn on module keyboard
            roller.onWatcherKeyboard && roller.onWatcherKeyboard();
        },

        processWindowResize: function () {
            var module = this,
                roller = module.roller,
                height = module.win.height(),
                width  = module.win.width(),
                minHeight  = roller.options.minHeight,
                minWidth   = roller.options.minWidth,
                solidModOn = roller.solidModOn;

            if ((height < minHeight) || (width < minWidth)) {
                if(!solidModOn) { module.onSolidMod() }
            } else {
                if(solidModOn) { module.offSolidMod() }
            }
        },

        toggleSolidModClass: function(state) {
            var html = this.html;

            (state === 'on') ? html.addClass('solid-mod') : 
                               html.removeClass('solid-mod');
        },

        changeSolidModIndicator: function(state) {
            var roller = this.roller;

            roller.solidModOn = (state) ? true : false;
        },

        updateScreenOffsets: function() {
            var module = this;

            module.screenOffsets = module.getScreenOffsets();
        },

        getScreenOffsets: function() {
            var screens = this.roller.screens;

            return screens.map(function(index){
                return screens.eq(index).offset().top;
            });
        },
        
        onWatcherScrollWindow: function() {
            var module = this,
                win    = module.win;

            if(!module.watcherScrollWindowOn) {
                module.watcherScrollWindowOn = true;

                win.on('scroll.screenroller', function() {
                    var currentScrollTop = win.scrollTop();

                    module.processWindowScroll(currentScrollTop);
                });
            }
        },
        
        offWatcherScrollWindow: function() {
            var module = this;

            if(module.watcherScrollWindowOn) {
                module.watcherScrollWindowOn = false;
                module.win.off('scroll.screenroller');
            }
        },

        processWindowScroll: function(scrollTop) {
            var module = this,
                roller = module.roller,
                nearestToTop;

            nearestToTop = module.findNearestToTopScreen(scrollTop);

            if(nearestToTop !== roller.currentScreen) {
                roller.currentScreen = nearestToTop;
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
                roller = module.roller,
                scrollTop = module.screenOffsets[index];

            roller.options.beforeMove(index);
            module.htmlbody.stop(false, false);
            module.offWatcherScrollWindow();

            module.htmlbody.animate({ scrollTop: scrollTop }, speed, function(){
                module.processEndAnimation(index);
            });
        },

        processEndAnimation: function(index) {
            var module = this,
                roller = module.roller,
                el     = module.el;

            if(!module.watcherScrollWindowOn) {
                module.onWatcherScrollWindow();
            }

            el.trigger('changeCurrentScreen', { index: index });
            roller.options.afterMove(index);
        },

        runFunctionAnimation: function(index, speed) {
            var roller = this.roller;

            roller.solidModOn ? roller.animatedScrollTop(index, speed) :
                                roller.selectTypeAnimation(index, speed);
        }
    };

    $.fn['screenroller-solid-mod'] = function() {
        this.roller['module-solid-mod'] = $.extend({ el: this, roller: this.roller }, Object.create(SolidMod));
        this.roller['module-solid-mod'].init();

        return this;
    };
}(jQuery));