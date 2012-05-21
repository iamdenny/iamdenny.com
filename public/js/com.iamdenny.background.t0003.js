com.iamdenny.background.t0003 = jindo.$Class({
	_sName : 'Template 0003 - Slamdunk Ver.',
	_welBody : null,
	_welWrap : null,
	_sImageUrl : null,
	_bAllImagesLoaded : null,
	_nCurrentImageIndex : null,
    _oTimer : null,
    _woTransition : null,
    _nPlusSize : null,
	
	$init : function(welBody, welWrap){
		this._welBody = welWrap;
		this._welWrap = welWrap;
		this._sImageUrl = "../images/slamdunk/t0003/";
		this._nMaxImageCount = 21;
        this._nPlusSize = 50;
        
		this._oTimer = new jindo.Timer();  
        this._woTransition = new jindo.Transition();
        
		this._initImages();		
	},

    startAnimation : function(){
        var self = this
        if(this._splash()){
            this._oTimer.start(function() {
        		self._showImage();
                var nXStart = self.getRandom(48, 52),
                    nXEnd = self.getRandom(45, 55),
                    nYStart = self.getRandom(48, 52),
                    nYEnd = self.getRandom(45, 55),
                    nSStart = self.getRandom(100, 120),
                    nSEnd = self.getRandom(100, 120);
                self._woTransition.fps(30).abort().start(3000, self._welBody.$value(), {
                    '@opacity' : [0.6, 1],
                    '@backgroundPositionX' : [nXStart + '%', nXEnd + '%'],
                    '@backgroundPositionY' : [nYStart + '%', nYEnd + '%'],
                    '@backgroundSize' : [nSStart + '%', nSEnd + '%']
                });
    			return true;
    		}, 3000);  	
        }
    },
    
    stopAnimation : function(){
        this._oTimer.stop();  
    },
	
	resizeWindow : function(){
        var htWindowSize = this.getWindowSize();
		var htOption = {};
		htOption.backgroundSize = this._getBackgroundSize(this._aoImage[this._nCurrentImageIndex], htWindowSize);
		this._welBody.css(htOption);
	},	
	
	_initImages : function(){
		var self = this,
			nImageLoaded = 0;
		this._aoImage = new Array();
		this._bAllImagesLoaded = false;
		for(var i=0; i<this._nMaxImageCount; i++){
			this._aoImage[i] = new Image();
			this._aoImage[i].src = this._sImageUrl + (i+1) + '.jpg';
			this._aoImage[i].onload = function(eEvent){
				nImageLoaded += 1;
				if(nImageLoaded == self._nMaxImageCount){
					self._bAllImagesLoaded = true;
				}
			}
		}
	},
	
	_splash : function(){
		var bReady = false;
		if(this._bAllImagesLoaded){
			this.closeLoadingImage();
			bReady = true;
		}else{
			var self = this;
			this.showLoadingImage();
			var oTimer = new jindo.Timer();  
			oTimer.start(function() {
				self.startAnimation();
			}, 300);  
		}
		return bReady;
	},
	
	_showImage : function(){
        var htWindowSize = this.getWindowSize();
		this._nCurrentImageIndex = this._getNextImageIndex();
		var nCurrentImageIndex = this._nCurrentImageIndex;			
		var htOption = {
			background : 'url('+this._sImageUrl + nCurrentImageIndex +'.jpg) 50% 50% no-repeat',
			backgroundSize : '100% 100%',
			width : '100%',
			height : '100%'
		};

		htOption.backgroundSize = this._getBackgroundSize(this._aoImage[nCurrentImageIndex], htWindowSize);
		this._welBody.css(htOption);
	},
	
	_getBackgroundSize : function(aoImage, htWindowSize){
		var htScaledImageWidth, htScaledImageHeight;
		
		var fImageSizeRatio = aoImage.width / aoImage.height;
		var fWindowSizeRatio = htWindowSize.width / htWindowSize.height;
		
		//console.log('fImageSizeRatio : ' + fImageSizeRatio + ', fWindowSizeRatio : ' + fWindowSizeRatio)
		if(fImageSizeRatio > fWindowSizeRatio){		
			htScaledImageWidth = (htWindowSize.height + this._nPlusSize) * fImageSizeRatio;
			htScaledImageHeight = (htWindowSize.height + this._nPlusSize);
		}else{
			htScaledImageWidth = (htWindowSize.width + this._nPlusSize);
			htScaledImageHeight = (htWindowSize.width + this._nPlusSize) / fImageSizeRatio;
		}		
		return htScaledImageWidth  + 'px ' + htScaledImageHeight + 'px';
	},
	
	_getNextImageIndex : function(){
		// num = Math.random()  // num is random, from 0 to 1 
		// If you need random floating-point numbers in the range from A to B (A<B), use this code:
		// num = A + (B-A)*Math.random()  // num is random, from A to B 
		// For a random integer in the range from M to N (where M and N are two integers, M<N) use:
		// num = Math.floor(M + (1+N-M)*Math.random())  // num is random integer from M to N
		var nMax = this._nMaxImageCount,
			nMin = 1,
			nNextImageIndex = Math.floor(nMax + (1+nMin-nMax)*Math.random()); 
		return nNextImageIndex;
	}
	
}).extend(com.iamdenny.background.abstract);