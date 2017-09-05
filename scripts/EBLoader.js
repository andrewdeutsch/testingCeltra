//Secure script loading logic that will check if Ad is loaded in secure or insecure enviroment loads additional script with same http / https settings
function loadServingSysScript(relativeUrl)
{
    document.write("<script src='" + (document.location.protocol === "https:" ? "https://secure-" : "http://") + "ds.serving-sys.com/BurstingScript/" + relativeUrl + "'><\/script>");
}

function loadResCustomScript(relativeUrl)
{
    document.write("<script src='" + (document.location.protocol === "https:" ? "https://secure-" : "http://") + "ds.serving-sys.com/BurstingRes/CustomScripts/" + relativeUrl + "'><\/script>");
}

//Load secure or insecure version of EBLoader
loadServingSysScript("EBLoader.js");
