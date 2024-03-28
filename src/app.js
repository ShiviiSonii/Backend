// Importing the Express framework to create and manage the server.
import express from "express";

// Importing the CORS middleware to handle Cross-Origin Resource Sharing.
import cors from "cors";

// Importing the cookie-parser middleware to handle parsing cookies from incoming requests.
import cookieParser from "cookie-parser";

// Creating an instance of the Express application.
const app = express();

// Configuring CORS middleware to allow requests from specified origins and to support credentials.
app.use(cors({
    origin: process.env.CORS_ORIGIN, // Allows requests from specified origin (defined in environment variables).
    credentials: true // Allows credentials to be sent with the request (e.g., cookies).
}));

// Configuring Express middleware to parse incoming JSON requests and limit the payload size to 16kb.
app.use(express.json({
    limit: "16kb"
}));

// Configuring Express middleware to parse incoming URL-encoded data and limit the payload size to 16kb.
app.use(express.urlencoded({
    extended: true, // Allows parsing of URL-encoded data with rich objects and arrays.
    limit: "16kb"
}));

// Serving static files from the "public" directory.
app.use(express.static("public"));

// Configuring Express to use the cookie-parser middleware for parsing cookies from incoming requests.
app.use(cookieParser());


import userRouter from "./routes/user.routes.js"

// routes declaration
app.use("/api/v1/users", userRouter)

export default app;
