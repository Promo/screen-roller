(function($) {
    var MODULE_NAME = 'menu';
    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
    var MODULE_TYPE = 'navigation';
    var EVENT_CLICK = 'click.' + MODULE_NAME;
    var EVENT_REQUEST_MOVE = 'request-move';

    var _addListeners = function() {
        var module = this;
        var $el = this.core.$el;
        module.$items.on(EVENT_CLICK, function() {
            if(module.enabled) {
                $el.trigger(EVENT_REQUEST_MOVE, {
                    direction: $(this).index(),
                    type: MODULE_NAME
                });
            }
        });
    };

    var _removerListeners = function() {
        this.$items.off(EVENT_CLICK);
    };

    function Menu(params) {
        this.options = params.options;
        this.$items = params.options.items.slice();
        this.core = params.roller;
        this.type = MODULE_TYPE;
        this.enable();

        _addListeners.call(this);
    }

    Menu.prototype.enable = function() {
        this.enabled = true;
    };

    Menu.prototype.disable = function() {
        this.enabled = false;
    };

    Menu.prototype.destruct = function() {
        this.disable();
        _removerListeners.call(this);
        delete this.core.modules[ MODULE_NAME ];
    };

    $.fn[ PLAGIN_NAME ] = function(options) {
        this.roller.modules[ MODULE_NAME ] = new Menu({
            $el: this,
            roller: this.roller,
            options: options
        });

        return this;
    };
}(jQuery));