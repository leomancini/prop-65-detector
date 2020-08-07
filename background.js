chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.browserAction.setIcon({
        path: 'icons/match.png',
        tabId: sender.tab.id
    });
});