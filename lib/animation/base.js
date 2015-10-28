(function($){
    var BaseAnimation = {

        init: function() {
            var roller = this.roller;

            roller.clearStylesAnimation = this.clearStylesAnimation.bind(this);
            roller.addStylesAnimation = this.addStylesAnimation.bind(this);

            roller.selectTypeAnimation = this.selectTypeAnimation.bind(this);
            roller.runFunctionAnimation = this.runFunctionAnimation.bind(this);
            roller.axisMove = 'y';

            this.addStylesAnimation();
            this.bindEventsBaseAnimation();
        },

        clearStylesAnimation: function() {
            this.roller.delClass('base-animation');
            this.roller.removeInlineStyle();
        },

        addStylesAnimation: function() {
            this.roller.setClass('base-animation');
        },

        destruct: function(){
             //todo
        },

        bindEventsBaseAnimation: function() {
            var el = this.el;

            el.on('processTouchStart', function(e, value){
                el.removeCSSTransition();

                el.setTransform(value);
            });

            el.on('processTouchMove', function(e, value){
                el.setTransform(value);
            });
        },

        baseAnimateTransform: function(index, speed) {
            var roller = this.roller,
                el = this.el;

            roller.options.beforeMove(index);

            el.css('transition-duration', speed / 1000 + 's');
            el.css('transform', 'translate3d(0, ' + index * -100 +'%, 0)');

            el.off('transitionend webkitTransitionEnd');
            el.one('transitionend webkitTransitionEnd', function() {
                el.trigger('changeCurrentScreen', { index: index });
            });
        },

        baseAnimateOffset: function(index, speed) {
            var roller = this.roller,
                el = this.el;

            roller.options.beforeMove(index);

            el.stop(false, false);
            el.animate({ top: index * -100 + '%' }, speed, function() {
                el.trigger('changeCurrentScreen', { index: index });
            });
        },

        selectTypeAnimation: function(index, speed) {
            var roller = this.roller;

            if(roller.transition && roller.transform3d) {
                return this.baseAnimateTransform(index, speed);
            } else {
                return this.baseAnimateOffset(index, speed);
            }
        },

        runFunctionAnimation: function(index, speed) {
            return this.selectTypeAnimation(index, speed);
        }
    };

    $.fn['screenroller-base-animation'] = function() {
        this.roller['module-base-animation'] = $.extend({ el: this, roller: this.roller }, Object.create(BaseAnimation));
        this.roller['module-base-animation'].init();

        return this;
    };
}(jQuery));