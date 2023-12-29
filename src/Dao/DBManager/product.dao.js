import ProductModel from "../../models/product.model.js";


class ProductDao {
  // Obtener todos los productos

  async getAllProducts() {
    return await ProductModel.find();
  }
 // Esto está bien hacerlo acá, o debería hacerlo en product.router para delegar responsabilidades???
  async getAllProductsPaginate(req) {
    const { page, limit, query, sort } = req.query;
    let filter = {};
    let sortOption = {};
  
    if (query) {
      filter = {
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
        ],
      };
    }
  
    if (sort) {
      if (sort.toLowerCase() === 'asc') {
        sortOption = { price: 1 }; //1 para Ascendente
      } else if (sort.toLowerCase() === 'desc') {
        sortOption = { price: -1 }; // -1 para Descendente
      }
    }
  
    return await ProductModel.paginate(filter, {
      page: page || 1,
      limit: limit || 10,
      sort: sortOption,
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

// const response = {
//   status: "success",
//   payload: products.docs,
//   totalPages: products.totalPages,
//   prevPage: products.prevPage,
//   nextPage: products.nextPage,
//   page: products.page,
//   hasPrevPage: products.hasPrevPage,
//   hasNextPage: products.hasNextPage,
//   prevLink: products.hasPrevPage ? `/api/products?page=${products.prevPage}` : null,
//   nextLink: products.hasNextPage ? `/api/products?page=${products.nextPage}` : null
// };