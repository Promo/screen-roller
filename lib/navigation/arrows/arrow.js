(function($) {
    var MODULE_NAME = 'arrows';
    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
    var MODULE_TYPE = 'navigation';
    var EVENT_CLICK = 'click.' + MODULE_NAME;
    var EVENT_REQUEST_MOVE = 'request-move';
    var EVENT_MOVE_SCREEN = 'move-screen';

    var DEFAULT_OPTIONS = {
        classDisable: 'disable'
    };

    var _addListeners = function() {
        var module = this;
        var core = this.core;
        var $el = this.core.$el;

        module.$next && module.$next.on(EVENT_CLICK, function() {
            if(module.enabled) {
                $el.trigger(EVENT_REQUEST_MOVE, {
                    direction: 'next',
                    type: MODULE_NAME,
                    unique: module.core.unique
                });
            }
        });

        module.$prev && module.$prev.on(EVENT_CLICK, function() {
            if(module.enabled) {
                $el.trigger(EVENT_REQUEST_MOVE, {
                    direction: 'prev',
                    type: MODULE_NAME,
                    unique: module.core.unique
                });
            }
        });

        $el.on(EVENT_MOVE_SCREEN, function(e, data){
            if(module.enabled && data.unique === module.core.unique) {

                module.$next.removeClass(module.classDisable);
                module.$prev.removeClass(module.classDisable);

                if(data.index === 0) {
                    module.$prev.addClass(module.classDisable);
                }

                if(data.index === core.countScreens - 1) {
                    module.$next.addClass(module.classDisable);
                }
            }
        });
    };

    var _removeListeners = function() {
        this.$next.off(EVENT_CLICK);
        this.$prev.off(EVENT_CLICK);
    };

    function Keyboard(params) {
        var options = $.extend(true, {}, DEFAULT_OPTIONS, params.options);

        this.core = params.roller;
        this.$next = options.next;
        this.$prev = options.prev;
        this.classDisable = options.classDisable;
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