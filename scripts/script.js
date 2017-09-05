(function() {
	"use strict";

	var creativeVersion = "1.0.0";  // format versioning code, please do not alter or remove this variable
	var customJSVersion = null; 	// format versioning code, please do not alter or remove this variable

	//Variable Declaration
	var uid;
	var	container,
		banner,
		bannerRollover,
		expandButton;
		
	window.addEventListener("load",    checkIfEBInitialized);
	window.addEventListener("message", onMessageReceived);

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
		EB.initExpansionParams(0, 0, 300, 250);
		initCustomVars();
		initializeGlobalVariables();
		addEventListeners();
		setCreativeVersion(); // format versioning code, please do not alter or remove this function
	}
	
	function initializeGlobalVariables()
	{
		uid 			= getuid();
		container 		= document.getElementById("container");
		banner 			= document.getElementById("banner");
		bannerRollover 	= document.getElementById("banner-rollover");
		expandButton 	= document.getElementById("expand-button");

		if(Utils.isMobile.any())
		{
			expandButton.style.display = 'block';
		}
	}

	function initCustomVars() 
	{
		setCustomVar("mdDefaultPanel", 'panel1');
	}

	function addEventListeners()
	{
		banner.addEventListener("click", handleBannerClick);
		if(!Utils.isMobile.any())
		{
			banner.addEventListener("mouseover", function(){
				bannerRollover.style.display='block';
			});
			banner.addEventListener("mouseout", function(){
				bannerRollover.style.display='none';
			});
		}
	}

	function handleBannerClick(event)
	{
		EB.expand({
			panelName: mdDefaultPanel,
			actionType: EBG.ActionType.USER
		});
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
		if (msg.type) {
			switch (msg.type) {
				case "panelExpanded":
					//panel expanded;
					if(bannerRollover) bannerRollover.style.display='none';
					break;
				case "panelCollapsed": 
					//panel collapsed;
					if(bannerRollover) bannerRollover.style.display='none';
					break;
			}
		}
	}

	function postMessageToParent(message)
	{
		window.parent.postMessage(JSON.stringify(message), "*");
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


	function registerAction()
	{		
		//this func is never called, it's parsed by the ad platform on upload of the ad
	}

	/* format versioning code starts, please do not alter or remove these functions */
	function setCreativeVersion()
	{
	    EB._sendMessage("SET_CREATIVE_VERSION", {
	        creativeVersion: creativeVersion,
	        uid: getuid()
	    });
	    /*if (typeof displayCreativeVersion === "function") {
	        displayCreativeVersion();
	    }*/
	    setCustomJSVersion();
	}

	function setCustomJSVersion()
	{
	    window.addEventListener("message", function(event) {
	        try {
	            var data = JSON.parse(event.data);
	            if (!data.data.hasOwnProperty("uid") || data.data.uid !== getuid()) 
	            {
	                return;
	            }
	            if (data.type === "SET_CUSTOMJS_VERSION")
	            {
	                if (data.data.hasOwnProperty("customJSVersion"))
	                {
	                    customJSVersion = data.data.customJSVersion;
	                    /*if (typeof displayCustomJSVersion === "function") {
	                        displayCustomJSVersion();
	                    }*/
	                }
	            }
	        } catch (error) {}
	    });
	}

	/* format versioning code ends, please do not alter or remove these functions */
}());