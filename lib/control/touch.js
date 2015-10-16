(function($){
    //support hash
    var module = 'touch',
        methods = $.fn.screenroller.prototype;

    var
        /* ось */
        axisMove,
        startTransformPosition,
        startPosition,
        currentPosition,
        lastPosition,
        offset,
        currentTransformPosition,
        lastDirection,
        commonDirection,
        isMouseDown;

    methods.build[module] = true;

    methods[module + 'Init'] = function() {
        var c = this,
            r = this.roller;

        axisMove = c.roller.axisMove;

        bindEventsTouch.call(c);

        c.bindEventsTouch = bindEventsTouch;
        c.offEventsTouch = offEventsTouch;
    };

    function bindEventsTouch() {
        var c = this,
            $screens = c.roller.$screens;

        $screens.on('touchstart.screenroller', function(e){
            processTouchStart.call(c, e);
        });

        $screens.on('touchmove.screenroller', function(e){
            processTouchMove.call(c, e);
            return false;
        });

        $screens.on('touchend.screenroller', function() {
            processTouchEnd.call(c);
        });

        $screens.on('touchcancel.screenroller', function() {
            processTouchCancel.call(c);
        });

        $('body, html').on('touchmove.screenroller', function() {
            return false;
        });

        if(c.roller.mouseEmulateTouch) {
            $screens.on('mousedown.screenroller', function(e){
                isMouseDown = true;
                processTouchStart.call(c, e);
            });

            $screens.on('mousemove.screenroller', function(e) {
                if(isMouseDown) {
                    processTouchMove.call(c, e);
                    console.log('move');    
                }
            });

            $screens.on('mouseup.screenroller', function() {
                processTouchEnd.call(c);
                isMouseDown = false;
            });

            $screens.on('mouseleave.screenroller', function() {
                processTouchCancel.call(c);
                isMouseDown = false;
            });
        }
    }

    function offEventsTouch() {
        var c = this,
            $screens = c.roller.$screens;

        $screens.off('touchstart.screenroller touchmove.screenroller touchend.screenroller touchcancel.screenroller');

        $('body, html').off('touchmove.screenroller');

        if(c.roller.mouseEmulateTouch) {
            $screens.off('mousedown.screenroller mousemove.screenroller mouseup.screenroller mouseleave.screenroller');
        }
    }

    function getTransition() {
        var value = this.css('transform').split(', ');

        if(!value) {
            return 0;
        }

        return axisMove === 'x' ? parseInt(value[4]) : parseInt(value[5]);
    }

    function touchEnd(commonDirection, lastDirection) {
        var c = this,
            r = c.roller,
            speed   = r.speedanimation,
            countScreens  = r.countScreens - 1,
            currentScreen = r.currentScreen;

        if(commonDirection === lastDirection) {
            if(commonDirection === 'down' && currentScreen === 0) {
                c.moveTo(currentScreen, speed);
            }

            if(commonDirection === 'up' && currentScreen === countScreens) {
                c.moveTo(currentScreen, speed);
            }

            commonDirection === 'up' ? c.moveTo('down', speed) : c.moveTo('up', speed);
        } else {
            c.moveTo(currentScreen, speed);
        }

    }

    function getDirection(startPosition, endPoint) {
        var direction = {
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
            return lastDirection;
        }

        return endPoint < startPosition ? direction[axisMove]['next'] : direction[axisMove]['prev']
    }

    function processTouchStart(e) {
        var c = this;
        lastDirection = 'none';

        startTransformPosition = getTransition.call(c);
        startPosition = getCurrentPosition(e);

        c.trigger('processTouchStart', startTransformPosition);
    }

    function processTouchMove(e) {
        currentPosition = getCurrentPosition(e);

        lastDirection = getDirection(lastPosition || currentPosition, currentPosition);

        offset = startPosition - currentPosition;

        currentTransformPosition = startTransformPosition - offset;

        lastPosition = currentPosition;

        this.trigger('processTouchMove', currentTransformPosition);
    }

    function processTouchEnd () {
        commonDirection = getDirection(startPosition || 0, currentPosition || startPosition);

        touchEnd.call(this, commonDirection, lastDirection);

        this.trigger('processTouchEnd');
    }

    function processTouchCancel() {
        var c = this;

        c.moveTo(c.roller.currentScreen, c.roller.speedanimation);

        this.trigger('processTouchCancel');
    }

    function getCurrentPosition(e) {
        return e['originalEvent']['page' + axisMove.toUpperCase()] ||
               e['originalEvent'].changedTouches[0]['page' + axisMove.toUpperCase()] //android chrome
    }

}(jQuery));