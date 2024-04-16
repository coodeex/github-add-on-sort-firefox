// Listen for the sort message from the popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sortByCreatedAt") {
        sortItems('createdAt');
    } else if (message.action === "sortByUpdatedAt") {
        sortItems('updatedAt');
    }
});

function sortItems(sortBy) {
    const jsonData = document.getElementById('memex-items-data').textContent;
    const items = JSON.parse(jsonData);

    // Sort the items based on the attribute passed to the function
    const sortedItems = items.sort((a, b) => {
        return new Date(b[sortBy]) - new Date(a[sortBy]);
    });

    // Query all cards
    const cards = document.querySelectorAll('div[data-testid="board-view-column-card"]');

    // Map cards to their IDs for easy access
    const idToCardMap = new Map();
    cards.forEach(card => {
        const id = card.getAttribute('data-board-card-id');
        idToCardMap.set(parseInt(id, 10), card);
    });

    // Rearrange the cards based on the sorted items
    sortedItems.forEach(item => {
        const card = idToCardMap.get(item.id);
        if (card) {
            const parent = card.parentNode;
            parent.removeChild(card);
            parent.appendChild(card);
        }
    });
}
