com.iamdenny.background = jindo.$Class({
	_woTemplate : null,
	
	$init : function(){
		var self = this;
		var sRandomTemplate = this._getRandomTemplate();
		var welBody = jindo.$Element('body');
		var welWrap = jindo.$Element('wrap');

		jindo.LazyLoading.load('/js/com.iamdenny.background.'+sRandomTemplate+'.js', function(){
			self._woTemplate = new com.iamdenny.background[sRandomTemplate](welBody);
			self._woTemplate.show(self.getWindowSize());
			
			jindo.$Fn(function(){
				self._woTemplate.show(self.getWindowSize());
			}).attach(window, 'resize');
		});
	},
	
	_getRandomTemplate : function(){
		return 't0001';
	},
	
	getWindowSize : function() {
		var myWidth = 0, myHeight = 0;
		if( typeof( window.innerWidth ) == 'number' ) {
			//Non-IE
		  	myWidth = window.innerWidth;
		    myHeight = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
		    //IE 6+ in 'standards compliant mode'
		    myWidth = document.documentElement.clientWidth;
		    myHeight = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
		    //IE 4 compatible
		    myWidth = document.body.clientWidth;
		    myHeight = document.body.clientHeight;
		}
		return {width : myWidth, height : myHeight};
	},
	
	getScrollXY : function(){
  		var scrOfX = 0, scrOfY = 0;
  		if( typeof( window.pageYOffset ) == 'number' ) {
			//Netscape compliant
		    scrOfY = window.pageYOffset;
		    scrOfX = window.pageXOffset;
		} else if( document.body && ( document.body.scrollLeft || document.body.scrollTop ) ) {
		    //DOM compliant
		    scrOfY = document.body.scrollTop;
		    scrOfX = document.body.scrollLeft;
		} else if( document.documentElement && ( document.documentElement.scrollLeft || document.documentElement.scrollTop ) ) {
		    //IE6 standards compliant mode
		    scrOfY = document.documentElement.scrollTop;
		    scrOfX = document.documentElement.scrollLeft;
		}
		return {x : scrOfX, y : scrOfY };
	}
});

