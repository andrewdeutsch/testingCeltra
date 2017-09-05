(function() {
	"use strict";

	//Variable Declaration
	var uid;
	var	container,
		closeButtonLandscape,
		closePortrait,
		panel,
		panelCreative,
		headerSection,
		panelContainer,
		clicktThrough,
		panelContainerRatio,
		panelCurrentDimension,
		elemToResizeOnOrientation,
		screenOrientation,
		lightbox,
		logoContainer,
		animationEndEvent,
		isAutoExpand = false,
		closeContainer,
			isAutoCollapse = true;


	window.addEventListener("load", checkIfEBInitialized);
	window.addEventListener("message", onMessageReceived);
	window.addEventListener("resize", onPageResize);

	function checkIfEBInitialized(event)
	{
		if (EB.isInitialized())
		{
			initializeCreative();
		}
		else {
			EB.addEventListener(EBG.EventName.EB_INITIALIZED, initializeCreative);
		}
	}
	
	function initializeCreative(event)
	{
		initCustomVars();
		initializeGlobalVariables();
		addEventListeners();
		if(mdShouldAutoExpand)
		{
			autoExpand();
		}else{
			expand();
		}
	}
	
	function initializeGlobalVariables()
	{

		uid 					= getuid();
		container 				= document.getElementById("container");
		panel 					= document.getElementById("panel");
		headerSection			= document.getElementById("header-section");
		panelCreative			= document.getElementById("panel-creative");
		panelContainer			= document.getElementById("panel-container");
		closeButtonLandscape 	= document.getElementById("close-button-landscape");
		closePortrait			= document.getElementById("close-button-portrait");
		lightbox				= document.getElementById("panel-lightbox");
		closeContainer 			= document.getElementById('close-container');
		logoContainer			= document.getElementById('logo-container');


		//This variable hold reference to the elements that going to effect when Ad shift between portrait or landscape mode. 
		elemToResizeOnOrientation = [{elemRef:logoContainer}];

		
		for (var i = 0; i < elemToResizeOnOrientation.length; i++) 
		{
			var elem = elemToResizeOnOrientation[i];
				elem.originalClasses = elem.elemRef.className;
		};


		panelContainerRatio = { maxHeight:parseFloat(Utils.getComputedStyle(panelContainer,'max-height'),10),
				   			    maxWidth:parseFloat(Utils.getComputedStyle(panelContainer,'max-width'),10)};

		animationEndEvent = (Utils.getCSSBrowserPrefix() == "webkit")?"webkitAnimationEnd":"animationend";
	}
	

	function initCustomVars() 
	{
		setCustomVar("mdCropVideo", true);
		setCustomVar("mdisIE9", false);
		setCustomVar("mdShouldAutoExpand", false);
		setCustomVar("mdCoppa", false);				//are we running in COPPA mode ? (default = false)
		setCustomVar("mdDefaultPanel", 'panel1');
		setCustomVar("mdEnableExpandCollapseAnim", true);	
	}

	function addEventListeners()
	{
		closeButtonLandscape.addEventListener("click", onCloseClick);
		closePortrait.addEventListener("click", onCloseClick);
	}

	function expand()
	{
		panel.style.display = 'block';
		var closeLandscapeRef 	   = document.getElementById('close-landscape');
		var panelCreativeContainer = document.getElementById('panel-creative-container');

		var lightboxColor = mdCoppa ? 'lightbox-coppa' : 'lightbox-noncoppa';
			Utils.setClass(lightbox,lightboxColor);

		var closeContainerClass = mdCoppa ? 'close-container-COPPA' : 'close-container-NonCOPPA';
			Utils.setClass(closeLandscapeRef,closeContainerClass);


		var panelContainerClass = mdCoppa ? 'panel-container-COPPA' : 'panel-container-NonCOPPA';
			Utils.setClass(panelCreativeContainer,panelContainerClass);
		

		onPageResize();
		if(mdEnableExpandCollapseAnim)
		{
			drawExpansion();
		}else{
			expanded();
		}
	}

	function onCloseClick(event)
	{
		isAutoCollapse = false;
		collapse()
	}

	function onClickThrough(event) { EB.clickthrough(); }

	
	function autoExpand()
	{
		panel.style.display = 'block';
		container.className = "expanded";
		isAutoExpand 		= true;
		expand();

	}

	function drawExpansion()
	{
		panelContainer.addEventListener(animationEndEvent, animationComplete);
		Utils.setClass(panelContainer,'expand-animation');
		if(mdisIE9) 
		{	
			setTimeout(expanded,100);
		}
	}

	function animationComplete()
	{
		panelContainer.removeEventListener(animationEndEvent, animationComplete);
		Utils.removeClass(panelContainer,'expand-animation');
		expanded();
	}

	function expanded() 
	{
		setOrientation();
	}

	function collapse()
	{
		if(mdEnableExpandCollapseAnim)
		{
			panelContainer.addEventListener(animationEndEvent, collapsed);
			Utils.setClass(panelContainer,'collapse-animation');
			if(mdisIE9) 
			{
				setTimeout(collapsed,100);
			}
		}else{
			if(mdisIE9) 
			{
				setTimeout(collapsed,100);
			}else{
				collapsed();
			}
		}
	}

	function drawCollapse()
	{
		panel.style.display = "none";
		Utils.removeClass(panelContainer,'collapse-animation');
		panelContainer.removeEventListener(animationEndEvent, collapsed);
	}

	function collapsed() 
	{
		drawCollapse();
		var actionType =  EBG.ActionType.AUTO;
		if(!isAutoCollapse)
		{
			actionType =  EBG.ActionType.USER;
		}
		EB.collapse({
			panelName: mdDefaultPanel,
			actionType: actionType
		});
	}

	function onPageResize()
	{
		setOrientation();
		setTimeout(setOrientation,100);
	}

	function setOrientation()
	{
		var vp;
		try{
			vp = Utils.getViewPort();
		}catch(e){
			return;
		}
		screenOrientation = vp.height >= (vp.width) ? "portrait" : "landscape";

		
		if(screenOrientation == "portrait")
		{
			panelCurrentDimension = {width:panelContainerRatio.maxHeight,height:panelContainerRatio.maxWidth};
		}else{
			panelCurrentDimension = {width:panelContainerRatio.maxWidth,height:panelContainerRatio.maxHeight};
		}
		panelContainer.style.maxHeight =	panelCurrentDimension.height+'px';
		panelContainer.style.maxWidth  =	panelCurrentDimension.width+'px';
		resizeContainer();
	}

	function resizeContainer()
	{
		var viewport 	= Utils.getViewPort(); 
        var panelWidth 	= panelCurrentDimension.width;
        var panelHeight	= panelCurrentDimension.height;
        var rval 		= Utils.calculateAspectRatioFit(panelWidth,panelHeight,viewport.width,viewport.height);
        panelContainer.style.width  = (rval.width)+'px';
        panelContainer.style.height = (rval.height)+'px';
        panelCreative.style.height 	= (panelContainer.offsetHeight - headerSection.offsetHeight-4)+'px';
		updateElemClass();
		setHeaderBar();
	}
	
	function setHeaderBar()
	{
		var portraitRef  = document.getElementById('close-portrait');
		var landscapeRef = document.getElementById('close-landscape');
		var isCloseContainerDisplay = Utils.getComputedStyle(closeContainer,'display');


		if(screenOrientation == "portrait")
		{
			portraitRef.style.display  = 'block';
			landscapeRef.style.display = 'none';
		}else{
			landscapeRef.style.display = 'block';
			portraitRef.style.display  = 'none';
			
			var panelCreativeContainer = document.getElementById('panel-creative-container');
			var headerWidth    = closeContainer.offsetWidth;
			if(headerWidth > panelCreativeContainer.offsetWidth)
			{
				portraitRef.style.display  = 'block';
				landscapeRef.style.display = 'none';
			}else{
				landscapeRef.style.display = 'block';
				portraitRef.style.display  = 'none';
			}
		}
		return 
	}


	/*
		Update element class name when Ad goes to portrat or landscape mode.
		It use element ID and append landscape or portrait to create class name.
		For example : If you want to make Gallery that occupy full width in portrait 
		and occupy few percentage lets say 40% in landscape then you need to create 
		Two class name with gallery id + Mode. So two class name will be create as
		gallery_lanscape and gallery_portrait and applyed to gallery container whenever
		respective mode is displayed.
		This will help you to style each element depending or the portrait or landscape mode.
	*/
	function updateElemClass()
	{
		for (var i = 0; i < elemToResizeOnOrientation.length; i++)
		{
			var elem = elemToResizeOnOrientation[i].elemRef;
			if(screenOrientation=="portrait")
			{
				Utils.removeClass(elem,elem.id+'-'+"landscape");
			}else{
				Utils.removeClass(elem,elem.id+'-'+"portrait");
			}
			Utils.setClass(elem,elem.id+'-'+screenOrientation);
		};
	}

	function getuid()
	{
		if (EB._isLocalMode) {	return null;
		} else {				return EB._adConfig.uid;
		}
	}

	function onMessageReceived(event)
	{
		var msg;
		if (typeof event == "object" && event.data) {
			try{
				msg = JSON.parse(event.data);
			}catch(e){
				return;
			}
		}
		else {
			// this is safe frame.
			msg = {
				type: event.type,
				data: event
			};
		}
		if (msg.type && msg.data && (!uid || (msg.data.uid && msg.data.uid == uid))) {
			switch (msg.type) {
				case "resize":
					//panel resize;
				break;
			}
		}
	}
	
	function setCustomVar(customVarName, defaultValue, parseNum) {	//create global var with name = str, taking value from adConfig if it's there, else use default
		var value = defaultValue;
		if(!EB._isLocalMode){
			var value = EB._adConfig.hasOwnProperty(customVarName) ? EB._adConfig[customVarName] : defaultValue;
		}
		if (value === "true") value = true; //PENDING if we really need this check
		if (value === "false") value = false; //PENDING if we really need this check
		if (value === "undefined") value = undefined;
		if (arguments.length == 3 && parseNum && typeof value === "string") value = parseFloat(value);
		window[customVarName] = value;
	}

	function postMessageToParent(message){
		window.parent.postMessage(JSON.stringify(message), "*");
	}
	
	function registerAction(){		//this func is never called, it's parsed by the ad platform on upload of the ad

	}
}());