// script.js

// Referencias a elementos del DOM
const menuLinks = document.querySelectorAll('.sidebar ul li a');
const sections = document.querySelectorAll('.section');

// Array para almacenar los productos
let products = [];

// Variable para almacenar el límite de stock (no necesaria ahora si cada producto tiene su propio límite)
let stockLimit = 10; // Valor por defecto (puedes eliminar esto si no lo necesitas)

// Variable para el gráfico de inventario
let inventoryChart = null;

// Cargar productos desde localStorage al iniciar
window.onload = function() {
    // Cargar productos
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }

    // Renderizar la tabla de productos si la sección está visible
    const currentSection = document.querySelector('.section:not([style*="display: none"])');
    if (currentSection.id === 'list-products') {
        renderTable();
    }

    // Renderizar la lista de bajo stock si la sección está visible
    if (currentSection.id === 'home') {
        loadLowStockProducts();
    }

    // Inicializar navegación
    initializeNavigation();
}

// Función para guardar productos en localStorage
function saveToLocalStorage() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Función para renderizar la tabla de productos
function renderTable() {
    const inventoryTableBody = document.querySelector('#inventory-table tbody');
    if (!inventoryTableBody) return; // Si la tabla no está en el DOM, salir

    inventoryTableBody.innerHTML = '';
    products.forEach((product, index) => {
        const row = document.createElement('tr');

        // Crear celdas
        const idCell = document.createElement('td');
        idCell.textContent = index + 1;

        const nameCell = document.createElement('td');
        nameCell.textContent = product.name;

        const descriptionCell = document.createElement('td');
        descriptionCell.textContent = product.description;

        const quantityCell = document.createElement('td');
        quantityCell.textContent = product.quantity;

        const priceCell = document.createElement('td');
        priceCell.textContent = product.price !== null ? `$${product.price.toFixed(2)}` : 'N/A';

        const lowStockCell = document.createElement('td');
        lowStockCell.textContent = product.lowStockLimit;

        const actionsCell = document.createElement('td');
        actionsCell.classList.add('actions');

        // Botón de editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.classList.add('edit');
        editButton.onclick = () => editProduct(index);

        // Botón de eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.classList.add('delete');
        deleteButton.onclick = () => deleteProduct(index);

        // Añadir botones a la celda de acciones
        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

        // Añadir celdas a la fila
        row.appendChild(idCell);
        row.appendChild(nameCell);
        row.appendChild(descriptionCell);
        row.appendChild(quantityCell);
        row.appendChild(priceCell);
        row.appendChild(lowStockCell);
        row.appendChild(actionsCell);

        // Añadir fila al cuerpo de la tabla
        inventoryTableBody.appendChild(row);
    });
}

// Función para cargar y mostrar productos con bajo stock en Inicio
function loadLowStockProducts() {
    const lowStockList = document.getElementById('low-stock-list');
    lowStockList.innerHTML = ''; // Limpiar la lista antes de agregar elementos

    // Filtrar productos que están por debajo o igual al límite de stock individual
    const lowStockProducts = products.filter(product => product.quantity <= product.lowStockLimit);

    if (lowStockProducts.length > 0) {
        lowStockProducts.forEach(product => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span>${product.name}</span> - Stock: ${product.quantity}`;
            lowStockList.appendChild(listItem);
        });
    } else {
        lowStockList.innerHTML = '<li>No hay productos con bajo stock.</li>';
    }
}

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
    products.push(newProduct);
    saveToLocalStorage();

    // Renderizar la tabla de productos si la sección está visible
    const currentSection = document.querySelector('.section:not([style*="display: none"])');
    if (currentSection.id === 'list-products') {
        renderTable();
    }

    // Actualizar la lista de bajo stock si la sección está visible
    if (currentSection.id === 'home') {
        loadLowStockProducts();
    }

    // Resetear el formulario
    this.reset();

    alert('Producto agregado exitosamente.');
});

// Función para eliminar un producto
function deleteProduct(index) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        products.splice(index, 1);
        saveToLocalStorage();
        renderTable();
        loadLowStockProducts();
    }
}

// Función para editar un producto
function editProduct(index) {
    const product = products[index];

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
            <button class="save" onclick="saveEdit(${index})">Guardar</button>
            <button class="cancel" onclick="cancelEdit(${index})">Cancelar</button>
        </td>
    `;
}

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
    products[index] = {
        name: editedName,
        description: editedDescription,
        quantity: editedQuantity,
        price: isNaN(editedPrice) ? null : editedPrice,
        lowStockLimit: editedLowStock
    };

    // Guardar y actualizar la interfaz
    saveToLocalStorage();
    renderTable();
    loadLowStockProducts();

    alert('Producto actualizado exitosamente.');
}

// Función para cancelar la edición
function cancelEdit(index) {
    renderTable();
}

// Función para mostrar la sección seleccionada y ocultar las demás
function showSection(sectionId) {
    sections.forEach(section => {
        if (section.id === sectionId) {
            section.style.display = 'block';
        } else {
            section.style.display = 'none';
        }
    });

    // Si la sección es "list-products", renderizar la tabla
    if (sectionId === 'list-products') {
        renderTable();
    }

    // Si la sección es "home", cargar los productos con bajo stock
    if (sectionId === 'home') {
        loadLowStockProducts();
    }

    // Si la sección es "reports", crear o actualizar el gráfico
    if (sectionId === 'reports') {
        createChart();
    }

    // Si la sección es "add-qr", inicializar el escáner QR
    if (sectionId === 'add-qr') {
        initializeQRScanner();
    }
}

// Función para manejar la navegación del menú
function initializeNavigation() {
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('data-section');
            showSection(section);
        });
    });
}

// ------------------- Funcionalidad de Reportes -------------------

// Función para crear el gráfico de inventario
function createChart() {
    const ctx = document.getElementById('inventoryChart').getContext('2d');

    const productNames = products.map(product => product.name);
    const productQuantities = products.map(product => product.quantity);

    if (inventoryChart) {
        inventoryChart.destroy();
    }

    inventoryChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: productNames.length > 0 ? productNames : ['No hay productos'],
            datasets: [{
                label: 'Cantidad en Inventario',
                data: productQuantities.length > 0 ? productQuantities : [0],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            }
        }
    });
}

// ------------------- Funcionalidad de Escaneo QR -------------------

// Inicializar el escáner QR
function initializeQRScanner() {
    const qrReader = new Html5Qrcode("qr-reader");
    const qrReaderResults = document.getElementById("qr-reader-results");

    // Verificar si ya está escaneando
    if (qrReader.isScanning) {
        return;
    }

    // Iniciar el escaneo
    qrReader.start(
        { facingMode: "environment" }, // Usar la cámara trasera
        {
            fps: 10,    // Cuadros por segundo
            qrbox: { width: 250, height: 250 } // Tamaño de la ventana del escáner
        },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
    ).then(() => {
        console.log("Escáner iniciado.");
    }).catch(err => {
        console.log(`Error al iniciar el escáner: ${err}`);
        alert('No se pudo acceder a la cámara. Por favor, revisa los permisos y el dispositivo.');
    });
}

// Callback cuando se detecta un QR exitosamente
function qrCodeSuccessCallback(decodedText, decodedResult) {
    console.log(`Código QR detectado: ${decodedText}`);
    // Procesar el texto del QR y agregar el producto
    processQrCode(decodedText);
    // Detener el escaneo después de detectar un código
    Html5Qrcode.getCameras().then(devices => {
        if (devices && devices.length) {
            const cameraId = devices[0].id;
            const qrReader = new Html5Qrcode("qr-reader");
            qrReader.stop().then(ignore => {
                console.log("Escáner detenido después de detectar un código.");
            }).catch(err => {
                console.log(`Error al detener el escáner: ${err}`);
            });
        }
    }).catch(err => {
        console.log(`Error al obtener cámaras: ${err}`);
    });
}

// Callback para los errores (puedes dejarlo vacío o usarlo para debuggear)
function qrCodeErrorCallback(errorMessage) {
    // console.log(`Error de escaneo: ${errorMessage}`);
}

// Función para procesar el texto del QR y agregar el producto
function processQrCode(decodedText) {
    /*
        Supongamos que el código QR contiene una cadena con el siguiente formato:
        Nombre:Producto A;Descripción:Descripción del Producto A;Cantidad:10;Precio:100.00;Límite:5
    */

    const productData = decodedText.split(';');
    const product = {};

    productData.forEach(item => {
        const [key, value] = item.split(':');
        if (key && value) {
            product[key.toLowerCase()] = value.trim();
        }
    });

    // Validar que se hayan obtenido todos los campos necesarios
    if (product.nombre && product.cantidad && product.límite) {
        // Completar el formulario con los datos del QR
        document.getElementById('product-name').value = product.nombre;
        document.getElementById('product-description').value = product.descripcion || '';
        document.getElementById('product-quantity').value = parseInt(product.cantidad);
        document.getElementById('product-price').value = parseFloat(product.precio) || '';
        document.getElementById('product-lowstock').value = parseInt(product.límite);

        alert('Producto agregado desde el QR. Por favor, revisa los detalles y presiona "Agregar Producto".');
    } else {
        alert('El código QR escaneado no contiene información válida del producto. Asegúrate de que siga el formato correcto.');
    }
}

// ------------------- Funcionalidad de Reportes -------------------

// Puedes agregar más funcionalidades de Reportes si es necesario
