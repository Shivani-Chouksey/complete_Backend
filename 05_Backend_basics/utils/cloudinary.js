import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

// ⚠️ Add this line at the very top
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
})


export const uploadOnCloudinar = async (localFilePath, folderName = 'digital_salt_crud') => {
    try {
        console.log("cloudinary config -->", cloudinary.config());
        console.log("localFilePath : ", localFilePath);
        console.log("folderName : ", folderName);

        if (!localFilePath) {
            throw new Error("No file path provided")
        }

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
            folder: folderName
        })

        console.log("File uploaded successfully", response, response.url);
        fs.unlinkSync(localFilePath); // Delete the local file after upload
        return response;
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        fs.unlinkSync(localFilePath); // Delete the local file if upload fails
        throw error; // Rethrow the error to be handled by the caller
    }
}