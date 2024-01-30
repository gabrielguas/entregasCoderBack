import mongoose from "mongoose";

const collection = "users";
const validRoles = ["user", "admin"];

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
        required: true // Añadir validación de campo obligatorio
    },
    age: Number,
    password: {
        type: String,
        required: true // Añadir validación de campo obligatorio
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carts' // Asumiendo que tienes un modelo de Carts
    },
    role: {
        type: String,
        enum: validRoles,
        default: "user" // Cambiar a 'user' en lugar de 'usuario'
    },
    loggedBy: String
});

const userModel = mongoose.model(collection, schema);

export default userModel;
