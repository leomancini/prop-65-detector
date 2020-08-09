window.Prop65 = {
    matchesFound: false,
    matchesHighlighted: false,
    matchPositions: [],
    matchIndex: 0,
    searchTerms: [
        `Proposition 65`,
        `Prop 65`,
        `P65Warnings`,
        `WARNING: Consuming this product can expose you to chemicals`
    ]
}

function checkPageForMatches() {
    const   documentContent = document.body.innerHTML,
            matchesFound = new RegExp(window.Prop65.searchTerms.join("|")).test(documentContent);

    return matchesFound;
}

function updateBrowserActionIcon() {
    const matchesFound = checkPageForMatches();
    window.Prop65.matchesFound = matchesFound;

    try {
        chrome.runtime.sendMessage({ matchesFound });
    } catch(error) {
        console.log(error);
    }
}

function getMatchPosition(node) {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    return node.getBoundingClientRect().top + scrollPosition;
}

function highlightMatches() {
    if (!window.Prop65.matchesHighlighted) {
        window.Prop65.matchesHighlighted = true;

        findAndReplaceDOMText(document.body, {
            preset: 'prose',
            find: new RegExp(window.Prop65.searchTerms.join("|")),
            wrap: 'span',
            wrapClass: 'Prop65WarningHighlight'
        });
    }

    window.Prop65.matchPositions = [];

    findAndReplaceDOMText(document.body, {
        preset: 'prose',
        find: new RegExp(window.Prop65.searchTerms.join("|")),
        replace: function(match, text) {
            window.Prop65.matchPositions.push(getMatchPosition(match.node.parentNode));

            return text;
        }
    });

    if (window.Prop65.matchPositions) {
        if (window.Prop65.matchPositions[window.Prop65.matchIndex]) {
            window.scrollTo(0, window.Prop65.matchPositions[window.Prop65.matchIndex]);
        }

        if (window.Prop65.matchIndex < (window.Prop65.matchPositions.length - 1)) {
            window.Prop65.matchIndex++;
        } else {
            window.Prop65.matchIndex = 0;
        }
    }
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    updateBrowserActionIcon();

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
    const documentChangeObserver = new MutationObserver(function() {
        updateBrowserActionIcon();
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
        if (window.Prop65.matchesFound) {
            highlightMatches();
        }
    }
});