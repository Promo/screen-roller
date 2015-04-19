(function($){

	$.fn.roller = function(options) {

		var $self = this,
			$win = $(window),
			$html = $('html'),
            $body = $('body'),
			$htmlbody = $('html, body'),
            tempNode = $('<div></div>'),
			addBind = {},
			onMod = {},
			runScrolling ={},
			move = {},
			mod,
			nextIndexScreen,
			transform3d,
			transformPrefix,
            offsetScreens,
            nearValue,
            nearScreen,
            animateNow,
			oldValue;

      	var options = $.extend({
      		'baseClass': 'roller',
	      	'screenClass'      : 'screen',
	      	'screenPageClass': 'screen-page',
	      	'solidPageClass': 'solid-page',
			'minHeight' : 500,
			'minWidth': 500,
			'animationSpeed': 500,
			'beforeMove': function(){},
			'afterMove': function(){},
            'changeScreen': function(){}

	    }, options);

      	var init = function() {
	    	this.$screens = this.find('.' + options.screenClass);
	    	this.countScreens = this.$screens.size();
	    	this.currentScreen = 0;
			this.addClass(options.baseClass);
			this.animationSpeed = options.animationSpeed;
			this.moveTo = moveTo;

            checkSupport3d();
            addCommonBind();
			determineMod();
	    };
      	

	    var addCommonBind = function() {
	    	$win.on('resize.roller', function() {
	    		determineMod.call($self);
	    	});
	    };

	    var determineMod = function() {
	    	(($win.height() > options.minHeight) &&
	    	 ($win.width()  > options.minWidth)) ?  mod = options.screenPageClass : mod = options.solidPageClass;
	    		
	    	if(mod !== $self.mod) {
	    		$self.mod = mod;
	    		onMod[mod]();
	    	}
	    };

	    var removeBinds = function() {
	    	$win.off('scroll.roller');
	    };

	    var moveTo = function(direction) {
	    	if(typeof direction  === 'string') {
	    		direction === 'up' ? nextIndexScreen = $self.currentScreen - 1 : nextIndexScreen = $self.currentScreen + 1;
	    	}

	    	if(typeof direction === 'number') {
	    		nextIndexScreen = direction;
	    	}

	    	if( (nextIndexScreen < 0) ||
	    		(nextIndexScreen > $self.countScreens - 1) ||
	    		(typeof nextIndexScreen !== 'number') ) {
	    		return;
	    	}

	    	$self.currentScreen = nextIndexScreen;
	    	runScrolling[mod][transform3d](nextIndexScreen)
	    };


        var checkSupport3d = function() {
            $body.append(tempNode);

            $.each([ '-webkit-transform', '-o-transform',  '-ms-transform', '-moz-transform', 'transform' ], function(i, val) {
                tempNode.css(val, 'translate3d(1px, 1px, 1px)');
                tempNode.css(val) && tempNode.css(val).match(/matrix3d/) ? transformPrefix = val : '';
            });

            tempNode.remove();
            transform3d = transformPrefix ? 'support3d' : 'notSupport3d';
        };

        var calculateOffsetScreens = function() {
            offsetScreens = [];
            $self.$screens.each(function() {
                offsetScreens.push($(this).offset().top);
            });
        };

        var determineCurrentScreen = function(centerWindow) {
            nearValue = 100000;
            nearScreen = 0;

            $.each(offsetScreens, function(i, val) {
                if(Math.abs(centerWindow - val) < nearValue) {
                    nearValue = centerWindow - val;
                    nearScreen = i;
                }
            });
            return nearScreen;
        };

        var checkPositionWindow = function() {
            if(!animateNow) {
                nearScreen = determineCurrentScreen($win.scrollTop());
                if (nearScreen !== $self.currentScreen) {
                    $self.currentScreen = nearScreen;
                    options.changeScreen(nearScreen);
                }
            }
        };

	    move['3d'] = function(index) {
			options.beforeMove(index);
			$self.css(transformPrefix, 'translate3d(0, ' + index * -100 +'%, 0)');
		};
	    
	    move['top'] = function(index) {
			options.beforeMove(index);
			$self.stop(true, true);
	    	$self.animate({top: index * -100 + '%'}, $self.animationSpeed, function() {
	    		options.afterMove(index);
	    	});
		};

		move['toScreen'] = function(index) {
            options.beforeMove(index);
            animateNow = true;
            $htmlbody.stop(true, true);
            $htmlbody.animate({scrollTop: offsetScreens[$self.currentScreen]}, $self.animationSpeed, function() {
                options.afterMove(index);
                animateNow = false;
            });
		};

		runScrolling[options.screenPageClass] = {};
		runScrolling[options.screenPageClass]['support3d'] 		= move['3d'];
		runScrolling[options.screenPageClass]['notSupport3d'] 	= move['top'];

		runScrolling[options.solidPageClass] = {};
		runScrolling[options.solidPageClass]['support3d'] 		= move['toScreen'];
		runScrolling[options.solidPageClass]['notSupport3d'] 	= move['toScreen'];

	    onMod[options.screenPageClass] = function() {
	    	$html.addClass(options.screenPageClass);
    		$html.removeClass(options.solidPageClass);

    		removeBinds();
    		addBind[mod]();
            moveTo($self.currentScreen);
	    };

	    onMod[options.solidPageClass] = function() {
	    	$html.addClass(options.solidPageClass);
    		$html.removeClass(options.screenPageClass);

            calculateOffsetScreens();
            removeBinds();
    		addBind[mod]();
            moveTo($self.currentScreen);
	    };

	    addBind[options.screenPageClass] = function() {
	    	console.log('Добавляем бинды для ', options.screenPageClass);
	    };

	    addBind[options.solidPageClass] = function() {
            $win.on('scroll.roller', function() {
                checkPositionWindow();
            });
	    };

      	init.call(this);

      	return this;	
  	};
}(jQuery));