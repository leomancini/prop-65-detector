chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.browserAction.setIcon({
        path: `icons/${request.match ? 'match' : 'no-match' }.png`,
        tabId: sender.tab.id
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { clicked: true });
});