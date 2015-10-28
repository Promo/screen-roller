(function($){
    var Hash = {

        init: function() {
            var module = this,
                roller = this.roller;

            module.screensHash = module.getListHashs();

            var matchIndex = module.checkMatchHash();

            if(matchIndex !== -1) {
                roller.currentScreen = matchIndex;
            } else {
                module.changeHash(module.screensHash[roller.currentScreen]);
            }

            module.bindEventsHash();
        },

        bindEventsHash: function() {
            var module = this;

            module.bindEvenChangeHash();

            module.el.on('changeCurrentScreen', function(e, data) {
                module.processChangeScreen(data.index);
            });
        },

        bindEvenChangeHash: function() {
            var module = this,
                roller = this.roller;

            module.roller.win.on('hashchange.screenroller', function() {
                var matchHashIndex = module.checkMatchHash();

                if(matchHashIndex !== -1) {
                    roller.moveTo(matchHashIndex);
                }
            });
        },

        offEventChangeHash: function() {
            this.roller.win.off('hashchange.screenroller');
        },

        getListHashs: function() {
            return $.map(this.roller.screens, function(screen){
                return $(screen).attr('data-hash');
            });
        },

        getCurrentHash: function() {
            return window.location.hash.replace('#', '');
        },

        checkMatchHash: function() {
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
            var module = this,
                timer;

            module.offEventChangeHash();
            module.changeHashByIndex(index);

            clearTimeout(timer);

            timer = setTimeout(function() {
                module.bindEvenChangeHash();
            }, 100);
        }
    };

    $.fn['screenroller-hash'] = function() {
        this.roller['module-hash'] = $.extend({ el: this, roller: this.roller }, Object.create(Hash));
        this.roller['module-hash'].init();

        return this;
    };
}(jQuery));