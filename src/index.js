// Load environment variables from .env file
// require("dotenv").config({path:"./env"})
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

// Load environment variables from .env file
dotenv.config({
    path:"./env"
});

// Connect to MongoDB
connectDB()
.then(()=>{
    // Handle errors in the application
    app.on("error", (err) => {
        console.log("ERROR :", err);
        throw err;
    });

    // Start the server
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running at port : ${process.env.PORT}`);
    });
})
.catch((err) => {
    console.log("MONGODB CONNECTION FAILED",err);
});
