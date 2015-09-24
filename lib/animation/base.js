(function($){
    //support base animate
    var methods = $.fn.screenroller.prototype;

    methods.build.baseAnimate = true;

    methods.baseAnimateInit = function() {
        var c = this;

        c.addClass('base-animation');
        c.roller.animation = 'base-animation';

        c.on('turnOnSolidMod', function() {
            c.attr('style', '');
        });
    };

    methods.move3d = function(index, speed) {
        var с = this;
        с.roller.beforeMove(index);

        с.css('transition-duration', speed / 1000 + 's');
        с.css(с.roller.transformPrefix, 'translate3d(0, ' + index * -100 +'%, 0)');

        с.off('transitionend webkitTransitionEnd');
        с.one('transitionend webkitTransitionEnd', function() {
            с.trigger('changeCurrentScreen', {index: index});
        });
    };
}(jQuery));

(function($){
    //support old browsers for base animate
    var methods = $.fn.screenroller.prototype;

    methods.build.baseAnimateOldBrowsers = true;

    methods.moveTop = function(index, speed) {
        var $self = this;
        this.roller.beforeMove(index);
        this.stop(false, true);
        this.animate({top: index * -100 + '%'}, speed, function() {
            $self.trigger('changeCurrentScreen', {index: index});
        });
    };

    methods.selectPropertyAnimate = function() {
        if(this.roller.support3d) {
            return methods.move3d;
        } else {
            return methods.moveTop;
        }
    };
}(jQuery));