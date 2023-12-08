import { readFileSync, writeFileSync } from 'fs';
import Product from './Product.js';
//optimizar (pasar al estilo del cart)
class ProductManager {
    constructor(path) {
        this.path = path;
        this.loadProducts();
    }

    loadProducts() {
        try {
            const data = readFileSync(this.path, 'utf8');
            if (data) {
                this.products = JSON.parse(data);
            }
        } catch (error) {
            this.products = [];
        }
    }

    saveProducts() {
        const data = JSON.stringify(this.products, null, 2);
        writeFileSync(this.path, data);
    }
    
    addProduct(newProduct) {
        const { title, description, price, code, stock, category, thumbnails } = newProduct;
    
        if (title && description && price && code && stock && category) {
            if (this.validateCode(code)) {
                const newID = this.products.length > 0 ? this.products[this.products.length - 1].ID + 1 : 1;
                const productThumbnails = thumbnails || [];
    
                const product = new Product(newID, title, description, code, price, true, stock, category, productThumbnails);
                this.products.push(product);
                this.saveProducts();
                return { mensaje: "El producto se agregó correctamente." };
            } else {
                return { mensaje: "Ya existe un producto con ese código." };
            }
        } else {
            return { mensaje: "Todos los campos son obligatorios (excepto thumbnails)." };
        }
    }
    

    validateCode(code) {
        return !this.products.some(product => product.code === code);
    }

    getProducts() {
        try {
            // const limit = parseInt(req.query.limit);
            const limit = 0;

            if (!isNaN(limit) && limit > 0) {
                const limitedProducts = this.products.slice(0, limit);
                return limitedProducts;
            } else {
                return this.products;
            }
        } catch (error) {
            console.error('Error al procesar la solicitud', error);
            res.status(500).send('Error del sv');
        }
    }


    getProductByID(ID) {
        const product = this.products.find(product => product.ID == ID);
        if (product) {
            return product;
        } else {
            return { error: "Producto no encontrado" };
        }
    }

    updateProduct(ID, updatedProduct) {
        const index = this.products.findIndex(product => product.ID == ID);
        if (index !== -1) {
            updatedProduct.ID = this.products[index].ID;
            this.products[index] = updatedProduct;
            this.saveProducts();
            return { mensaje: "Se actualizzó el producto correctamente." };
        } else {
            return { mensaje: "No se encontró el producto con el ID proporcionado." };
        }
    }

    deleteProduct(ID) {
        const index = this.products.findIndex(product => product.ID == ID);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.saveProducts();
            return { mensaje: "Producto eliminado correctamente." };
        } else {
            return { mensaje: "No se encontró el producto con el ID proporcionado." };
        }
    }
}

export default ProductManager;