com.iamdenny.background = jindo.$Class({
	_woTemplate : null,
	
	$init : function(){
		var self = this;
		var sRandomTemplate = this._getRandomTemplate();
		jindo.LazyLoading.load('/js/com.iamdenny.background.'+sRandomTemplate+'.js', function(){
			self._woTemplate = new com.iamdenny.background[sRandomTemplate]();
		});
	},
	
	_getRandomTemplate : function(){
		return 't0001';
	}
});

