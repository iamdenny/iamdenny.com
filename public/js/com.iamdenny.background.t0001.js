com.iamdenny.background.t0001 = jindo.$Class({
	
	_welWrap : null,
	_sImageUrl : null,
	_htImageSize : null,
	_fImageSizeRatio : null,
	_nInterval : null,
	_nFps : null,
	_fBackgroundPositionX : null,
	_fBackgroundPositionMinX : null,
	_fBackgroundPositionMaxX : null,
	_fBackgroundPositionGapX : null,
	_bBackgroundPositionPlusX : null,
	
	$init : function(welWrap){
		this._welWrap = welWrap;
		this._sImageUrl = "../images/slamdunk/t0001/";
		this._htImageSize = {width : 353,height : 347};
		this._fImageSizeRatio = this._htImageSize.width / this._htImageSize.height;
		this._nFps = 1000/100; // frames per second.
		this._fBackgroundPositionX = parseFloat(50); // 55%
		this._fBackgroundPositionMinX = parseFloat(45); // 45%
		this._fBackgroundPositionMaxX = parseFloat(55); // 55%
		this._fBackgroundPositionGapX = parseFloat(0.001); // 0.01%
		this._bBackgroundPositionPlusX = true; // try to plus the GapX to PositionX 
	},
	
	show : function(htWindowSize){
		// console.log(htWindowSize.width + " :: " + htWindowSize.height);
		var htOption = {
			background:'url('+this._sImageUrl+'1.png) 50% 0 no-repeat',
			backgroundSize : '100% 100%',
			width: '100%',
			height: '100%'
		};
		
		var nWidthScale, nHeightScale;
		nWidthScale = htWindowSize.height * this._fImageSizeRatio;
		nHeightScale = htWindowSize.height;
		// console.log(nWidthScale + " vs " + nHeightScale);
		htOption.backgroundSize = nWidthScale + 'px ' + nHeightScale + 'px';
		this._welWrap.css(htOption);
	},
	
	resizeWindow : function(htWindowSize){
		this.show(htWindowSize);
	},
	
	startAnimation : function(){
		var self = this;
		this._nInterval = setInterval(function(){
			self._welWrap.css({backgroundPosition : self._getRandomBackgroundPosition()})
		}, this._nFps);
	},
	
	stopAnimation : function(){
		clearInterval(this._nInterval);
	},
	
	_getRandomBackgroundPosition : function(){
		console.log(this._fBackgroundPositionX + " :: " + this._fBackgroundPositionMaxX);
		if(this._fBackgroundPositionX > this._fBackgroundPositionMaxX){
			this._bBackgroundPositionPlusX = false; // minus
		}else if(this._fBackgroundPositionX < this._fBackgroundPositionMinX){
			this._bBackgroundPositionPlusX = true; // plus
		}
		if(this._bBackgroundPositionPlusX){
			this._fBackgroundPositionX += this._fBackgroundPositionGapX; 
		}else{
			this._fBackgroundPositionX -= this._fBackgroundPositionGapX;
		}
		return this._fBackgroundPositionX + '% 0';
	}
});