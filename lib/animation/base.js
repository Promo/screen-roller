(function($){
    //support base animate
    var methods = $.fn.screenroller.prototype;

    methods.build.baseAnimate = true;

    methods.baseAnimateInit = function() {
        var c = this;

        c.roller.animation = 'base-animation';
        c.roller.axisMove = 'y';
        c.addClass('base-animation');

        c.on('turnOnSolidMod', function() {
            c.attr('style', '');
        });

        c.on('processTouchStart', function(e, value){
            c.removeCSSTransition();

            c.setTransform(value, c.roller.axisMove);
        });

        c.on('processTouchMove', function(e, value){
            c.setTransform(value, c.roller.axisMove);
        });
    };

    methods.animateTransform = function(index, speed) {
        var с = this;

        с.roller.beforeMove(index);

        с.css('transition-duration', speed / 1000 + 's');
        с.css(с.roller.transform3d, 'translate3d(0, ' + index * -100 +'%, 0)');

        с.off('transitionend webkitTransitionEnd');
        с.one('transitionend webkitTransitionEnd', function() {
            с.trigger('changeCurrentScreen', {index: index});
        });
    };

    methods.animateOffset = function(index, speed) {
        var c = this;

        c.roller.beforeMove(index);
        c.stop(false, true);
        c.animate({top: index * -100 + '%'}, speed, function() {
            c.trigger('changeCurrentScreen', { index: index });
        });
    };
}(jQuery));