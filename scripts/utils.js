/************************************************************************************************************
Author: 				Custom Format Group
Version Number: 		1.0.0
Created:            	2015-04-22
Modified:           	2015-04-22

Contains utility functions that will help to detect specific mobile device / OS / browser. Also contains few 
other functions maybe required while developing creative.
************************************************************************************************************/
var ua = navigator.userAgent;
var android2ResizeTimeout;
var _CSSBrowserPrefix = null;
var Utils={
	isMobile : {
	    Android: function() {
	        return  (/android/i).test(ua);
	    },
	    Android2: function() {
	        return  (/android 2/i).test(ua);
	    },
	    Android4: function() {
	        return  (/android 4/i).test(ua);
	    },
	    iOS: function() {
	        return  (/ipod|iphone|ipad/i).test(ua);
	    },
	    iOS6: function() {
	        return  (/(iPhone|iPad|iPod).*OS [6]_/i).test(ua);
	    },
	    iPad: function() {
	        return  (/ipad/i).test(ua);
	    },
	    Windows: function() {
	        return  (/windows phone/i).test(ua);
	    },
	    HTC: function() {
	        return  (/htc/i).test(ua);
	    },
	    any: function() {
	        return (Utils.isMobile.Android() || Utils.isMobile.iOS() || Utils.isMobile.Windows());
	    }
	},
	isBrowser : {
	    Safari:function(){
	    	var isSafari=false;
	    	if ((/safari/i).test(ua) && !(/chrome/i).test(ua)) {
	    		isSafari=true;
	    	}
	    	return isSafari;
	    },
	    Chrome:function(){
	    	return  (/chrome/i).test(ua);
	    },
	    IE:function(){
	    	return  (/msie/i).test(ua);
	    },
	    FireFox:function(){
	    	return  (typeof InstallTrigger !== 'undefined');
	    }
	},
	getViewPort:function(){
		var _height, _width;
        if (!Utils.isMobile.Android2()) {
            _height = window.innerHeight;
            _width = window.innerWidth;
        }
        else {
            var outerHeight = Math.round(window.outerHeight / window.devicePixelRatio);
            _height = Math.min(window.innerHeight, outerHeight);

            var outerWidth = Math.round(window.outerWidth / window.devicePixelRatio);
            _width = Math.min(window.innerWidth, outerWidth);
        }
        return {width:_width,height:_height};
	},
	forceResizeOnAndroid2:function(){
		document.body.style.opacity = 0.99;
		clearTimeout(android2ResizeTimeout);
		android2ResizeTimeout = setTimeout(function() {
			document.body.style.opacity = 1;
			document.body.style.height = window.innerHeight;
			document.body.style.width = window.innerWidth;
		}, 200);
	},
	forceRedraw:function(_div){
		document.body.style.opacity = 0.99;
		clearTimeout(android2ResizeTimeout);
		android2ResizeTimeout = setTimeout(function() {
			document.body.style.opacity = 1;
			document.body.style.height = window.innerHeight;
			document.body.style.width = window.innerWidth;
		}, 200);
	},
	forceResizeOnSafari:function(element){
	  var disp = element.style.display;
	  element.style.display = 'none';
	  var trick = element.offsetHeight;
	  element.style.display = disp;
	},
	calculateAspectRatioFit:function(srcWidth, srcHeight, maxWidth, maxHeight) {

	    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

	    return { width: srcWidth*ratio, height: srcHeight*ratio };
	},
	getStyle: function(elem, styleName)
	{
		if(typeof elem.currentStyle != "undefined")
			return elem.currentStyle[styleName];
		else if(typeof document.defaultView != "undefined" && typeof document.defaultView.getComputedStyle != "undefined")
			return document.defaultView.getComputedStyle(elem, "")[styleName];
		else return elem.style[styleName];
	},
	getComputedStyle: function(elem, property)
	{
		return window.getComputedStyle(elem).getPropertyValue(property);
	},
	setClass:function(e, c){
		var cc = null;
		if(typeof e.className === "undefined"){
			cc = e.getAttribute("class");
			if(cc.indexOf(c) < 0){
				if(c.length > 0){ c = cc + " " + c; }
				e.setAttribute("class", c);
			}
		}else{
			cc = e.className;
			if(cc.indexOf(c) < 0){
				if(c.length > 0){ c = cc + " " + c; }
				e.className = c;
			}
		}
	},
	removeClass:function(e, c){
		var nc = null;
		var reg = new RegExp('(\\s|^)+'+c.replace("-","\\-")+'(\\s|$)+');
		if(typeof e.className === "undefined"){
			nc = e.getAttribute("class").replace( reg , ' ');
			e.setAttribute("class", nc);

		}else{
			e.className = e.className.replace(reg, ' ' );
		}
	},
	detectIE:function() {
    var ua = window.navigator.userAgent;

	    var msie = ua.indexOf('MSIE ');
	    if (msie > 0) {
	        // IE 10 or older => return version number
	        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	    }

	    var trident = ua.indexOf('Trident/');
	    if (trident > 0) {
	        // IE 11 => return version number
	        var rv = ua.indexOf('rv:');
	        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
	    }

	    var edge = ua.indexOf('Edge/');
	    if (edge > 0) {
	       // IE 12 => return version number
	       return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
	    }

	    // other browser
	    return false;
	},
	getCSSBrowserPrefix:function(){
		if(_CSSBrowserPrefix !== null){
			return _CSSBrowserPrefix;
		}
		var t;
		var el = document.createElement('div');
		var prefixes = {
			'WC':'',
			'O':'o',
			'MS':'ms',
			'Moz':'Moz',
			'Webkit':'webkit'
		};
		for(t in prefixes){
			if( el.style[prefixes[t] + "Transition"] !== undefined ){
				_CSSBrowserPrefix = prefixes[t];
				return _CSSBrowserPrefix;
			}
		}
	}
}