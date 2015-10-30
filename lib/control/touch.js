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
                el = module.el;

            el.on('touchstart.screenroller', '.screen', function(e){
                module.processTouchStart(e);
            });

            el.on('touchmove.screenroller', '.screen', function(e){
                module.processTouchMove(e);
                return false;
            });

            el.on('touchend.screenroller', '.screen',  function() {
                module.processTouchEnd();
            });

            el.on('touchcancel.screenroller', '.screen',  function() {
                module.processTouchCancel();
            });

            if(roller.options.mouseEmulateTouch) {
                el.on('mousedown.screenroller', '.screen', function(e){
                    module.isMouseDown = true;
                    module.processTouchStart(e);
                });

                el.on('mousemove.screenroller', '.screen', function(e) {
                    if(module.isMouseDown) {
                        module.processTouchMove(e);
                    }
                });

                el.on('mouseup.screenroller', '.screen', function() {
                    module.processTouchEnd();
                    module.isMouseDown = false;
                });

                el.on('mouseleave.screenroller', '.screen', function() {
                    module.processTouchCancel();
                    module.isMouseDown = false;
                });
            }

            roller.htmlbody.on('touchmove.screenroller', function() {
                return false;
            });
        },

        offEventsTouch: function() {
            var el = this.el,
                roller = this.roller;

            el.screens.off('touchstart.screenroller touchmove.screenroller touchend.screenroller touchcancel.screenroller');

            if(roller.options.mouseEmulateTouch) {
                el.screens.off('mousedown.screenroller mousemove.screenroller mouseup.screenroller mouseleave.screenroller');
            }

            roller.htmlbody.off('touchmove.screenroller');
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

            var commonTouchDir = this.getDirection(this.startPosition || 0, this.currentPosition || this.startPosition);
            var lastTouchDir = this.lastDirection;
            var animateDir = ({
                x: {
                    left: 'next',
                    right: 'prev'
                },
                y: {
                    up: 'next',
                    down: 'prev'
                }
            })[this.roller.axisMove][commonTouchDir];

            this.el.trigger('processTouchEnd', {
                animateDir: animateDir,
                commonTouchDir: commonTouchDir,
                lastTouchDir: lastTouchDir
            });
        },

        processTouchCancel: function() {
            this.el.trigger('processTouchCancel');
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