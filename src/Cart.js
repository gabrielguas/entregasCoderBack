class Cart {
    constructor(id) {
        this.id = id;
        this.products = [];
    }

    addProduct(productId) {
        const existingProduct = this.products.find(product => product.id === productId);

        if (existingProduct) {
            existingProduct.quantity++;
        } else {
            this.products.push({ id: productId, quantity: 1 });
        }
    }

    getProducts() {
        return this.products;
    }
}

export default Cart;
