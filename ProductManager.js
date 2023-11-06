const fs = require('fs');

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = fs.readFileSync(this.path, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
            }
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        fs.writeFileSync(this.path, data);
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (title && description && price && thumbnail && code && stock) {
            if (this.validateCode(code)) {
                const lastID = this.products.length > 0 ? this.products[this.products.length - 1].ID : -1;
                const newID = lastID + 1;
                const newProduct = new Product(title, description, price, thumbnail, code, stock, newID);
                this.products.push(newProduct);
                this.saveProducts();
                console.log("Producto agregado correctamente.");
            } else {
                console.log("Ya existe un producto con el mismo código.");
            }
        } else {
            console.log("Todos los campos son obligatorios.");
        }
    }

    validateCode(code) {
        return !this.products.some(product => product.code === code);
    }

    getProducts() {
        return this.products;
    }

    getProductByID(ID) {
        const product = this.products.find(product => product.ID === ID);
        if (product) {
            return product;
        } else {
            console.log("Producto no encontrado.");
        }
    }

    updateProduct(ID, updatedProduct) {
        const index = this.products.findIndex(product => product.ID === ID);
        if (index !== -1) {
            updatedProduct.ID = this.products[index].ID;
            this.products[index] = updatedProduct;
            this.saveProducts();
            console.log("Producto actualizado correctamente.");
        } else {
            console.log("No se encontró el producto con el ID proporcionado.");
        }
    }

    deleteProduct(ID) {
        const index = this.products.findIndex(product => product.ID === ID);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            console.log("Producto eliminado correctamente.");
        } else {
            console.log("No se encontró el producto con el ID proporcionado.");
        }
    }
}

class Product {
    constructor(title, description, price, thumbnail, code, stock, ID) {
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
        this.ID = ID;
    }
}

const productManager = new ProductManager('productos.json');


productManager.addProduct("Producto 1", "Descripción del producto 1", 100, "imagen1.jpg", "123ABC", 10);
productManager.addProduct("Producto 2", "Descripción del producto 2", 150, "imagen2.jpg", "456DEF", 15);
productManager.addProduct("Producto 3", "Descripción del producto 3", 120, "imagen3.jpg", "789XYZ", 12);

console.log("Producto consultado por ID:");
console.log(productManager.getProductByID(1));
console.log(productManager.getProductByID(2));
console.log(productManager.getProductByID(3));

const productoActualizado = {
    title: "Producto Actualizado",
    description: "Descripción actualizada",
    price: 120,
    thumbnail: "imagen1_actualizada.jpg",
    code: "123ABC",
    stock: 12
};
productManager.updateProduct(1, productoActualizado);

productManager.deleteProduct(2);

console.log("Lista de productos actualizada:");
console.log(productManager.getProducts());
