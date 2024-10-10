// storage.js

const Storage = (() => {
    const saveProducts = (products) => {
        localStorage.setItem('products', JSON.stringify(products));
    };

    const loadProducts = () => {
        const storedProducts = localStorage.getItem('products');
        return storedProducts ? JSON.parse(storedProducts) : [];
    };

    return {
        saveProducts,
        loadProducts
    };
})();
