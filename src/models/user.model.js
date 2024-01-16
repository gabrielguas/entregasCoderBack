import mongoose from "mongoose";

const collection = "users";

const validRoles = ["usuario", "admin"];

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    rol: {
        type: String,
        enum: validRoles,
        default: "usuario"
    },
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String
});

const userModel = mongoose.model(collection, schema);

export default userModel;
