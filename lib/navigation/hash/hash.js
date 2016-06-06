(function($) {
    var MODULE_NAME = 'hash';
    var PLAGIN_NAME = 'screenroller' + '-' + MODULE_NAME;
    var MODULE_TYPE = 'navigation';
    var EVENT_SCREEN_MOVE = 'move-screen';
    var EVENT_REQUEST_MOVE = 'request-move';
    var EVENT_CHANGE_HASH = 'hashchange.' + MODULE_NAME;
    var $WIN = $(window);

    var _getHash = function() {
        return window.location.hash.replace('#', '');
    };

    var _setHash = function(hash) {
        window.location.hash = hash;
    };

    var _onHashWatcher = function() {
        var module = this;

        setTimeout(function() {
            $WIN.on(EVENT_CHANGE_HASH, function() {
                if(module.enabled) {
                    _processingChangeHash.call(module);
                }
            });
        }, 10);
    };

    var _offHashWatcher = function() {
        $WIN.off(EVENT_CHANGE_HASH);
    };

    var _addListeners = function() {
        var module = this;
        var $el = this.core.$el;

        $el.on(EVENT_SCREEN_MOVE, function(e, data) {
            if(module.enabled && data.unique === module.core.unique) {
                _processingRequestMove.call(module, data.index);
            }
        });

        _onHashWatcher.call(module);
    };

    var _processingRequestMove = function(index) {
        _offHashWatcher.call(this);

        this.screensHash[ index ] ? _setHash(this.screensHash[ index ]) : null;

        _onHashWatcher.call(this);
    };

    var _processingChangeHash = function() {
        var hash = _getHash();
        var index = this.screensHash.indexOf(hash);
        var $el = this.core.$el;

        if(index !== -1) {
            $el.trigger(EVENT_REQUEST_MOVE, {
                direction: index,
                initiator: MODULE_NAME
            });
        }
    };

    var _removeListeners = function() {
        var $el = this.core.$el;

        $el.off(EVENT_SCREEN_MOVE);
        _offHashWatcher();
    };

    function Hash(params) {
        this.core = params.roller;
        this.$el = params.$el;

        this.screensHash = $.map(this.core.$screens, function(screen) {
            return $(screen).attr('data-hash') || '';
        });

        this.type = MODULE_TYPE;
        this.enable();

        _addListeners.call(this);

        //check at initialization
        var hash = _getHash();
        var index = this.screensHash.indexOf(hash);

        if(index !== -1) {
            this.$el.trigger(EVENT_REQUEST_MOVE, {
                direction: index,
                initiator: MODULE_NAME,
                unique: this.core.unique
            });
        } else {
            _setHash(this.screensHash[ 0 ]);
        }
    }

    Hash.prototype.enable = function() {
        this.enabled = true;
    };

    Hash.prototype.disable = function() {
        this.enabled = false;
    };

    Hash.prototype.destruct = function() {
        _removeListeners.call(this);
        this.disable();
        delete this.core.modules[ MODULE_NAME ];
    };

    $.fn[ PLAGIN_NAME ] = function() {
        this.roller.modules[ MODULE_NAME ] = new Hash({
            $el: this,
            roller: this.roller
        });

        return this;
    };
}(jQuery));