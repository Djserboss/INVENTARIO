// ui.js

const UI = (() => {
    const renderTable = () => {
        const products = Products.getProducts();
        const inventoryTableBody = document.querySelector('#inventory-table tbody');
        if (!inventoryTableBody) return;

        inventoryTableBody.innerHTML = '';
        products.forEach((product, index) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${product.name}</td>
                <td>${product.description}</td>
                <td>${product.quantity}</td>
                <td>${product.price !== null ? `$${product.price.toFixed(2)}` : 'N/A'}</td>
                <td>${product.lowStockLimit}</td>
                <td class="actions">
                    <button class="edit" data-index="${index}">Editar</button>
                    <button class="delete" data-index="${index}">Eliminar</button>
                </td>
            `;

            inventoryTableBody.appendChild(row);
        });
    };

    const loadLowStockProducts = () => {
        const lowStockList = document.getElementById('low-stock-list');
        lowStockList.innerHTML = '';

        const lowStockProducts = Products.getProducts().filter(product => product.quantity <= product.lowStockLimit);

        if (lowStockProducts.length > 0) {
            lowStockProducts.forEach(product => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<span>${product.name}</span> - Stock: ${product.quantity}`;
                lowStockList.appendChild(listItem);
            });
        } else {
            lowStockList.innerHTML = '<li>No hay productos con bajo stock.</li>';
        }
    };

    const resetForm = () => {
        document.getElementById('inventory-form').reset();
    };

    const populateForm = (product, index) => {
        // Implementa si es necesario para la edición
    };

    return {
        renderTable,
        loadLowStockProducts,
        resetForm,
        populateForm
    };
})();
