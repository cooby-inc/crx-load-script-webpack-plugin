const { MESSAGE_TYPES } = require('./constants')

const DEBUG = __resourceQuery.includes('debug=true');

const handleMessage = (request, sender, sendResponse) => {
  if(request.type !== MESSAGE_TYPES.LOAD_SCRIPT) return 
  
  const { file } = request.payload;

  DEBUG && console.log('executeScript:', file);
  chrome.scripting.executeScript({
    target: { tabId: sender.tab.id },
    injectImmediately: true,
    files: [file],
  });
};

chrome.runtime.onMessage.addListener(handleMessage);
