(function($){
    var InfluxAnimation = {

        init: function() {
            var roller = this.roller;

            roller.clearStylesAnimation = this.clearStylesAnimation.bind(this);
            roller.addStylesAnimation = this.addStylesAnimation.bind(this);

            roller.selectTypeAnimation = this.selectTypeAnimation.bind(this);
            roller.runFunctionAnimation = this.runFunctionAnimation.bind(this);

            this.addStylesAnimation();

            this.listInitialPositions = this.getInitialPositions();
            this.reverseDirections = this.getReverseDirections();
            this.cloneScreens = [];

            this.setInitialPosition(roller.options.directionAnimation);

            this.bindEventsInfluxAnimation();
        },

        clearStylesAnimation: function() {
            this.roller.delClass('influx-animation');
            this.roller.removeInlineStyle(this.roller.screens);
        },

        addStylesAnimation: function() {
            this.roller.setClass('influx-animation');
        },

        getInitialPositions: function() {
            var roller = this.roller;

            if(roller.transition && roller.transform3d) {
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
            var roller = this.roller,
                positions = this.listInitialPositions,
                screens = roller.screens;

            if(roller.transition && roller.transform3d) {
                screens.css('transform', positions[direction]);
            } else {
                screens.css(positions[direction]);
            }
        },

        bindEventsInfluxAnimation: function() {
            var el = this.el,
                roller = this.roller;

            el.on('turnOnSolidMod', function() {
                el.screens.attr('style', '');

                roller.removeСlones();
            });

            el.on('turnOnScreenMod', function() {
                roller.setInitialPosition(roller.directionAnimation);
            });
        },

        removeСlones: function() {
            $.each(this.cloneScreens, function(index, clone) {
                clone.remove();
            });

            this.cloneScreens = [];
        },

        setDirection: function(index) {
            var roller = this.roller,
                directionAnimation = roller.options.directionAnimation,
                reverseDirettion   = this.reverseDirections;

            if(index < roller.currentScreen) {
                directionAnimation = reverseDirettion[directionAnimation]
            }

            this.setInitialPosition(directionAnimation);
        },

        influxAnimateTransform: function(index, speed) {
            var module = this,
                roller = this.roller,
                reverseAnimation = roller.options.reverseAnimation;

            reverseAnimation && this.setDirection(index);

            if(speed === 0) {
                speed = 1;
            }

            var animateScreen = this.getCloneScreen(index);

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
            this.options.reverseAnimation && this.setDirection(index);

            var module = this,
                roller = module.roller,
                el = this.el,
                animateScreen = this.getCloneScreen(index);

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
            var el = this.el,
                roller = this;

            target.one('transitionend webkitTransitionEnd', function() {
                roller.removeClone();
                el.trigger('changeCurrentScreen', { index: index });
            });
        },

        removeClone: function() {
            var roller = this;

            if(roller.cloneScreens.length > 1) {
                roller.cloneScreens[0].hide();

                // в webkit дергает экран при удалении нод
                // используем timeout для фикса этого бага
                setTimeout(function() {
                    roller.cloneScreens[0] && roller.cloneScreens[0].remove();
                    roller.cloneScreens.shift();
                }, 1000);
            }
        },

        selectTypeAnimation: function(index, speed) {
            var roller = this.roller;

            if(roller.transition && roller.transform3d) {
                return this.influxAnimateTransform(index, speed);
            } else {
                return this.influxAnimateOffset(index, speed);
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