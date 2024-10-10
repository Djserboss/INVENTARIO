// charts.js

const Charts = (() => {
    let inventoryChart = null;

    const createChart = () => {
        const ctx = document.getElementById('inventoryChart').getContext('2d');
        const products = Products.getProducts();

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
    };

    return {
        createChart
    };
})();
