import multer from "multer";

//Save Files inside existing project  directory
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/temp");
  },
  filename: function (req, file, callback) {
    console.log("File Details ---> Multer Middleware -->", file);
    callback(null, file.originalname);
  },
});

export const upload = multer({ storage });
