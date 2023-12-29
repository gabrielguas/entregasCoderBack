import ProductModel from "../../models/product.model.js";


class ProductDao {
  // Obtener todos los productos

  async getAllProducts() {
    return await ProductModel.find();
  }

  async getAllProductsPaginate(req){
    const { page, limit } = req.query;
    return await ProductModel.paginate({},{
      page: page || 1,
      limit: limit || 10,
    });
  }

  // Obtener un producto por ID

  async getProductById(id) {
    return await ProductModel.findById(id);
  }

  // Crear un producto

  async createProduct(product) {
    return await ProductModel.create(product);
  }

  // Actualizar un producto

  async updateProduct(id, product) {
    return await ProductModel.findByIdAndUpdate(id, product);
  }

  // Eliminar un producto

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}

export default new ProductDao();