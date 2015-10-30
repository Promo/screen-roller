(function($){

    var Wheel = {
        init: function() {
            var roller = this.roller;

            roller.offEventsWheel = this.offEventsWheel.bind(this);
            roller.bindEventsWheel = this.bindEventsWheel.bind(this);

            this.eventWheel = 'onwheel' in document ? 'wheel.screenroller' : 'mousewheel.screenroller';
            this.deltaArray = [ 0, 0, 0 ];
            this.isAcceleration = false;
            this.isStopped = true;
            this.direction = '';
            this.timer = '';
            //todo 
            this.isWorking = true;

            this.bindEventsWheel();
        },

        bindEventsWheel: function() {
            var wheel = this,
                el = this.el;

            el.on(this.eventWheel, function(event) {
                wheel.wheelHandler(event.originalEvent);
            });
        },

        offEventsWheel: function() {
            this.el.off(this.eventWheel);
        },

        wheelHandler: function(event) {
            this.processDelta(event);
            //todo
            event.preventDefault();
        },

        processDelta: function(event) {
            var wheel = this,
                delta = this.getDeltaY(event),
                direction = delta > 0 ? 'next' : 'prev',
                arrayLength = this.deltaArray.length,
                changedDirection = false,
                repeatDirection = 0,
                sustainableDirection, i;

            clearTimeout(wheel.timer);

            wheel.timer = setTimeout(function() {
                wheel.deltaArray = [ 0, 0, 0 ];
                wheel.isStopped = true;
                wheel.direction = direction;
            }, 150);

            for(i = 0; i < arrayLength; i++) {
                if(wheel.deltaArray[i] !== 0) {
                    wheel.deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
                }
            }

            if(Math.abs(repeatDirection) === arrayLength) {
                sustainableDirection = repeatDirection > 0 ? 'next' : 'prev';

                if(sustainableDirection !== wheel.direction) {
                    changedDirection = true;
                    wheel.direction = direction;
                }
            }

            if(!wheel.isStopped){
                if(changedDirection) {
                    wheel.isAcceleration = true;
                    wheel.triggerMovementEvent();
                } else {
                    if(Math.abs(repeatDirection) === arrayLength) {
                        wheel.analyzeArray(event);
                    }
                }
            }

            if(wheel.isStopped) {
                wheel.isStopped = false;
                wheel.isAcceleration = true;
                wheel.direction = direction;

                wheel.triggerMovementEvent();
            }

            wheel.deltaArray.shift();
            wheel.deltaArray.push(delta);
        },

        analyzeArray: function(event) {
            var wheel = this,
                deltaArray0Abs  = Math.abs(wheel.deltaArray[0]),
                deltaArray1Abs  = Math.abs(wheel.deltaArray[1]),
                deltaArray2Abs  = Math.abs(wheel.deltaArray[2]),
                deltaAbs        = Math.abs(wheel.getDeltaY(event));

            if( (deltaAbs       > deltaArray2Abs) &&
                (deltaArray2Abs > deltaArray1Abs) &&
                (deltaArray1Abs > deltaArray0Abs)) {

                if(!wheel.isAcceleration) {
                    wheel.triggerMovementEvent(this);
                    wheel.isAcceleration = true;
                }
            }

            if((deltaAbs < deltaArray2Abs) &&
                (deltaArray2Abs <= deltaArray1Abs)) {
                wheel.isAcceleration = false;
            }
        },

        getDeltaY: function(event) {
            if (event.wheelDelta) {
                getDeltaY = function(event) {
                    return event.wheelDelta * -1;
                };
            } else {
                getDeltaY = function(event) {
                    return event.deltaY;
                };
            }

            return getDeltaY(event);
        },

        triggerMovementEvent: function() {
            var el = this.el,
                direction = this.direction;

            el.moveTo(direction);
            el.trigger('movement', direction);
        }
    };

    $.fn['screenroller-wheel'] = function() {
        this.roller['module-wheel'] = $.extend({ el: this, roller: this.roller}, Object.create(Wheel));
        this.roller['module-wheel'].init();

        return this;
    };
}(jQuery));