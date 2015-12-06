(function($){
    var Touch = {
        init: function() {
            var module = this,
                roller = this.roller;

            roller.onWatcherTouch   = module.onWatcherTouch.bind(module);
            roller.offWatcherTouch  = module.offWatcherTouch.bind(module);

            module.options = roller.options.modules.touch;
            module.onWatcherTouch();
        },

        onWatcherTouch: function() {
            var module = this,
                roller = module.roller,
                el     = module.el;

            el.on('touchstart.screenroller', '.screen', function(e){
                module.processTouchStart(e);
            });

            el.on('touchmove.screenroller', '.screen', function(e){
                module.processTouchMove(e);
                return false;
            });

            el.on('touchend.screenroller', '.screen',  function() {
                module.processTouchEnd(e);
            });

            el.on('touchcancel.screenroller', '.screen',  function() {
                module.processTouchCancel(e);
            });

            if(module.options.mouseEmulateTouch) {
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

        offWatcherTouch: function() {
            var module = this,
                el = module.el,
                roller = module.roller;

            el.off('touchstart.screenroller touchmove.screenroller touchend.screenroller touchcancel.screenroller');

            if(module.options.mouseEmulateTouch) {
                el.off('mousedown.screenroller mousemove.screenroller mouseup.screenroller mouseleave.screenroller');
            }

            roller.htmlbody.off('touchmove.screenroller');
        },

        processTouchStart: function(e) {
            var module = this,
                el = module.el;

            module.lastDirection = 'none';
            module.startPosition = module.getCurrentPosition(e);

            el.trigger('processTouchStart', { startPosition: module.startPosition, event: e } );
        },

        processTouchMove: function(e) {
            var module = this,
                el = module.el,

                currentPosition = module.getCurrentPosition(e),
                lastPosition    = module.lastPosition || currentPosition,
                startPosition   = module.startPosition,
                offset          = startPosition - currentPosition;

            module.lastDirection = module.getDirection(lastPosition, currentPosition);
            module.lastPosition  = currentPosition;

            el.trigger('processTouchMove', { offset: offset, event: e });
        },

        processTouchEnd: function(e) {
            var module = this,
                axis   = module.roller.axisMove,
                el     = module.el,

                startPosition  = module.startPosition || 0,
                endPosition    = module.lastPosition || module.startPosition,

                commonTouchDir = module.getDirection(startPosition, endPosition),
                lastTouchDir   = module.lastDirection,

                animateDir = ({
                    x: {
                        left: 'next',
                        right: 'prev'
                    },
                    y: {
                        up: 'next',
                        down: 'prev'
                    }
                })[axis][commonTouchDir];

            var data = {
                commonTouchDir: commonTouchDir,
                lastTouchDir: lastTouchDir,
                animateDir: animateDir,
                event: e
            };

            el.trigger('processTouchEnd', data);
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
            var module = this,
                axis   = module.roller.axisMove,
                direction = {
                    x: {
                        next: 'left',
                        prev: 'right'
                    },
                    y: {
                        next: 'up',
                        prev: 'down'
                    }
                };

            if(startPosition === endPoint) {
                return module.lastDirection;
            }

            if(endPoint < startPosition) {
                return direction[axis]['next'];
            } else {
                return direction[axis]['prev'];
            }
        }
    };

    $.fn['screenroller-touch'] = function() {
        this.roller['module-touch'] = $.extend({ el: this, roller: this.roller }, Object.create(Touch));
        this.roller['module-touch'].init();

        return this;
    };
}(jQuery));