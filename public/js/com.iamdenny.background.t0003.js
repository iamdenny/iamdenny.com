com.iamdenny.background.t0003 = jindo.$Class({
	_sName : 'Template 0003 - Slamdunk Ver.',
	_welBody : null,
	_welWrap : null,
	_sImageUrl : null,
	_bAllImagesLoaded : null,
	_nCurrentImageIndex : null,
	
	$init : function(welBody, welWrap){
		this._welBody = welBody;
		this._welWrap = welWrap;
		this._sImageUrl = "../images/slamdunk/t0003/";
		this._nMaxImageCount = 21;
		
		this._initImages();		
	},

	show : function(htWindowSize){
		var self = this;
		if(this._splash(htWindowSize)){
			this._showImage(htWindowSize);
			
			var oTimer = new jindo.Timer();  
			oTimer.start(function() {
				self._showImage(htWindowSize);
				return true;
			}, 3000);  			
		}
	},
	
	resizeWindow : function(htWindowSize){
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
	
	_splash : function(htWindowSize){
		var bReady = false;
		if(this._bAllImagesLoaded){
			this.closeLoadingImage();
			bReady = true;
		}else{
			var self = this;
			this.showLoadingImage();
			var oTimer = new jindo.Timer();  
			oTimer.start(function() {
				self.show(htWindowSize);
			}, 500);  
		}
		return bReady;
	},
	
	_showImage : function(htWindowSize){
		this._nCurrentImageIndex = this._getNextImageIndex();
		var nCurrentImageIndex = this._nCurrentImageIndex;			
		var htOption = {
			background:'url('+this._sImageUrl + nCurrentImageIndex +'.jpg) 50% 50% no-repeat',
			backgroundSize : '100% 100%',
			width: '100%',
			height: '100%'
		};

		htOption.backgroundSize = this._getBackgroundSize(this._aoImage[nCurrentImageIndex], htWindowSize);
		this._welBody.css(htOption);
	},
	
	_getBackgroundSize : function(aoImage, htWindowSize){
		var htScaledImageWidth, htScaledImageHeight;
		
		var fImageSizeRatio = aoImage.width / aoImage.height;
		var fWindowSizeRatio = htWindowSize.width / htWindowSize.height;
		
		console.log('fImageSizeRatio : ' + fImageSizeRatio + ', fWindowSizeRatio : ' + fWindowSizeRatio)
		if(fImageSizeRatio > fWindowSizeRatio){		
			htScaledImageWidth = htWindowSize.height * fImageSizeRatio;
			htScaledImageHeight = htWindowSize.height;
		}else{
			htScaledImageWidth = htWindowSize.width;
			htScaledImageHeight = htWindowSize.width / fImageSizeRatio;
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