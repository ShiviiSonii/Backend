// Importing cloudinary library and renaming it to 'cloudinary'
import { v2 as cloudinary } from "cloudinary";
// Importing file system library
import fs from "fs"

// Configuring cloudinary with credentials from environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
    api_key: process.env.CLOUDINARY_API_KEY , 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Function to upload file on Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    try {
        // Checking if localFilePath is provided
        if(!localFilePath) return null
        // Uploading file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type : "auto"
        })
        // Logging success message
        console.log("File uploaded successfully")
        fs.unlinkSync(localFilePath)
        // Returning response from Cloudinary
        return response
    } catch (error) {
        // If there's an error, delete the local file
        fs.unlinkSync(localFilePath)
        // Return null
        return null
    }
}

// Exporting the uploadOnCloudinary function
export { uploadOnCloudinary }
