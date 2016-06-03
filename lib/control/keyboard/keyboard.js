(function($) {
    var MODULE_NAME = 'keyboard';
    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
    var MODULE_TYPE = 'control';
    var EVENT_KEY = 'keydown.' + MODULE_NAME;
    var EVENT_REQUEST_MOVE = 'request-move';

    var PAGEUP = 33;
    var PAGEDOWM = 34;

    var END = 35;
    var HOME = 36;

    var ARROWUP = 38;
    var ARROWDOWN = 40;

    var DEFAULT_OPTIONS = {
        next: [ PAGEDOWM, ARROWDOWN ],
        prev: [ PAGEUP, ARROWUP ],
        last: [ END ],
        first: [ HOME ]
    };

    var _addListeners = function() {
        var module = this;
        var $win = this.core.nodes.$win;

        $win.on(EVENT_KEY, function(e) {
            if(module.enabled) {
                _processingEvent.call(module, e);
            }
        });
    };

    var _removeListeners = function() {
        var $win = this.core.nodes.$win;

        $win.off(EVENT_KEY);
    };

    var _processingEvent = function(e) {
        var $el = this.core.$el;

        var code = e.keyCode;
        var next = this.next;
        var prev = this.prev;
        var last = this.last;
        var first = this.first;

        var module = this;

        if(next && next.indexOf(code) >= 0) {
            $el.trigger(EVENT_REQUEST_MOVE, {
                direction: 'next',
                initiator: MODULE_NAME,
                unique: module.core.unique
            });
        }

        if(prev && prev.indexOf(code) >= 0) {
            $el.trigger(EVENT_REQUEST_MOVE, {
                direction: 'prev',
                initiator: MODULE_NAME,
                unique: module.core.unique
            });
        }

        if(last && last.indexOf(code) >= 0) {
            $el.trigger(EVENT_REQUEST_MOVE, {
                direction: 'last',
                initiator: MODULE_NAME,
                unique: module.core.unique
            });
        }

        if(first && first.indexOf(code) >= 0) {
            $el.trigger(EVENT_REQUEST_MOVE, {
                direction: 'first',
                initiator: MODULE_NAME,
                unique: module.core.unique
            });
        }
    };

    function Keyboard(params) {
        var options = $.extend(DEFAULT_OPTIONS, params.options);

        this.core = params.roller;
        this.next = options.next;
        this.prev = options.prev;
        this.first = options.first;
        this.last = options.last;
        this.type = MODULE_TYPE;
        this.enable();

        _addListeners.call(this);
    }

    Keyboard.prototype.disable = function() {
        this.enabled = false;
    };

    Keyboard.prototype.enable = function() {
        this.enabled = true;
    };

    Keyboard.prototype.destruct = function() {
        _removeListeners.call(this);
        this.disable();
        delete this.core.modules[ MODULE_NAME ];
    };

    $.fn[ PLAGIN_NAME ] = function(options) {
        this.roller.modules[ MODULE_NAME ] = new Keyboard({
            $el: this,
            roller: this.roller,
            options: options
        });

        return this;
    };
}(jQuery));