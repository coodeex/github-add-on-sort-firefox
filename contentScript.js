// Function to insert sorting buttons into the specific div
function insertSortingButtons() {
    const container = document.getElementById('project-view::r6:');
    
    if (container) {
        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'start';
        buttonContainer.style.margin = '0 0 0 4px';
        buttonContainer.style.padding = '0';
        buttonContainer.style.width = '100%';

        // Button data
        const buttonsData = [
            { text: 'Sort by Created', action: () => sortItems('createdAt') },
            { text: 'Sort by Updated', action: () => sortItems('updatedAt') },
            { text: 'Last 30 Days', action: () => filterItems('-updated:<@today-30d') },
            { text: 'App', action: () => filterItems('label:App') },
            { text: 'Business', action: () => filterItems('label:Business') },
            { text: 'Robert', action: () => filterItems('assignee:hankirobert') },
            { text: 'Mark', action: () => filterItems('assignee:hankimark') },
            { text: 'Juha', action: () => filterItems('assignee:coodeex') },
            { text: 'Clear Filter', action: () => filterItems('') },
        ];

        // Common styles
        const buttonStyles = `
            background-color: #f6f8fa;
            color: #24292e;
            border: 1px solid #d1d5da;
            padding: 5px 16px 4px 16px;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
            margin-top: 12px;
            margin-left: 12px;
        `;

        // Create and append buttons
        buttonsData.forEach(({ text, action }) => {
            const button = document.createElement('button');
            button.innerText = text;
            button.onclick = action;
            button.style.cssText = buttonStyles;
            button.onmouseover = () => button.style.backgroundColor = '#e1e4e8';
            button.onmouseout = () => button.style.backgroundColor = '#f6f8fa';
            buttonContainer.appendChild(button);
        });

        // Insert the button container as the second child
        container.insertBefore(buttonContainer, container.children[0]);
    }
}

function sortItems(sortBy) {
    const jsonData = document.getElementById('memex-items-data').textContent;
    const items = JSON.parse(jsonData);
    const sortedItems = items.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));
    const cards = document.querySelectorAll('div[data-testid="board-view-column-card"]');
    const idToCardMap = new Map();

    cards.forEach(card => {
        const id = card.getAttribute('data-board-card-id');
        idToCardMap.set(parseInt(id, 10), card);
    });

    sortedItems.forEach(item => {
        const card = idToCardMap.get(item.id);
        if (card) {
            const parent = card.parentNode;
            parent.removeChild(card);
            parent.appendChild(card);
        }
    });
}

function filterItems(filterQuery) {
    const filterInput = document.getElementById('filter-bar-input');
    if (filterInput) {
        filterInput.value = filterQuery;
        const event = new Event('input', { bubbles: true });
        filterInput.dispatchEvent(event);
    }
}

// Listen for the sort message from the popup
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sortByCreatedAt") {
        sortItems('createdAt');
    } else if (message.action === "sortByUpdatedAt") {
        sortItems('updatedAt');
    }
});

// Fallback for when window.load does not trigger
document.addEventListener('DOMContentLoaded', insertSortingButtons);

// Use a mutation observer as an additional fallback
const observer = new MutationObserver((mutations, observer) => {
    insertSortingButtons();
    observer.disconnect();
});
observer.observe(document, { childList: true, subtree: true });
