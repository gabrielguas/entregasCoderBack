const socket = io();
console.log("Hola desde el cliente ;)");
socket.emit("message", "Mensaje desde el cliente");

socket.on("sendProducts", (data) => {
    console.log(data);
    const newList = document.getElementById("products")
    newList.innerHTML = "";
    data.forEach(prod => {
        newList.innerHTML += `<strong>ID:</strong> ${prod.ID}<br>`;
        newList.innerHTML += `<strong>Title:</strong> ${prod.title}<br>`;
        newList.innerHTML += `<strong>Description:</strong> ${prod.description}<br>`;
        newList.innerHTML += `<strong>Price:</strong> ${prod.price}<br>`;
        newList.innerHTML += `<strong>Stock:</strong> ${prod.stock}<br><br>`;
    });
})

const btnAdd = document.querySelector("#addProduct")
btnAdd.addEventListener("click", (e) => {
    e.preventDefault()
    const newProduct = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        code: document.getElementById("code").value,
        price: parseFloat(document.getElementById("price").value),
        status: true,
        stock: parseInt(document.getElementById("stock").value),
        category: document.getElementById("category").value,
        thumbnails: [document.getElementById("thumbnails").value]
    };
    socket.emit("newProduct", newProduct)
})

const btnDelete = document.querySelector("#deleteProduct")
btnDelete.addEventListener("click", (e) => {
    e.preventDefault()
    const idDelete = document.getElementById("productId").value
    socket.emit("deleteProduct", idDelete)
})
