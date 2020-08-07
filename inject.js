const documentContent = document.documentElement.innerHTML;

const substrings = [
    `Proposition 65`,
    `Prop 65`,
    `www.P65Warnings.ca.gov`,
    `WARNING: Consuming this product can expose you to chemicals`
];

if (substrings.some(v => documentContent.includes(v))) {
    chrome.runtime.sendMessage({ "Prop65": true });
}