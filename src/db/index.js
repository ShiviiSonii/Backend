import mongoose from "mongoose";

// Importing the constant DB_NAME from the constants module.
import { DB_NAME } from "../constants.js";

/**
 * Asynchronous function to connect to the MongoDB database.
 */
const connectDB = async () => {
    try {
        // Connecting to the MongoDB database using the provided MONGODB_URI and DB_NAME.
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        
        // Logging a success message if the connection is established.
        console.log(`MONGODB CONNECTED !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        // Handling errors by logging an error message and exiting the process.
        console.log("MONGODB CONNECTION FAILED", error);
        process.exit(1);
    }
};

export default connectDB;
