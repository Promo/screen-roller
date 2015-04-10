(function($){

	$.fn.roller = function(options) {

		var $self = this,
			$win = $(window),
			$html = $('html'),
			$htmlbody = $('html, body'),
			addBind = {},
			onMod = {},
			runScrolling ={},
			move = {},
			mod,
			nextIndexScreen,
			transform3d,
			transformPrefix,

			oldValue;

      	var options = $.extend({
      		'baseClass': 'roller',
	      	'screenClass'      : 'screen',
	      	'screenPageClass': 'screen-page',
	      	'solidPageClass': 'solid-page',
			'minHeight' : 500,
			'minWidth': 500,
			'animationSpeed': 500,
			'observer': $win,
			'beforeMove': function(){},
			'afterMove': function(){},

	    }, options);



      	var init = function() {
	    	console.log(options.screenClass);
	    	this.$screens = this.find('.' + options.screenClass);
	    	this.countScreens = this.$screens.size();
	    	this.currentScreen = 0;
			this.addClass(options.baseClass);
			this.animationSpeed = options.animationSpeed,
			this.moveTo = moveTo;

			addCommonBind();
			determineMod();
			checkSupport3d();
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
	    }

	    var moveTo = function(direction) {
	    	if(typeof direction  === 'string') {
	    		direction === 'up' ? nextIndexScreen = $self.currentScreen - 1 : nextIndexScreen = $self.currentScreen + 1;
	    	}

	    	if(typeof direction === 'number') {
	    		nextIndexScreen = direction;
	    	}

	    	if( (nextIndexScreen < 0) ||
	    		(nextIndexScreen > $self.countScreens - 1) ||
	    		(nextIndexScreen === $self.currentScreen) ||
	    		(typeof nextIndexScreen !== 'number') ) {
	    		return;
	    	}

	    	$self.currentScreen = nextIndexScreen;
	    	runScrolling[mod][transform3d](nextIndexScreen)
	    }

		
	    var checkSupport3d = function() {
	        $.each([ '-webkit-transform', '-o-transform',  '-ms-transform', '-moz-transform', 'transform' ], function(i, val) {
	        	if($self.css(val)) {
	        		if($self.css(val).match(/matrix3d/)) {
	        			transformPrefix = val; 
	        			return
	        		} else {
	        			oldValue = $self.css(val);
	        			$self.css(val, 'translate3d(0px, 0px, 1px)');
		        		$self.css(val) && $self.css(val).match(/matrix3d/) ? transformPrefix = val : '';
			        	$self.css(val, oldValue);
	        		}
	        	}
	        });

	        transformPrefix ? transform3d = 'support3d' : transform3d = 'notSupport3d'
	    }

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
			console.log('двигаем к скрину')
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
	    }

	    onMod[options.solidPageClass] = function() {
	    	$html.addClass(options.solidPageClass);
    		$html.removeClass(options.screenPageClass);

    		removeBinds();
    		addBind[mod]();
	    }

	    addBind[options.screenPageClass] = function() {
	    	console.log('Добавляем бинды для ', options.screenPageClass);
	    }

	    addBind[options.solidPageClass] = function() {
	    	console.log('Добавляем бинды для ', options.solidPageClass)	
	    }


      	init.call(this);

      	return this;	
  	};



  	console.log($.fn.roller);

}(jQuery));