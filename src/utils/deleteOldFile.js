import fs from "fs"

// Utility function to delete a file synchronously
const deleteFile = (filePath) => {
    try {
        fs.unlinkSync(filePath);
        console.log(`File ${filePath} deleted successfully.`);
    } catch (err) {
        console.error(`Error deleting file ${filePath}:`, err);
    }
};

export {deleteFile}
