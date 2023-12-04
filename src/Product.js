class Product {
    constructor(ID, title, description, code, price, status = true, stock, category, thumbnails) {
        this.ID = ID;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
    }
}

export default Product;
