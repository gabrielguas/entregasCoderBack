import { readFileSync, writeFileSync } from 'fs';
import Cart from './Cart.js';

class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.carts = this.loadCarts();
    }

    loadCarts() {
        try {
            const data = readFileSync(this.filePath, 'utf8');
            const cartsData = JSON.parse(data);
            return cartsData.map(cartData => {
                const cart = new Cart(cartData.id);
                cart.products = cartData.products;
                console.log("Carrito creado exitosamente!");
                return cart;
            });
        } catch (error) {
            return [];
        }
    }

    saveCarts() {
        const cartsData = this.carts.map(cart => ({
            id: cart.id,
            products: cart.products,
        }));
        const jsonData = JSON.stringify(cartsData, null, 2);
        writeFileSync(this.filePath, jsonData, 'utf8');
        console.log('Carritos guardados exitosamente!');
    }

    createCart() {
        const cartId = this.generateUniqueId();
        const newCart = new Cart(cartId);
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(cartId) {
        return this.carts.find(cart => cart.id === cartId);
    }

    generateUniqueId() {
        return Math.floor(Math.random() * 1000000).toString(); //Crear ID automaticamente
    }
}

export default CartManager;
