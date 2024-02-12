import mongoose from "mongoose";

const mongoDBConnection = mongoose.connect(`mongodb+srv://guasgabriel22:FanoQ6mSsi7a1iwu@curso-backend-ch.j0ycecz.mongodb.net/entregaDB?retryWrites=true&w=majority`)
  .then(() => {
    console.log("MongoDB connected!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

export default mongoDBConnection;
