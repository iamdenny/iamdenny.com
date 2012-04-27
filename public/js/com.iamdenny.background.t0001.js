com.iamdenny.background.t0001 = jindo.$Class({
	
	_welBody : null,
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
	
	$init : function(welBody){
		this._welBody = welBody;
		this._sImageUrl = "../images/slamdunk/t0001/";
		this._htImageSize = {width : 353,height : 347};
		this._htScaledImageSize = this._htImageSize;
		this._fImageSizeRatio = this._htImageSize.width / this._htImageSize.height;
		this._fBackgroundPositionGapX = parseFloat(0.5); // px
		this._fBackgroundPositionMaxGapX = parseFloat(30); // px
		this._bBackgroundPositionPlusX = true; // try to plus the GapX to PositionX
		
		this._prepareMarkup(); 
		this._welLayer = jindo.$Element("layer");
		this._woFloatingLayer = new jindo.FloatingLayer(this._welLayer); 
	},
	
	_prepareMarkup : function(){
		this._welBody.appendHTML('<div id="layer" style="position:absolute;right:10px;bottom:10px; border:1px solid #000; background:#ddd; padding:10px;border-radius: 2em 1em 4em / 0.5em 3em;">레이어</div>');
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
		
		this._woTransition = new jindo.Transition();
		
		var sEffect = this._getRandomEffect();
		this._welLayer.text(sEffect);
		this._woTransition.fps(30).abort().start(1500, this._welBody.$value(), {
			'@backgroundPositionX' : jindo.Effect[sEffect](this._nStartX+'px', this._nEndX+'px')
		});

		this._woTransition.attach("end", function() { 
			var nTemp;
			// console.log(Math.round(self._nEndX) + " :: " + Math.round(self._welBody.css('backgroundPositionX').replace('px','')))
			if(Math.round(self._nEndX) == Math.round(self._welBody.css('backgroundPositionX').replace('px',''))){
					nTemp = self._nEndX;
				self._nEndX = self._nStartX;
				self._nStartX = nTemp;
				// console.log('changed')
			}
			var sEffect = self._getRandomEffect();
			self._welLayer.text(sEffect);
			self._woTransition.abort().sleep(500).queue(1500, self._welBody.$value(), {
				'@backgroundPositionX' : jindo.Effect[sEffect](self._nStartX+'px', self._nEndX+'px')
			});
		});
		 
	},
	
	stopAnimation : function(){
		this._woTransition.abort();
	},
	
	_getRandomEffect : function(){
		var aEffect = new Array();
		aEffect = ['linear', 'overphase', 'sinusoidal', 'easeInSine', 'easeOutSine', 'easeInOutSine'
			, 'easeOutInSine', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad'
			, 'easeOutInQuad', 'easeIn', 'easeOut', 'easeInOut', 'easeOutIn', 'easeInQuart'
			, 'easeOutQuart', 'easeInOutQuart', 'easeOutInQuart', 'easeInQuint', 'easeOutQuint'
			, 'easeInOutQuint', 'easeOutInQuint', 'easeInExpo', 'easeOutExpo', 'easeInOutExpo'
			, 'easeOutInExpo', 'easeInCircle', 'easeInOutCircle'
			, 'easeInBack', 'easeOutBack', 'easeInOutBack', 'easeInElastic', 'easeOutElastic'
			, 'easeInOutElastic', 'easeInBounce', 'easeOutBounce', 'easeInOutBounce', 'cubicEase'
			, 'cubicEaseIn', 'cubicEaseOut', 'cubicEaseInOut', 'cubicEaseOutIn']
		return aEffect[Math.floor(Math.random() * aEffect.length)];
	},
	
	_getRandomBackgroundPosition : function(){
		// console.log(this._fBackgroundPositionX + " :: " + this._fBackgroundPositionMaxX);
		// if(this._fBackgroundPositionX > this._fBackgroundPositionMaxX){
			// this._bBackgroundPositionPlusX = false; // minus
		// }else if(this._fBackgroundPositionX < this._fBackgroundPositionMinX){
			// this._bBackgroundPositionPlusX = true; // plus
		// }
		// if(this._bBackgroundPositionPlusX){
			// this._fBackgroundPositionX += this._fBackgroundPositionGapX; 
		// }else{
			// this._fBackgroundPositionX -= this._fBackgroundPositionGapX;
		// }
		// return this._fBackgroundPositionX + '% 0';
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