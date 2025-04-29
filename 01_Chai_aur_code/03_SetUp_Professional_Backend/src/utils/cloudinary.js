import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinar = async (
  localFilePath,
  folderName = "default_folder"
) => {
  try {
    if (!localFilePath) {
      throw new Error("No file path provided");
    }
    //upload file to cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: folderName, // Specify the folder name in Cloudinary
    });
    // file is uploaded on cloudinary
    console.log("File uploaded successfully", response.url);
    fs.unlinkSync(localFilePath); // Delete the local file after upload
    return response;
  } catch (error) {
    console.error("Error uploading file to Cloudinary:", error.message);
    fs.unlinkSync(localFilePath); // Delete the local file if upload fails
    throw error; // Rethrow the error to be handled by the caller
  }
};

export { uploadOnCloudinar };
