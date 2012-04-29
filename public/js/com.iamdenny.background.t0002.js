com.iamdenny.background.t0002 = jindo.$Class({
	_sName : 'Template 0002 - Slamdunk Ver.',
	_welBody : null,
	_welWrap : null,
	_sImageUrl : null,
	_htImageSize : null,
	_htScaledImageSize : null,
	_fImageSizeRatio : null,
	_nInterval : null,
	_nFps : null,
	_fBackgroundPositionGapX : null,
	_fBackgroundPositionMaxGapX : null,
	_bBackgroundPositionPlusX : null,
	_htWindowSize : null,
	_woTransition : null,
	
	$init : function(welBody, welWrap){
		this._welBody = welBody;
		this._welWrap = welWrap;
		this._sImageUrl = "../images/slamdunk/t0002/";
		this._htImageSize = {width : 500, height : 375};
		this._htScaledImageSize = this._htImageSize;
		this._fImageSizeRatio = this._htImageSize.width / this._htImageSize.height;
		this._fBackgroundPositionGapX = parseFloat(0.5); // px
		this._fBackgroundPositionMaxGapX = parseFloat(30); // px
		this._bBackgroundPositionPlusX = true; // try to plus the GapX to PositionX
	},
	
	getName : function(){
		return this._sName;
	},
	
	show : function(htWindowSize){
		// console.log(htWindowSize.width + " :: " + htWindowSize.height);
		var htOption = {
			background:'url('+this._sImageUrl+'1.png) 50% 0 no-repeat',
			backgroundSize : '100% 100%',
			width: '100%',
			height: '100%'
		};
		
		this._htScaledImageSize.width = htWindowSize.height * this._fImageSizeRatio;
		this._htScaledImageSize.height = htWindowSize.height;
		// console.log(nWidthScale + " vs " + nHeightScale);
		htOption.backgroundSize = this._htScaledImageSize.width  + 'px ' + this._htScaledImageSize.height + 'px';
		this._htWindowSize = htWindowSize;
		this._fBackgroundPositionMaxGapX = this._htWindowSize.width / 10; // px
		
		this._nCenterX = (this._htWindowSize.width / 2) - (this._htScaledImageSize.width / 2);
		this._nStartX = this._nCenterX - this._fBackgroundPositionMaxGapX;
		this._nEndX = this._nCenterX + this._fBackgroundPositionMaxGapX;
		
		this._welBody.css(htOption);
	},
	
	resizeWindow : function(htWindowSize){
		this.show(htWindowSize);
	},
	
	startAnimation : function(){
		var self = this;
		

		 
	},
	
	stopAnimation : function(){
		this._woTransition.abort();
	},

	_getRandomBackgroundPosition : function(){

		var nCenterX = (this._htWindowSize.width / 2) - (this._htScaledImageSize.width / 2);
		if(this._bBackgroundPositionPlusX){
			this._fBackgroundPositionGapSumX += this._fBackgroundPositionGapX;
			if(this._fBackgroundPositionGapSumX > this._fBackgroundPositionMaxGapX){
				this._bBackgroundPositionPlusX = false;
			}
		}else{
			this._fBackgroundPositionGapSumX -= this._fBackgroundPositionGapX;
			if(Math.abs(this._fBackgroundPositionGapSumX) > this._fBackgroundPositionMaxGapX){
				this._bBackgroundPositionPlusX = true;
			}
		}
		this._fBackgroundPositionX = nCenterX + this._fBackgroundPositionGapSumX;
		return this._fBackgroundPositionX + 'px 0';
	}
});