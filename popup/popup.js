document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('openMain').addEventListener('click', function () {
        chrome.tabs.create({
            url: chrome.runtime.getURL("/app/index.html")
        });
    });
});