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
		
		this._woTransition = new jindo.Transition();
	},
	
	show : function(htWindowSize){
		// console.log(htWindowSize.width + " :: " + htWindowSize.height);
		var htOption = {
			background:'url('+this._sImageUrl+'2.png) 50% 0 no-repeat',
			backgroundSize : '100% 100%',
			width: '100%',
			height: '100%',
			backgroundColor: '#fff'
		};
		
		this._htScaledImageSize.width = htWindowSize.height * this._fImageSizeRatio;
		this._htScaledImageSize.height = htWindowSize.height;
		// console.log(nWidthScale + " vs " + nHeightScale);
		htOption.backgroundSize = this._htScaledImageSize.width  + 'px ' + this._htScaledImageSize.height + 'px';
		this._htWindowSize = htWindowSize;
		this._fBackgroundPositionMaxGapX = this._htWindowSize.width / 20; // px
		
		this._nCenterX = (this._htWindowSize.width / 2) - (this._htScaledImageSize.width / 2);
		this._nStartX = this._nCenterX - this._fBackgroundPositionMaxGapX;
		this._nEndX = this._nCenterX + this._fBackgroundPositionMaxGapX;
		
		this._welBody.css(htOption);
		
		htOption.background = 'url('+this._sImageUrl+'1.png) 50% 0 no-repeat';
		htOption.backgroundColor = 'none';
		
		this._welWrap.css(htOption);
	},
	
	startAnimation : function(){
		var self = this;

		this._woTransition.fps(30).abort().start(2000, 
			this._welBody.$value(), {
				'@backgroundPositionX' : jindo.Effect.cubicEaseInOut(this._nStartX+'px', this._nEndX+'px')
			},
			this._welWrap.$value(), {
				'@backgroundPositionX' : jindo.Effect.easeOutQuad(this._nStartX+'px', this._nEndX+'px')
			}
		);
		
		this._woTransition.attach("end", function() { 
			var nTemp;
			// console.log(Math.round(self._nEndX) + " :: " + Math.round(self._welBody.css('backgroundPositionX').replace('px','')))
			if(Math.round(self._nEndX) == Math.round(self._welBody.css('backgroundPositionX').replace('px',''))){
					nTemp = self._nEndX;
				self._nEndX = self._nStartX;
				self._nStartX = nTemp;
				// console.log('changed')
			}
			self._woTransition.start(2000, 
				self._welBody.$value(), {
					'@backgroundPositionX' : jindo.Effect.cubicEaseInOut(self._nStartX+'px', self._nEndX+'px')
				},
				self._welWrap.$value(), {
					'@backgroundPositionX' : jindo.Effect.easeOutQuad(self._nStartX+'px', self._nEndX+'px')
				}
			);
		});
		
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
}).extend(com.iamdenny.background.abstract);