const { MESSAGE_TYPES } = require('./constants')

const DEBUG = __resourceQuery.includes('debug=true');

const handleMessage = (request, sender, sendResponse) => {
  if(request.type !== MESSAGE_TYPES.LOAD_SCRIPT) return 
  
  const { file } = request.payload;

  DEBUG && console.log('executeScript:', file);

  if (chrome.runtime.getManifest().manifest_version === 2){
    chrome.tabs.executeScript(sender.tab.id, { file });
  } else {
    chrome.scripting.executeScript({
      target: { tabId: sender.tab.id },
      injectImmediately: true,
      files: [file],
    });
  }

  // Return true to indicate you want to send a response asynchronously.
  return true;
};

chrome.runtime.onMessage.addListener(handleMessage);
