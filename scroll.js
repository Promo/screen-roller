(function($){

	$.fn.roller = function(options) {

		var $self = this,
			$win = $(window),
			$html = $('html'),
			$htmlbody = $('html, body'),
			addBind = {},
			onMod = {},
			mod,
			nextIndexScreen;

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
			addCommonBind();
			determineMod();

	    	this.moveTo = scrollTo;
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

	    var scrollTo = function(direction) {
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

	    	console.log('run scroll');
	    	$self.currentScreen = nextIndexScreen;
	    	moveTo(nextIndexScreen)
	    }

	    var moveTo = function(indexScreen) {
	    	console.log($self);
	    	options.beforeMove();
	    	$self.animate({top: indexScreen * -100 + '%'}, $self.animationSpeed, function() {
	    		options.afterMove();
	    	});
	    }

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