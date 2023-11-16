const express = require('express');
const productos = require('./productos.json');
const app = express();

app.get("/", (request, response) => {
    response.send(`
    <h1>Bienvenido!</h1>
    <a href="/productos"><button>ver productos</button></a>
    `)
})

app.get("/usuario", async (req, res) => {
    res.json({
        nombre: "Gabriel",
        apellido: "Guas",
        edad: 26,
        correo: "asdadad@gmail.com",
    });
});

app.get("/products", (req, res) => {
    try {
        const limit = parseInt(req.query.limit);

        if (!isNaN(limit) && limit > 0) {
            const limitedProducts = productos.slice(0, limit);
            res.json(limitedProducts);
        } else {
            res.json(productos);
        }
    } catch (error) {
        console.error('Error al procesar la solicitud', error);
        res.status(500).send('Error del sv');
    }
});

app.get("/products/:pid", (req, res) => {
    try {
        const productId = req.params.pid;
        const product = productos.find(p => p.ID == productId);

        if (product) {
            res.json(product);
        } else {
            res.status(404).send('Producto no encontrado :(');
        }
    } catch (error) {
        console.error('Error al procesar la solicitud', error);
        res.status(500).send('Error del sv');
    }
});


app.listen(8080, () => console.log("Server listening on port 8080"));