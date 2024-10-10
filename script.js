// script.js

// Inicializar la navegación al cargar la ventana
window.onload = () => {
    Navigation.initializeNavigation();

    // Renderizar la tabla de productos si la sección "list-products" está visible
    const currentSection = document.querySelector('.section:not([style*="display: none"])');
    if (currentSection.id === 'list-products') {
        UI.renderTable();
    }

    // Renderizar la lista de bajo stock si la sección "home" está visible
    if (currentSection.id === 'home') {
        UI.loadLowStockProducts();
    }
};

// Manejar el envío del formulario para agregar productos
document.getElementById('inventory-form').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obtener valores del formulario
    const name = document.getElementById('product-name').value.trim();
    const description = document.getElementById('product-description').value.trim();
    const quantity = parseInt(document.getElementById('product-quantity').value);
    const price = parseFloat(document.getElementById('product-price').value);
    const lowStockLimit = parseInt(document.getElementById('product-lowstock').value);

    // Validar campos
    if (name === '' || isNaN(quantity) || quantity < 0 || isNaN(lowStockLimit) || lowStockLimit < 1) {
        alert('Por favor, completa los campos obligatorios correctamente.');
        return;
    }

    // Crear nuevo producto
    const newProduct = {
        name,
        description,
        quantity,
        price: isNaN(price) ? null : price,
        lowStockLimit
    };

    // Añadir al array y guardar
    Products.addProduct(newProduct);

    // Renderizar la tabla de productos si la sección está visible
    const currentSection = document.querySelector('.section:not([style*="display: none"])');
    if (currentSection.id === 'list-products') {
        UI.renderTable();
    }

    // Actualizar la lista de bajo stock si la sección está visible
    if (currentSection.id === 'home') {
        UI.loadLowStockProducts();
    }

    // Resetear el formulario
    UI.resetForm();

    alert('Producto agregado exitosamente.');
});

// Manejar eventos de edición y eliminación utilizando delegación de eventos
document.getElementById('inventory-table').addEventListener('click', function(event) {
    if (event.target.classList.contains('delete')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            Products.deleteProduct(index);
            UI.renderTable();
            UI.loadLowStockProducts();
        }
    }

    if (event.target.classList.contains('edit')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        editProduct(index);
    }
});

// Función para editar un producto
function editProduct(index) {
    const product = Products.getProducts()[index];

    // Crear una nueva fila de edición
    const inventoryTableBody = document.querySelector('#inventory-table tbody');
    const rows = inventoryTableBody.getElementsByTagName('tr');
    const row = rows[index];

    // Reemplazar las celdas con campos de edición
    row.innerHTML = `
        <td>${index + 1}</td>
        <td><input type="text" id="edit-name-${index}" value="${product.name}" required></td>
        <td><input type="text" id="edit-description-${index}" value="${product.description}"></td>
        <td><input type="number" id="edit-quantity-${index}" value="${product.quantity}" min="0" required></td>
        <td><input type="number" id="edit-price-${index}" value="${product.price !== null ? product.price : ''}" min="0" step="0.01"></td>
        <td><input type="number" id="edit-lowstock-${index}" value="${product.lowStockLimit}" min="1" required></td>
        <td class="actions">
            <button class="save" data-index="${index}">Guardar</button>
            <button class="cancel" data-index="${index}">Cancelar</button>
        </td>
    `;
}

// Manejar eventos de guardar y cancelar la edición
document.getElementById('inventory-table').addEventListener('click', function(event) {
    if (event.target.classList.contains('save')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        saveEdit(index);
    }

    if (event.target.classList.contains('cancel')) {
        const index = parseInt(event.target.getAttribute('data-index'));
        UI.renderTable();
    }
});

// Función para guardar los cambios de edición
function saveEdit(index) {
    const editedName = document.getElementById(`edit-name-${index}`).value.trim();
    const editedDescription = document.getElementById(`edit-description-${index}`).value.trim();
    const editedQuantity = parseInt(document.getElementById(`edit-quantity-${index}`).value);
    const editedPrice = parseFloat(document.getElementById(`edit-price-${index}`).value);
    const editedLowStock = parseInt(document.getElementById(`edit-lowstock-${index}`).value);

    // Validar campos
    if (editedName === '' || isNaN(editedQuantity) || editedQuantity < 0 || isNaN(editedLowStock) || editedLowStock < 1) {
        alert('Por favor, completa los campos obligatorios correctamente.');
        return;
    }

    // Actualizar el producto
    const updatedProduct = {
        name: editedName,
        description: editedDescription,
        quantity: editedQuantity,
        price: isNaN(editedPrice) ? null : editedPrice,
        lowStockLimit: editedLowStock
    };

    Products.editProduct(index, updatedProduct);

    // Guardar y actualizar la interfaz
    UI.renderTable();
    UI.loadLowStockProducts();

    alert('Producto actualizado exitosamente.');
}
