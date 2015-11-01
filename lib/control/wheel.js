(function($){

    var Wheel = {
        init: function() {
            var module = this,
                roller = this.roller;

            module.eventWheel     = module.getEventWheel();
            module.deltaArray     = [ 0, 0, 0 ];
            module.isAcceleration = false;
            module.isStopped      = true;
            module.direction      = '';
            module.timer          = '';

            roller.offEventsWheel  = module.offEventsWheel.bind(module);
            roller.bindEventsWheel = module.bindEventsWheel.bind(module);

            module.bindEventsWheel();
        },

        bindEventsWheel: function() {
            var module = this,
                el = this.el;

            el.on(module.eventWheel, function(event) {
                module.processDelta(event.originalEvent);
                return false;
            });
        },

        getEventWheel: function() {
            return 'onwheel' in document ? 'wheel.screenroller' : 'mousewheel.screenroller';
        },

        offEventsWheel: function() {
            var module = this;

            module.el.off(module.eventWheel);
        },

        processDelta: function(event) {
            var module = this,
                delta = module.getDeltaY(event),
                direction = delta > 0 ? 'next' : 'prev',
                arrayLength = module.deltaArray.length,
                changedDirection = false,
                repeatDirection = 0,
                sustainableDirection, i;

            clearTimeout(module.timer);

            module.timer = setTimeout(function() {
                module.deltaArray = [ 0, 0, 0 ];
                module.isStopped = true;
                module.direction = direction;
            }, 150);

            for(i = 0; i < arrayLength; i++) {
                if(module.deltaArray[i] !== 0) {
                    module.deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
                }
            }

            if(Math.abs(repeatDirection) === arrayLength) {
                sustainableDirection = repeatDirection > 0 ? 'next' : 'prev';

                if(sustainableDirection !== module.direction) {
                    changedDirection = true;
                    module.direction = direction;
                }
            }

            if(!module.isStopped){
                if(changedDirection) {
                    module.isAcceleration = true;
                    module.triggerMovementEvent();
                } else {
                    if(Math.abs(repeatDirection) === arrayLength) {
                        module.analyzeArray(event);
                    }
                }
            }

            if(module.isStopped) {
                module.isStopped = false;
                module.isAcceleration = true;
                module.direction = direction;

                module.triggerMovementEvent();
            }

            module.deltaArray.shift();
            module.deltaArray.push(delta);
        },

        analyzeArray: function(event) {
            var module = this,
                deltaArray0Abs  = Math.abs(module.deltaArray[0]),
                deltaArray1Abs  = Math.abs(module.deltaArray[1]),
                deltaArray2Abs  = Math.abs(module.deltaArray[2]),
                deltaAbs        = Math.abs(module.getDeltaY(event));

            if( (deltaAbs       > deltaArray2Abs) &&
                (deltaArray2Abs > deltaArray1Abs) &&
                (deltaArray1Abs > deltaArray0Abs)) {

                if(!module.isAcceleration) {
                    module.triggerMovementEvent(this);
                    module.isAcceleration = true;
                }
            }

            if((deltaAbs < deltaArray2Abs) &&
                (deltaArray2Abs <= deltaArray1Abs)) {
                module.isAcceleration = false;
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
            el.trigger('spinWheel', direction);
        }
    };

    $.fn['screenroller-wheel'] = function() {
        this.roller['module-wheel'] = $.extend({ el: this, roller: this.roller }, Object.create(Wheel));
        this.roller['module-wheel'].init();

        return this;
    };
}(jQuery));