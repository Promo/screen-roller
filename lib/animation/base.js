(function($){
    var BaseAnimation = {

        init: function() {
            var roller = this.roller;

            roller.clearStylesAnimation = this.clearStylesAnimation.bind(this);
            roller.addStylesAnimation = this.addStylesAnimation.bind(this);
            roller.selectTypeAnimation = this.selectTypeAnimation.bind(this);
            roller.runFunctionAnimation = this.runFunctionAnimation.bind(this);
            roller.axisMove = roller.options.axisMove;

            this.addStylesAnimation();
            this.bindEventsBaseAnimation();
        },

        clearStylesAnimation: function() {
            var roller = this.roller,
                screens = roller.screens,
                axisMove = roller.axisMove;

            roller.delClass('base-animation');
            roller.delClass('axis-' + axisMove);
            roller.removeInlineStyle();
            screens.css('left', 0);
        },

        addStylesAnimation: function() {
            var roller = this.roller,
                screens = roller.screens,
                axisMove = roller.axisMove;

            roller.setClass('base-animation');

            if(axisMove === 'x') {
                roller.setClass('axis-x');
                screens.each(function(index) {
                    screens.eq(index).css({ left: 100 * index + '%' });
                });
            }

            if(axisMove === 'y') {
                roller.setClass('axis-y');
            }
        },

        destruct: function(){
             //todo
        },

        bindEventsBaseAnimation: function() {
            var module = this,
                el = this.el;

            el.on('processTouchStart', function(e, value){
                el.removeCSSTransition();

                module.setTransform(value);
            });

            el.on('processTouchMove', function(e, value){
                module.setTransform(value);
            });
        },

        baseAnimateTransform: function(index, speed) {
            var roller = this.roller,
                el = this.el,
                value = this.getTransitionByIndex(index);

            roller.options.beforeMove(index);

            el.css('transition-duration', speed / 1000 + 's');
            el.css('transform', value);

            el.off('transitionend webkitTransitionEnd');
            el.one('transitionend webkitTransitionEnd', function() {
                el.trigger('changeCurrentScreen', { index: index });
            });
        },

        baseAnimateOffset: function(index, speed) {
            var roller = this.roller,
                el = this.el,
                value = this.getOffsetByIndex(index);

            roller.options.beforeMove(index);

            el.stop(false, false);
            el.animate(value, speed, function() {
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
        },

        getTransitionByIndex: function(index) {
            var axisMove = this.roller.axisMove;

            if(axisMove === 'x') {
                return 'translate3d(' + index * -100 + '%, 0, 0)';
            }

            if(axisMove === 'y') {
                return 'translate3d(0, ' + index * -100 +'%, 0)';
            }
        },

        getOffsetByIndex: function(index) {
            var axisMove = this.roller.axisMove;

            if(axisMove === 'x') {
                return { left: index * -100 + '%' };
            }

            if(axisMove === 'y') {
                return { top: index * -100 + '%' };
            }
        },

        setTransform: function(value) {
            var axisMove = this.roller.axisMove,
                el = this.el;

            if(axisMove === 'x') {
                return el.css('transform', 'translate3d(' + value + 'px, 0, 0)');
            }

            if(axisMove === 'y') {
                return el.css('transform', 'translate3d(0,' + value +'px, 0)');
            }
        }
    };

    $.fn['screenroller-base-animation'] = function() {
        this.roller['module-base-animation'] = $.extend({ el: this, roller: this.roller }, Object.create(BaseAnimation));
        this.roller['module-base-animation'].init();

        return this;
    };
}(jQuery));