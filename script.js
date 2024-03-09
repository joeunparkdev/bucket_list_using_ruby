// MongoDB에서 버킷 리스트 아이템을 삭제합니다.
async function deleteItem(id) {
    await fetch(`/delete_item/${id}`, {
        method: 'DELETE'
    });
}

// 버킷 리스트를 화면에 표시합니다.
async function displayItems() {
    const bucketList = document.getElementById('bucketList');
    bucketList.innerHTML = '';

    const response = await fetch('/items');
    const items = await response.json();

    items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.text;
        div.className = item.done ? 'item done' : 'item';

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => {
            deleteItem(item._id).then(() => {
                displayItems();
            });
        };

        div.appendChild(deleteButton);
        bucketList.appendChild(div);
    });
}

// 새로운 버킷 리스트 아이템을 추가합니다.
async function addNewItem() {
    const newItemText = document.getElementById('newItem').value.trim();
    if (newItemText !== '') {
        const newItem = { text: newItemText, done: false };
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ new_item: item.text })
            });
            if (!response.ok) {
                throw new Error('Failed to add item');
            }
            displayItems();
            document.getElementById('newItem').value = '';
        } catch (error) {
            console.error('Error adding item:', error);
        }
    }
}

// 버킷 리스트 아이템의 완료 상태를 토글합니다.
async function toggleItem(item) {
    item.done = !item.done;
    await saveItems(item);
    displayItems();
    if (item.done) {
        alert('달성을 축하합니다!');
    }
}

// 초기화
displayItems();
