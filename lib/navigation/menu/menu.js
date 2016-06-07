(function($) {
    var MODULE_NAME = 'menu';
    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
    var MODULE_TYPE = 'navigation';
    var EVENT_CLICK = 'click.' + MODULE_NAME;
    var EVENT_REQUEST_MOVE = 'request-move';
    var EVENT_MOVE_SCREEN = 'move-screen';

    var DEFAULT_OPTIONS = {
        classCurrent: 'current'
    };

    var _addListeners = function() {
        var module = this;
        var $el = this.core.$el;

        module.$items.on(EVENT_CLICK, function() {
            if(module.enabled) {
                $el.trigger(EVENT_REQUEST_MOVE, {
                    direction: $(this).index(),
                    type: MODULE_NAME,
                    unique: module.core.unique
                });
            }
        });

        $el.on(EVENT_MOVE_SCREEN, function(e, data){
            if(module.enabled && data.unique === module.core.unique) {
                _setCurrentClass.call(module, data.index);
            }
        });
    };

    var _removerListeners = function() {
        this.$items.off(EVENT_CLICK);
    };

    var _setCurrentClass = function(index) {
        this.$items.removeClass(this.classCurrent);
        this.$items.eq(index).addClass(this.classCurrent);
    };

    function Menu(params) {
        var options = $.extend(true, {}, DEFAULT_OPTIONS, params.options);

        this.$items = options.items.slice();
        this.core = params.roller;
        this.type = MODULE_TYPE;
        this.classCurrent = options.classCurrent;
        this.enable();

        _addListeners.call(this);
        _setCurrentClass.call(this, 0);
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