com.iamdenny.background.abstract = jindo.$Class({
	_sName : 'Untitled Template.',
	_oLoadingImage : null,
	
	getName : function(){
		return this._sName;
	},
	
	show : function(htWindowSize){},
	
	startAnimation : function(){},
	
	stopAnimation : function(){},
	
	resizeWindow : function(htWindowSize){},
	
	showLoadingImage : function(){
		if(!this._oLoadingImage){
			this._oLoadingImage = new jindo.ModalDialog({
				sClassPrefix : 'loadingimage-',
				Foggy : { //Foggy 컴포넌트를 위한 옵션 (jindo.Foggy 참고)
					nShowDuration : 150, //(Number) fog 레이어가 완전히 나타나기까지의 시간 (ms)  
					nShowOpacity : 0.8, //(Number) fog 레이어가 보여질 때의 transition 효과와 투명도 (0~1사이의 값)      
					nHideDuration : 150, //(Number) fog 레이어가 완전히 사라지기까지의 시간 (ms)  
					nHideOpacity : 0, //(Number) fog 레이어가 숨겨질 때의 transition 효과와 투명도 (0~1사이의 값)
					sEffect : "linear", // (String) jindo.Effect의 종류  
					nFPS : 30 //(Number) 효과가 재생될 초당 frame rate  
				}
			}).attach({
				beforeShow : function(e) {
					//console.log(e.type)
					//다이얼로그 레이어가 보여지기 전에 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//e.stop(); 수행시 보여지지 않음
				},
				show : function(e) {
					//console.log(e.type)
					//다이얼로그 레이어가 보여진 후 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				},
				beforeHide : function(e) {
					//console.log(e.type)
					//다이얼로그 레이어가 숨겨지기 전에 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
					//e.stop(); 수행시 숨겨지지 않음
				},
				hide : function(e) {
					//console.log(e.type)
					//다이얼로그 레이어가 숨겨진 후 발생
					//전달되는 이벤트 객체 e = {
					//	elLayer (HTMLElement) 다이얼로그 레이어
					//}
				}
			});
			var sLayerHTML = '<div><img src="./images/loadingimage.gif" alt="loading" /></div>';  
			this._oLoadingImage.setLayerTemplate(sLayerHTML);
		}
		this._oLoadingImage.show({ text : "확인, 취소, 닫기 버튼을 클릭하기 전까지 다이얼로그 외부가 가려집니다." }, {
			close : function(e) {
				//console.log(e);
			},
			cancel : function(e) {
				//console.log(e);
			},
			confirm : function(e) {
				//console.log(e);
			}
		});
	},
	
	closeLoadingImage : function(){
		if(this._oLoadingImage){
			this._oLoadingImage.hide();
		} 
	},
	
	resizeWindow : function(htWindowSize){
		this.show(htWindowSize);
	}
});
