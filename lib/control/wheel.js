(function($){
    //support hash
    var module = 'wheel',
        methods = $.fn.screenroller.prototype;

    methods.build.wheel = true;

    methods.wheelInit = function() {
        var c = this,
            r = this.roller,
            m = r[module] = {};

        m._eventWheel = 'onwheel' in document ? 'wheel.screenroller' : 'mousewheel.screenroller';
        m._deltaArray = [ 0, 0, 0 ];
        m._isAcceleration = false;
        m._isStopped = true;
        m._direction = '';
        m._timer = '';
        m._isWorking = true;

        c.onEventMovement = methods.onEventMovement;
        c.offEventMovement = methods.offEventMovement;

        methods.bindEventsWheel.call(c);
    };

    methods.bindEventsWheel = function() {
        var c = this;

        methods.onEventMovement.call(c);
    };

    methods.onEventMovement = function() {
        var c = this,
            m = this.roller[module];

        c.on(m._eventWheel, function(event) {
            methods.wheelHandler.call(c, event.originalEvent);
        });
    };

    methods.offEventMovement = function() {
        var c = this,
            m = this.roller[module];

        c.off(m._eventWheel);
    };

    methods.wheelHandler = function(event) {
        var c = this;

        //добавить условие на проверку работы (включен, выключен) ст30
        methods.processDelta.call(c, event);

        //добавить условие на проверку отмены всплытия (включен, выключен) ст33
        event.preventDefault();
    };

    methods.processDelta = function(event) {
        var c = this,
            m = this.roller[module],
            delta = methods.getDeltaY.call(c, event),
            direction = delta > 0 ? 'down' : 'up',
            arrayLength = m._deltaArray.length,
            changedDirection = false,
            repeatDirection = 0,
            sustainableDirection, i;

        clearTimeout(m._timer);

        m._timer = setTimeout(function() {
            m._deltaArray = [ 0, 0, 0 ];
            m._isStopped = true;
            m._direction = direction;
        }, 150);

        for(i = 0; i < arrayLength; i++) {
            if(m._deltaArray[i] !== 0) {
                m._deltaArray[i] > 0 ? ++repeatDirection : --repeatDirection;
            }
        }

        if(Math.abs(repeatDirection) === arrayLength) {
            sustainableDirection = repeatDirection > 0 ? 'down' : 'up';

            if(sustainableDirection !== m._direction) {
                changedDirection = true;
                m._direction = direction;
            }
        }

        if(!m._isStopped){
            if(changedDirection) {
                m._isAcceleration = true;
                methods.triggerMovementEvent.call(this);
            } else {
                if(Math.abs(repeatDirection) === arrayLength) {
                    methods.analyzeArray.call(this, event);
                }
            }
        }

        if(m._isStopped) {
            m._isStopped = false;
            m._isAcceleration = true;
            m._direction = direction;

            methods.triggerMovementEvent.call(this);
        }

        m._deltaArray.shift();
        m._deltaArray.push(delta);
    };

    methods.analyzeArray = function(event) {
        var
            m = this.roller[module],
            deltaArray0Abs  = Math.abs(m._deltaArray[0]),
            deltaArray1Abs  = Math.abs(m._deltaArray[1]),
            deltaArray2Abs  = Math.abs(m._deltaArray[2]),
            deltaAbs        = Math.abs(methods.getDeltaY(event));

        if((deltaAbs       > deltaArray2Abs) &&
            (deltaArray2Abs > deltaArray1Abs) &&
            (deltaArray1Abs > deltaArray0Abs)) {

            if(!m._isAcceleration) {
                methods.triggerMovementEvent.call(this);
                m._isAcceleration = true;
            }
        }

        if((deltaAbs < deltaArray2Abs) &&
            (deltaArray2Abs <= deltaArray1Abs)) {
            m._isAcceleration = false;
        }
    };

    methods.getDeltaY = function(event){
        if (event.wheelDelta) {
            getDeltaY = function(event) {
                return event.wheelDelta * -1;
            };
        } else {
            getDeltaY = function(event) {
                return event.deltaY;
            };
        }
        //return x3 for ya
        return getDeltaY(event);
    };

    methods.triggerMovementEvent = function() {
        var c = this,
            direction = c.roller[module]._direction;

        c.moveTo(direction);
        c.trigger('movement', direction)
    }

}(jQuery));