import CartModel from "../../models/cart.model.js";

class CartDao {
    // Obtener todos los productos
  
    async getAllProducts() {
      return await CartModel.find();
    }
  
    async getProductById(id) {
      return await CartModel.findById(id);
    }
  
  
    async createCart(uid) {
      return await CartModel.create({ userId: uid});
    }
  
  
    async updateProduct(id, product) {
      return await CartModel.findByIdAndUpdate(id, product);
    }
  
    async removeProductFromCart(cartId, productId) {
      try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
          throw new Error('Carrito no encontrado');
        }
    
        const existingProductIndex = cart.products.findIndex(
          (product) => String(product.productId) === productId
        );
        if (existingProductIndex !== -1) {
          if (cart.products[existingProductIndex].quantity > 1) {
            cart.products[existingProductIndex].quantity -= 1;
          } else {
            cart.products.splice(existingProductIndex, 1);
          }
          cart.totalProducts = cart.products.length;
          cart.total = cart.products.reduce((total, product) => total + product.quantity, 0);
    
          await cart.save();
          return cart;
        } else {
          throw new Error('Producto no encontrado en el carrito');
        }
      } catch (error) {
        throw error;
      }
    }












    async addProductToCart(cartId, productId) {
      try {
        const cart = await CartModel.findById(cartId);
        if (!cart) {
          throw new Error('Carrito no encontrado');
        }
        const existingProductIndex = cart.products.findIndex(
          (product) => String(product.productId) === productId
        );
        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += 1;
        } else {
          cart.products.push({
            productId: productId,
            quantity: 1,
          });
        }
        cart.totalProducts = cart.products.length;
        cart.total = cart.products.reduce((total, product) => {
          return total + product.quantity;
        }, 0);
        await cart.save();
        return cart;
      } catch (error) {
        throw error;
      }
    }











  }
  
  export default new CartDao();