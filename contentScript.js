// Function to insert sorting buttons into the specific div
function insertSortingButtons() {
    const container = document.getElementById('project-view::r6:');
    
    if (container) {
        // Create a container for the buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.justifyContent = 'start';
        buttonContainer.style.margin = '0';
        buttonContainer.style.marginLeft = '4px';
        buttonContainer.style.padding = '0';
        buttonContainer.style.width = '100%';

        // Create buttons
        const sortByCreatedAtButton = document.createElement('button');
        sortByCreatedAtButton.innerText = 'Sort by Created';
        sortByCreatedAtButton.onclick = () => sortItems('createdAt');
        
        const sortByUpdatedAtButton = document.createElement('button');
        sortByUpdatedAtButton.innerText = 'Sort by Updated';
        sortByUpdatedAtButton.onclick = () => sortItems('updatedAt');
        
        const filterByAppLabelButton = document.createElement('button');
        filterByAppLabelButton.innerText = 'App';
        filterByAppLabelButton.onclick = () => filterItems('label:App');
        
        const filterByBusinessLabelButton = document.createElement('button');
        filterByBusinessLabelButton.innerText = 'Business';
        filterByBusinessLabelButton.onclick = () => filterItems('label:Business');
        
        const filterByRobertButton = document.createElement('button');
        filterByRobertButton.innerText = 'Robert';
        filterByRobertButton.onclick = () => filterItems('assignee:hankirobert');
        
        const filterByMarkButton = document.createElement('button');
        filterByMarkButton.innerText = 'Mark';
        filterByMarkButton.onclick = () => filterItems('assignee:hankimark');
        
        const filterByJuhaButton = document.createElement('button');
        filterByJuhaButton.innerText = 'Juha';
        filterByJuhaButton.onclick = () => filterItems('assignee:coodeex');
        
        const clearFilterButton = document.createElement('button');
        clearFilterButton.innerText = 'Clear Filter';
        clearFilterButton.onclick = () => filterItems('');

        // Style buttons
        const buttonStyles = `
            background-color: #f6f8fa;
            color: #24292e;
            border: 1px solid #d1d5da;
            padding: 6px 16px 3px 16px;
            cursor: pointer;
            border-radius: 5px;
            font-size: 14px;
            margin-top: 12px;
            margin-left: 12px;
        `;
        sortByCreatedAtButton.style.cssText = buttonStyles;
        sortByUpdatedAtButton.style.cssText = buttonStyles;
        filterByAppLabelButton.style.cssText = buttonStyles;
        filterByBusinessLabelButton.style.cssText = buttonStyles;
        filterByRobertButton.style.cssText = buttonStyles;
        filterByMarkButton.style.cssText = buttonStyles;
        filterByJuhaButton.style.cssText = buttonStyles;
        clearFilterButton.style.cssText = buttonStyles;
        
        sortByCreatedAtButton.onmouseover = () => sortByCreatedAtButton.style.backgroundColor = '#e1e4e8';
        sortByCreatedAtButton.onmouseout = () => sortByCreatedAtButton.style.backgroundColor = '#f6f8fa';
        sortByUpdatedAtButton.onmouseover = () => sortByUpdatedAtButton.style.backgroundColor = '#e1e4e8';
        sortByUpdatedAtButton.onmouseout = () => sortByUpdatedAtButton.style.backgroundColor = '#f6f8fa';
        filterByAppLabelButton.onmouseover = () => filterByAppLabelButton.style.backgroundColor = '#e1e4e8';
        filterByAppLabelButton.onmouseout = () => filterByAppLabelButton.style.backgroundColor = '#f6f8fa';
        filterByBusinessLabelButton.onmouseover = () => filterByBusinessLabelButton.style.backgroundColor = '#e1e4e8';
        filterByBusinessLabelButton.onmouseout = () => filterByBusinessLabelButton.style.backgroundColor = '#f6f8fa';
        filterByRobertButton.onmouseover = () => filterByRobertButton.style.backgroundColor = '#e1e4e8';
        filterByRobertButton.onmouseout = () => filterByRobertButton.style.backgroundColor = '#f6f8fa';
        filterByMarkButton.onmouseover = () => filterByMarkButton.style.backgroundColor = '#e1e4e8';
        filterByMarkButton.onmouseout = () => filterByMarkButton.style.backgroundColor = '#f6f8fa';
        filterByJuhaButton.onmouseover = () => filterByJuhaButton.style.backgroundColor = '#e1e4e8';
        filterByJuhaButton.onmouseout = () => filterByJuhaButton.style.backgroundColor = '#f6f8fa';
        clearFilterButton.onmouseover = () => clearFilterButton.style.backgroundColor = '#e1e4e8';
        clearFilterButton.onmouseout = () => clearFilterButton.style.backgroundColor = '#f6f8fa';
        
        // Append buttons to the button container
        buttonContainer.appendChild(sortByCreatedAtButton);
        buttonContainer.appendChild(sortByUpdatedAtButton);
        buttonContainer.appendChild(filterByAppLabelButton);
        buttonContainer.appendChild(filterByBusinessLabelButton);
        buttonContainer.appendChild(filterByRobertButton);
        buttonContainer.appendChild(filterByMarkButton);
        buttonContainer.appendChild(filterByJuhaButton);
        buttonContainer.appendChild(clearFilterButton);

        // Insert the button container as the second child
        container.insertBefore(buttonContainer, container.children[0]);
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

function filterItems(filterQuery) {
    const filterInput = document.getElementById('filter-bar-input');
    if (filterInput) {
        filterInput.value = filterQuery;
        const event = new Event('input', { bubbles: true });
        filterInput.dispatchEvent(event);
    }
}

// Fallback for when window.load does not trigger
document.addEventListener('DOMContentLoaded', () => {
    insertSortingButtons(); // Insert sorting buttons after content is loaded
});

// Use a mutation observer as an additional fallback
const observer = new MutationObserver((mutations, observer) => {
    insertSortingButtons(); // Insert sorting buttons after content is loaded
    observer.disconnect();
});

observer.observe(document, { childList: true, subtree: true });
