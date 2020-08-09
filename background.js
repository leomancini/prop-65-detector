chrome.runtime.onMessage.addListener(function(request, sender) {
    chrome.browserAction.setIcon({
        path: `icons/browser-action/${request.color ? 'dark' : 'light'}/${request.matchesFound ? 'match' : 'no-match'}.png`,
        tabId: sender.tab.id
    });
});

chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, { clicked: true });
});

chrome.runtime.onInstalled.addListener(function() {
    chrome.browserAction.setIcon({
        path: `icons/browser-action/${window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}/loading.png`,
    });
});