import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { UserModel } from "../models/user.model.js";
import { uploadOnCloudinar } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
  /* Steps -----------> */
  //get user detail from frontend
  //validation
  //check if user already exists  -username/email
  //check for images ,check for avatar
  //upload them to cloudinary ,avatar
  //create user object - create entry in DB
  //remove password and refresh token from response
  //check for user creation success
  //send response to frontend ,return response

  // console.log("User registration request received", req.body);
  const { username, email, password, fullname } = req.body;

  if (
    [fullname, username, email, password].some((field) => field.trim() === "")
  ) {
    throw new ApiError(400, "All Fields are required");
  }

  const existingUser = await UserModel.findOne({
    $or: [{ username }, { email }],
  });
  // console.log("existingUser", existingUser);
  if (existingUser) {
    throw new ApiError(409, "User already exists with this username/email");
  }
  // console.log("req.files", req.files, req.files.avatar?.[0]);

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // console.log("avatarLocalPath", avatarLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required");
  }

  let coverImagerLocalPath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagerLocalPath = req.files?.coverImage[0]?.path;
  }
  // Format email safely for folder path (replace @ and . to avoid issues)c
  const safeEmail = email.replace(/[@.]/g, "_");

  const avatarCloudinaryPath = await uploadOnCloudinar(
    avatarLocalPath,
    `chai_backend/user/${safeEmail}/avatar`
  );
  const coverImageCloudinaryPath = coverImagerLocalPath
    ? await uploadOnCloudinar(
        coverImagerLocalPath,
        `chai_backend/user/${safeEmail}/cover_image`
      )
    : null;
  // console.log("avatarCloudinaryPath", avatarCloudinaryPath);
  // console.log("coverImageCloudinaryPath", coverImageCloudinaryPath);
  if (!avatarCloudinaryPath) {
    throw new ApiError(400, "Avatar File is required");
  }
  const response = await UserModel.create({
    fullname,
    email,
    username: username.toLowerCase(),
    password,
    avatar: avatarCloudinaryPath.url,
    coverImage: coverImageCloudinaryPath?.url || null,
  });

  const createdUser = await UserModel.findById(response._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while Registering user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

export { registerUser };
