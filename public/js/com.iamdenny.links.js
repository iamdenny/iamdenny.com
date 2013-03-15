com.iamdenny.links = jindo.$Class({
    
    _welWrap : null,
    _aLink : null,
    
    $init : function(sWrap){
        this._welWrap = jindo.$Element(sWrap);
        
        this._initLinks();
    },
    
    _initLinks : function(){
        this._aLink = new Array();
        this._aLink['Blog'] = 'http://blog.iamdenny.com';
        this._aLink['GitHub'] = 'http://github.com/iamdenny';
        this._aLink['Prezi'] = 'http://prezi.com/user/maphjiiji4ea/';
        this._aLink['LinkedIn'] = 'http://goo.gl/nzUAJ';
        this._aLink['Facebook'] = 'http://www.facebook.com/iamdenny';
        this._aLink['Twitter'] = 'https://twitter.com/webjjin';
    },
    
    showLinks : function(){
        var aLink = this._aLink;
        var el = jindo.$('<div style="position:absolute;left:30px;bottom:20px;"></div>');
        var wel = jindo.$Element(el);
        this._welWrap.append(el);
        for(var key in aLink){
            var elInner = jindo.$('<a href="'+aLink[key]+'" class="link" target="_blank" style="">'+key+'</a>');
            wel.append(elInner);            
        }
        $('.link').button();
    }
});
