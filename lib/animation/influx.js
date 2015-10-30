(function($){
    var InfluxAnimation = {

        init: function() {
            var module = this,
                roller = this.roller;

            roller.clearStylesAnimation = module.clearStylesAnimation.bind(module);
            roller.addStylesAnimation   = module.addStylesAnimation.bind(module);
            roller.selectTypeAnimation  = module.selectTypeAnimation.bind(module);
            roller.runFunctionAnimation = module.runFunctionAnimation.bind(module);

            roller.axisMove = 'y';

            module.addStylesAnimation();
            module.bindEventsInfluxAnimation();

            module.listInitialPositions = module.getInitialPositions();
            module.reverseDirections    = module.getReverseDirections();
            module.cloneScreens         = [];
        },

        clearStylesAnimation: function() {
            var module = this,
                roller = module.roller,
                screens = roller.screens;

            roller.delClass('influx-animation');
            screens.attr('style', '');
            module.removeСlones();
        },

        addStylesAnimation: function() {
            var el = this.el;

            el.addClass('influx-animation');
        },

        getInitialPositions: function() {
            var transition  = this.roller.transition,
                transform3d = this.roller.transform3d;

            if(transition && transform3d) {
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
        },

        getReverseDirections: function() {
            return {
                'from-bottom': 'from-top',
                'from-right':  'from-left',
                'from-left':   'from-right',
                'from-top':    'from-bottom'
            }
        },

        setInitialPosition: function(direction) {
            var roller    = this.roller,
                positions = this.listInitialPositions,
                screens   = roller.screens;

            if(roller.transition && roller.transform3d) {
                screens.css('transform', positions[direction]);
            } else {
                screens.css(positions[direction]);
            }
        },

        bindEventsInfluxAnimation: function() {
            var module = this,
                roller = module.roller,
                el     = module.el;

            //el.on('processTouchStart', function(e, value){
            //    module.touchStartHandler();
            //});
            //
            //el.on('processTouchMove', function(e, value){
            //    module.touchMovehandler();
            //});
        },

        //touchStartHandler: function() {
        //    console.log('touchStartHandler');
        //},
        //
        //touchMovehandler: function() {
        //    console.log('touchMovehandler');
        //},

        removeСlones: function() {
            var module = this;

            $.each(module.cloneScreens, function(index, clone) {
                clone.remove();
            });

            module.cloneScreens = [];
        },

        setDirection: function(index) {
            var module    = this,
                roller    = module.roller,
                reverse   = module.reverseDirections,
                direction = roller.options.influxDirectionAnimation;

            if(index < roller.currentScreen) {
                direction = reverse[direction]
            }

            module.setInitialPosition(direction);
        },

        influxAnimateTransform: function(index, speed) {
            var module = this,
                roller = module.roller;

            roller.options.reverseAnimation && module.setDirection(index);

            if(speed === 0) {
                speed = 1;
            }

            var animateScreen = module.getCloneScreen(index);

            module.setClassClone(animateScreen);
            module.addCloneToRoller(animateScreen);
            module.addCloneToList(animateScreen);

            roller.options.beforeMove(index);

            module.setTransition(speed, animateScreen);

            setTimeout(function(){
                module.setTranform(animateScreen);
                module.offEndTransition();
                module.bindEndTransform(animateScreen, index);
            }, 50);
        },

        influxAnimateOffset: function(index, speed) {
            var module = this,
                roller = module.roller,
                el     = module.el;

            roller.options.reverseAnimation && module.setDirection(index);

            var animateScreen = module.getCloneScreen(index);

            module.setClassClone(animateScreen);
            module.addCloneToRoller(animateScreen);
            module.addCloneToList(animateScreen);

            roller.options.beforeMove(index);

            animateScreen.animate({ top: 0, left: 0 }, speed, function() {
                module.removeClone();
                el.trigger('changeCurrentScreen', {index: index});
            });
        },

        getCloneScreen: function(index) {
            var roller = this.roller;

            return roller.screens.eq(index).clone();
        },

        addCloneToRoller: function(clone) {
            this.el.append(clone);
        },

        addCloneToList: function(target) {
            this.cloneScreens.push(target);
        },

        setClassClone: function(target) {
            target.addClass('clone');
        },

        setTransition: function(speed, target) {
            target.css('transition-duration', speed / 1000 + 's');
        },


        //todo -> core -> setTransform
        setTranform: function(target) {
            target.css('transform', 'translate3d(0, 0, 0)');
        },

        offEndTransition: function() {
            this.el.off('transitionend webkitTransitionEnd');
        },

        bindEndTransform: function(target, index) {
            var module = this,
                el = module.el;

            target.one('transitionend webkitTransitionEnd', function() {
                module.removeClone();
                el.trigger('changeCurrentScreen', { index: index });
            });
        },

        removeClone: function() {
            var module = this,
                clones = module.cloneScreens;

            if(clones.length > 1) {
                clones[0].hide();

                // в webkit дергает экран при удалении нод
                // используем timeout для фикса этого бага
                setTimeout(function() {
                    clones[0] && clones[0].remove();
                    clones.shift();
                }, 1000);
            }
        },

        selectTypeAnimation: function(index, speed) {
            var module      = this,
                transition  = module.roller.transition,
                transform3d = module.roller.transform3d;

            if(transition && transform3d) {
                return module.influxAnimateTransform(index, speed);
            } else {
                return module.influxAnimateOffset(index, speed);
            }
        },

        runFunctionAnimation: function(index, speed) {
            return this.selectTypeAnimation(index, speed);
        }
    };

    $.fn['screenroller-influx-animation'] = function() {
        this.roller['module-influx-animation'] = $.extend({ el: this, roller: this.roller }, Object.create(InfluxAnimation));
        this.roller['module-influx-animation'].init();

        return this;
    };
}(jQuery));