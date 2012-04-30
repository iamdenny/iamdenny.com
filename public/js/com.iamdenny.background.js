com.iamdenny.background = jindo.$Class({
	_woTemplate : null,
	_welBody : null,
	_welWrap : null,
	_welTemplateName : null,
	_aTemplate : null,
	
	$init : function(){
		var self = this;
		
		this._aTemplate = ['t0001', 't0002'];
		this._welBody = jindo.$Element('body');
		this._welWrap = jindo.$Element('wrap');
		
		var sRandomTemplate = this._getRandomTemplate();

		jindo.LazyLoading.load('/js/com.iamdenny.background.'+sRandomTemplate+'.js', function(){
			self._woTemplate = new com.iamdenny.background[sRandomTemplate](self._welBody, self._welWrap);
			self._woTemplate.show(self.getWindowSize());
			self._woTemplate.startAnimation();
			self._welTemplateName.text(self._woTemplate.getName());
			self._hideTemplateName();
			
			jindo.$Fn(function(){
				self._woTemplate.resizeWindow(self.getWindowSize());
			}).attach(window, 'resize');
		});
		
		this._prepareMarkup();
	},
	
	_prepareMarkup : function(){
		this._welBody.appendHTML('<div id="_template_name" style="position:absolute;left:10px;top:10px; font-size:1.2em; border:1px solid #000; background:skyblue; padding:10px;border-radius: 2em 1em 4em / 0.5em 3em;">Loading...</div>');
		this._welTemplateName = jindo.$Element("_template_name");
	},
	
	_hideTemplateName : function(){
		var woTransition = new jindo.Transition();  
		woTransition.start(2000, this._welTemplateName.$value(), {'@opacity' : 100}).start(1000, this._welTemplateName.$value(), {'@opacity' : 0}); 
	},
	
	_getRandomTemplate : function(){
		return this._aTemplate[Math.floor(Math.random() * this._aTemplate.length)];
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

