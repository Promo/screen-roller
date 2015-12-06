(function($){
    var PAGEUP      = 33;
    var PAGEDOWM    = 34;

    var END         = 35;
    var HOME        = 36;

    var ARROWLEFT   = 37;
    var ARROWUP     = 38;
    var ARROWRIGHT  = 39;
    var ARROWDOWN   = 40;

    var Keyboard = {
        init: function() {
            var module = this,
                roller = module.roller;

            roller.onWatcherKeyboard  = module.onWatcherKeyboard.bind(module);
            roller.offWatcherKeyboard = module.offWatcherKeyboard.bind(module);

            module.options = roller.options.modules.keyboard;
            module.keys = module.defineSetKeys();
            module.win  = roller.win;

            module.onWatcherKeyboard();
        },

        onWatcherKeyboard: function() {
            var module = this,
                roller = module.roller,
                keys   = module.keys,
                last  = roller.countScreens - 1;

            module.win.on('keydown.screenroller', function(e) {
                var code = e.keyCode;

                if(keys.next && keys.next.indexOf(code) >= 0) {
                    roller.moveTo('next');  
                }

                if(keys.prev && keys.prev.indexOf(code) >= 0) {
                    roller.moveTo('prev');
                }

                if(keys.end && keys.end.indexOf(code) >= 0) {
                    roller.moveTo(last);
                }

                if(keys.begin && keys.begin.indexOf(code) >= 0) {
                    roller.moveTo(0);
                }
            });
        },

        offWatcherKeyboard: function() {
            this.win.off('keydown.screenroller');
        },

        defineSetKeys: function() {
            var module = this,
                roller = module.roller,
                axis   = roller.axisMove,
                optionsKeys = module.options,
                keys = {};

            if(axis === 'x') {
                keys.next  = optionsKeys.next || [ PAGEDOWM, ARROWRIGHT ];
                keys.prev  = optionsKeys.prev || [ PAGEUP, ARROWLEFT ];
            } else {
                keys.next  = optionsKeys.next || [ PAGEDOWM, ARROWDOWN ];
                keys.prev  = optionsKeys.prev || [ PAGEUP, ARROWUP ];
            }

            keys.end   = optionsKeys.end   || [ END ];
            keys.begin = optionsKeys.begin || [ HOME];

            return keys;
        }
    };

    $.fn['screenroller-keyboard'] = function() {
        this.roller['module-keyboard'] = $.extend({ el: this, roller: this.roller }, Object.create(Keyboard));
        this.roller['module-keyboard'].init();

        return this;
    };
}(jQuery));