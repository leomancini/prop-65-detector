function checkForProp65() {
    const documentContent = document.documentElement.innerHTML;

    const searchTerms = [
        `Proposition 65`,
        `Prop 65`,
        `P65Warnings`,
        `WARNING: Consuming this product can expose you to chemicals`
    ];
    
    const match = new RegExp(searchTerms.join("|")).test(documentContent);
    
    chrome.runtime.sendMessage({ match });
}

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    checkForProp65();

    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    
    const documentChangeObserver = new MutationObserver(function() {
        checkForProp65();
    });
    
    documentChangeObserver.observe(document, {
        subtree: true,
        childList: true,
        attributes: false
    });
}