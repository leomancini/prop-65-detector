window.prop65Match = false;
prop65WarningHighlighted = false;

const searchTerms = [
    `Proposition 65`,
    `Prop 65`,
    `P65Warnings`,
    `WARNING: Consuming this product can expose you to chemicals`
];

function checkPageForProp65() {
    const documentContent = document.body.innerHTML;

    const match = new RegExp(searchTerms.join("|")).test(documentContent);

    return match;
}

function updateIcon() {
    const match = checkPageForProp65();
    window.prop65Match = match;

    try {
        chrome.runtime.sendMessage({ match });
    } catch(error) {
        console.log(error);
    }
}

function getNodePosition(node) {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    return node.getBoundingClientRect().top + scrollPosition;
}

function highlightProp65Warning() {
    if (window.prop65Match) {
        if (!prop65WarningHighlighted) {
            prop65WarningHighlighted = true;

            findAndReplaceDOMText(document.body, {
                preset: 'prose',
                find: new RegExp(searchTerms.join("|")),
                wrap: 'span',
                wrapClass: 'prop65WarningHighlight'
            });
        }

        findAndReplaceDOMText(document.body, {
            preset: 'prose',
            find: new RegExp(searchTerms.join("|")),
            replace: function(match, text) {
                window.scrollTo(0, getNodePosition(match.node.parentNode));

                return text;
            }
        });
    }
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    updateIcon();

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
    const documentChangeObserver = new MutationObserver(function() {
        updateIcon();
    });
    
    documentChangeObserver.observe(document, {
        subtree: true,
        childList: true,
        attributes: false
    });
}

if (typeof documentChangeObserver !== 'undefined') {
    chrome.runtime.connect().onDisconnect.addListener(function() {
        documentChangeObserver.disconnect();
    });
}

chrome.runtime.onMessage.addListener(function(action) {
    if (action.clicked) {
        highlightProp65Warning();
    }
});