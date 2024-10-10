// navigation.js

const Navigation = (() => {
    const menuLinks = document.querySelectorAll('.sidebar ul li a');
    const sections = document.querySelectorAll('.section');

    const showSection = (sectionId) => {
        sections.forEach(section => {
            section.style.display = section.id === sectionId ? 'block' : 'none';
        });

        switch (sectionId) {
            case 'list-products':
                UI.renderTable();
                break;
            case 'home':
                UI.loadLowStockProducts();
                break;
            case 'reports':
                Charts.createChart();
                break;
            case 'add-qr':
                QR.initializeQRScanner();
                break;
            default:
                break;
        }
    };

    const initializeNavigation = () => {
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                showSection(section);
            });
        });
    };

    return {
        initializeNavigation
    };
})();
