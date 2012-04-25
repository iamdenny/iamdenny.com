com.iamdenny.background.t0001 = jindo.$Class({
	
	_welWrap : null,
	_sImageUrl : null,
	_htImageSize : null,
	_fImageSizeRatio : null,
	
	$init : function(welWrap){
		this._welWrap = welWrap;
		this._sImageUrl = "../images/slamdunk/t0001/";
		this._htImageSize = {width : 353,height : 347};
		this._fImageSizeRatio = this._htImageSize.width / this._htImageSize.height;
			
		this._prepareMarkup();	 
	},
	
	_prepareMarkup : function(){
		
	},
	
	show : function(htWindowSize){
		// console.log(htWindowSize.width + " :: " + htWindowSize.height);
		var htOption = {
			background:'url('+this._sImageUrl+'1.png) 50% 0 no-repeat',
			'background-size' : '100% 100%',
			width: '100%',
			height: '100%'
		};
		
		var nWidthScale, nHeightScale;
		nWidthScale = htWindowSize.height * this._fImageSizeRatio;
		nHeightScale = htWindowSize.height;
		// console.log(nWidthScale + " vs " + nHeightScale);
		htOption['backgroundSize'] = nWidthScale + 'px ' + nHeightScale + 'px';
		this._welWrap.css(htOption);
	},
});