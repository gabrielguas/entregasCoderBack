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
  
    async deleteProduct(req) {
      const { cid, pid } = req.params
      return await CartModel.findByIdAndDelete(id);
    }
  }
  
  export default new CartDao();