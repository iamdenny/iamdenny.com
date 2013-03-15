com.iamdenny.links = jindo.$Class({
    
    _welWrap : null,
    _aLink : null,
    
    $init : function(sWrap){
        this._welWrap = jindo.$Element(sWrap);
        
        this._initLinks();
    },
    
    _initLinks : function(){
        this._aLink = new Array();
        this._aLink['Blog'] = 'http://goo.gl/tHghg';
        this._aLink['GitHub'] = 'http://goo.gl/yXnyl';
        this._aLink['Prezi'] = 'http://goo.gl/eqh7L';
        this._aLink['LinkedIn'] = 'http://goo.gl/nzUAJ';
        this._aLink['LinkedIn English'] = 'http://goo.gl/DOF6g';
        this._aLink['Facebook'] = 'http://goo.gl/t87Fy';
        this._aLink['Google+'] = 'http://goo.gl/Atc8U';
        this._aLink['Twitter'] = 'http://goo.gl/TMWBe';
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
