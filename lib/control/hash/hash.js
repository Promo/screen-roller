(function($){
    var Hash = {

        init: function() {
            var module = this,
                roller = module.roller;

            roller.onWatcherHash  = module.onWatcherHash.bind(module);
            roller.offWatcherHash = module.offWatcherHash.bind(module);

            module.screensHash = module.getListHashs();
            module.processInitialHash();
            module.onWatcherHash();
        },

        processInitialHash: function() {
            var module = this,
                roller = module.roller,
                matchIndex = module.getIndexSlideByHash(),
                hash;

            if(matchIndex !== -1) {
                roller.currentScreen = matchIndex;
            } else {
                hash = module.screensHash[roller.currentScreen];
                module.changeHash(hash);
            }
        },

        onWatcherHash: function() {
            var module = this;

            module.onWatcherChangeString();
            module.onWatcherChangeScreen();
        },

        offWatcherHash: function() {
            var module = this;

            module.offWatcherChangeString();
            module.offWatcherChangeScreen();
        },

        onWatcherChangeScreen: function() {
            var module = this;

            module.el.on('changeCurrentScreen.hash', function(e, data) {
                module.processChangeScreen(data.index);
            });
        },

        onWatcherChangeString: function() {
            var module = this,
                roller = module.roller;

            roller.win.on('hashchange.screenroller', function() {
                var matchHashIndex = module.getIndexSlideByHash();

                if(matchHashIndex !== -1) {
                    roller.moveTo(matchHashIndex);
                }
            });
        },

        offWatcherChangeString: function() {
            this.roller.win.off('hashchange.screenroller');
        },

        offWatcherChangeScreen: function() {
            var el = this.el;

            el.off('changeCurrentScreen.hash');
        },

        getListHashs: function() {
            return $.map(this.roller.screens, function(screen){
                return $(screen).attr('data-hash');
            });
        },

        getCurrentHash: function() {
            return window.location.hash.replace('#', '');
        },

        getIndexSlideByHash: function() {
            var hashPageInInit = this.getCurrentHash();

            return this.screensHash.indexOf(hashPageInInit);
        },

        changeHash: function(hash) {
            window.location.hash = hash;
        },

        changeHashByIndex: function(index) {
            var hash = this.getHashById(index);

            hash && this.changeHash(hash);
        },

        getHashById: function(index) {
            return this.screensHash[index];
        },

        processChangeScreen: function(index) {
            var module = this;

            module.offWatcherChangeString();
            module.changeHashByIndex(index);

            clearTimeout(module.timer);

            module.timer = setTimeout(function() {
                module.onWatcherChangeString();
            }, 100);
        }
    };

    $.fn['screenroller-hash'] = function() {
        this.roller['module-hash'] = $.extend({ el: this, roller: this.roller }, Object.create(Hash));
        this.roller['module-hash'].init();

        return this;
    };
}(jQuery));