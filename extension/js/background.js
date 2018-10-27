// initialising the chrome storage
let initialiseMainMemory = {
        blockedWebsites:["https://www.defaultsomethingss.com/*"],
        allUrls:[],
        dictionaryWords:[],
        articleListURL:[]
};
function setup() {
    chrome.storage.local.set({'mainMemory': initialiseMainMemory})
}

chrome.runtime.onInstalled.addListener(setup);

var menu1 = {
    id: "meaning",
    title: "Meaning",
    contexts: ["selection"]
};

var menu2 = {
    id: "speak",
    title: "Pronunciation",
    contexts: ["selection"]
};

var menu3 = {
    id: "translation",
    title: "Translate",
    contexts: ["selection"]
}

function fixedEncodeURI (str) {
    return encodeURI(str).replace(/%5B/g, '[').replace(/%5D/g, ']');
}

chrome.contextMenus.create(menu1);
chrome.contextMenus.create(menu2);
chrome.contextMenus.create(menu3);

chrome.contextMenus.onClicked.addListener( function(clickData,$scope){
    if(clickData.menuItemId == "meaning" && clickData.selectionText)
    {
        var googleUrl = "https://www.google.com/search?safe=active&q=define+" + fixedEncodeURI(clickData.selectionText);
        var search = {
            "url": googleUrl,
            "type": "popup",
            "top": 5,
            "left": 5,
            "width": Math.round(screen.availWidth/2),
            "height": Math.round(screen.availHeight/2)
        };
        chrome.windows.create(search,function(){});
    }

    if (clickData.menuItemId == "translation" && clickData.selectionText )
    {
        var googleUrl = "https://translate.google.com/#auto/en/" + fixedEncodeURI(clickData.selectionText);
        var search = {
            "url": googleUrl,
            "type": "popup",
            "top": 5,
            "left": 5,
            "width": Math.round(screen.availWidth/2),
            "height": Math.round(screen.availHeight/2)
        };
        chrome.windows.create(search,function(){});
    }

    if(clickData.menuItemId == "speak" && clickData.selectionText)
    {
        chrome.tts.speak(clickData.selectionText, {'lang': 'en-US','rate': 0.7});
    }

});
console.log('Background Working')

function blockRequest(details) {
    return {
         cancel: true
    }; 
}
function updateFilters(urls) {
      if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest)) {
        chrome.webRequest.onBeforeRequest.removeListener(blockRequest); 
      }

      var blockedUrls = [];
      chrome.storage.local.get('mainMemory', (details) => {
        blockedUrls = details.mainMemory.blockedWebsites;
        console.log('list of blocked urls below-- background')
        console.log(blockedUrls)
        chrome.webRequest.onBeforeRequest.addListener(blockRequest, {
            urls: 
            blockedUrls
            // [
            //     "https://www.facebook.com/"
            //   ]
          
          }, ['blocking']); 
      });
      
} updateFilters(); 
setInterval(updateFilters,2000)
