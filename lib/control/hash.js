(function($){
    //support hash
    var methods = $.fn.screenroller.prototype;

    methods.build.hash = true;

    methods.hashInit = function() {
        this.roller.screensHash = methods.getScreensHash.call(this);

        var matchIndex = methods.checkMatchHash.call(this);

        if(matchIndex !== -1) {
            this.roller.currentScreen = matchIndex;
        }

        methods.bindEventsHash.call(this);
    };

    methods.bindEventsHash = function() {
        var c = this,
            timer;

        methods.onEventChangeHash.call(c);

        c.on('changeCurrentScreen', function(e, data) {
            methods.offEventChangeHash.call(c);
            methods.changeHashByIndex.call(c, data.index);
            clearTimeout(timer);
            timer = setTimeout(function() {
                methods.onEventChangeHash.call(c);
            }, 100);
        });
    };

    methods.onEventChangeHash = function() {
        var c = this;
        $(window).on('hashchange.screenroller', function() {
            var matchHashIndex = methods.checkMatchHash.call(c);
            if(matchHashIndex !== -1) {
                c.moveTo(matchHashIndex);
            }
        });
    };

    methods.checkMatchHash = function() {
        var hashPageInInit = methods.getCurrentHash();

        return this.roller.screensHash.indexOf(hashPageInInit);
    };

    methods.offEventChangeHash = function() {
        $(window).off('hashchange.screenroller');
    };

    methods.changeHashByIndex = function(index) {
        var hash = methods.getHashById.call(this, index);

        hash && methods.changeHash(hash);
    };

    methods.getHashById = function(index) {
        return this.roller.screensHash[index];
    };

    methods.changeHash = function(hash) {
        window.location.hash = hash;
    };

    methods.getCurrentHash = function() {
        return window.location.hash.replace('#', '');
    };

    methods.getScreensHash = function() {
        return $.map(this.roller.$screens, function(screen){
            return $(screen).attr('data-hash');
        });
    };

}(jQuery));