document.getElementById('sortByCreatedAtButton').addEventListener('click', () => {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {action: "sortByCreatedAt"});
    }).catch(err => console.error(err));
});

document.getElementById('sortByUpdatedAtButton').addEventListener('click', () => {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
        browser.tabs.sendMessage(tabs[0].id, {action: "sortByUpdatedAt"});
    }).catch(err => console.error(err));
});

