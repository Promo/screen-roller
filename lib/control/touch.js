(function($){
    var Touch = {
        init: function() {
            var roller = this.roller;

            roller.bindEventsTouch = this.bindEventsTouch.bind(this);
            roller.offEventsTouch = this.offEventsTouch.bind(this);

            this.bindEventsTouch();
        },

        bindEventsTouch: function() {
            var module = this,
                roller = module.roller,
                screens = roller.screens;

            screens.on('touchstart.screenroller', function(e){
                module.processTouchStart(e);
            });

            screens.on('touchmove.screenroller', function(e){
                module.processTouchMove(e);
                return false;
            });

            screens.on('touchend.screenroller', function() {
                module.processTouchEnd();
            });

            screens.on('touchcancel.screenroller', function() {
                module.processTouchCancel();
            });

            roller.htmlbody.on('touchmove.screenroller', function() {
                return false;
            });

            if(roller.options.mouseEmulateTouch) {
                screens.on('mousedown.screenroller', function(e){
                    module.isMouseDown = true;
                    module.processTouchStart(e);
                });

                screens.on('mousemove.screenroller', function(e) {
                    if(module.isMouseDown) {
                        module.processTouchMove(e);
                    }
                });

                screens.on('mouseup.screenroller', function() {
                    module.processTouchEnd();
                    module.isMouseDown = false;
                });

                screens.on('mouseleave.screenroller', function() {
                    module.processTouchCancel();
                    module.isMouseDown = false;
                });
            }
        },

        offEventsTouch: function() {
            var roller = this.roller;

            roller.screens.off('touchstart.screenroller touchmove.screenroller touchend.screenroller touchcancel.screenroller');
            roller.htmlbody.off('touchmove.screenroller');

            if(roller.options.mouseEmulateTouch) {
                roller.screens.off('mousedown.screenroller mousemove.screenroller mouseup.screenroller mouseleave.screenroller');
            }
        },

        processTouchStart: function(e) {
            this.lastDirection = 'none';
            this.startTransformPosition = this.getTransition();
            this.startPosition = this.getCurrentPosition(e);

            this.el.trigger('processTouchStart', this.startTransformPosition);
        },

        processTouchMove: function(e) {
            this.currentPosition = this.getCurrentPosition(e);
            this.lastDirection = this.getDirection(this.lastPosition || this.currentPosition, this.currentPosition);
            this.offset = this.startPosition - this.currentPosition;
            this.currentTransformPosition = this.startTransformPosition - this.offset;
            this.lastPosition = this.currentPosition;

            this.el.trigger('processTouchMove', this.currentTransformPosition);
        },

        processTouchEnd: function() {
            this.commonDirection = this.getDirection(this.startPosition || 0, this.currentPosition || this.startPosition);
            this.touchEnd(this.commonDirection, this.lastDirection);

            this.el.trigger('processTouchEnd');
        },

        processTouchCancel: function() {
            var speed = this.roller.speedanimation,
                currentScreen = this.roller.currentScreen;

            this.el.moveTo(currentScreen, speed);

            this.el.trigger('processTouchCancel');
        },

        touchEnd: function(commonDirection, lastDirection) {
            var roller = this.roller,
                el = this.el,
                currentScreen = roller.currentScreen,
                countScreens = roller.countScreens - 1,
                speed = roller.options.speedanimation;
            
            var direction = ({ 
                x: {
                    left: 'next',
                    right: 'prev'
                },
                y: {
                    up: 'next',
                    down: 'prev'
                }
            })[roller.axisMove][commonDirection];

            if(commonDirection === lastDirection) {
                if(direction === 'prev' && currentScreen === 0) {
                    el.moveTo(currentScreen, speed);
                }

                if(direction === 'next' && currentScreen === countScreens) {
                    el.moveTo(currentScreen, speed);
                }

                if(direction === 'next') {
                    el.moveTo('down', speed);
                } else {
                    el.moveTo('up', speed);
                }
            } else {
                el.moveTo(currentScreen, speed);
            }
        },

        getCurrentPosition: function(e) {
            var axis = this.roller.axisMove;

            return e['originalEvent']['page' + axis.toUpperCase()] ||
                   e['originalEvent'].changedTouches[0]['page' + axis.toUpperCase()] //android chrome
        },

        getDirection: function(startPosition, endPoint) {
            var direction = {
                    x: {
                        next: 'left',
                        prev: 'right'
                    },
                    y: {
                        next: 'up',
                        prev: 'down'
                    }
                },
                axis = this.roller.axisMove;

            if(startPosition === endPoint) {
                return this.lastDirection;
            }

            if(endPoint < startPosition) {
                return direction[axis]['next'];
            } else {
                return direction[axis]['prev'];
            }
        },

        getTransition: function() {
            var value = this.el.css('transform').split(', ');

            if(!value) {
                return 0;
            }

            if(this.roller.axisMove === 'x') {
                return parseInt(value[4]);
            } else {
                return parseInt(value[5]);
            }
        }
    };

    $.fn['screenroller-touch'] = function() {
        this.roller['module-touch'] = $.extend({ el: this, roller: this.roller }, Object.create(Touch));
        this.roller['module-touch'].init();

        return this;
    };
}(jQuery));