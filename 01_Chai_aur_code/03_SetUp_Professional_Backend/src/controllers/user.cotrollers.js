import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { UserModel } from "../models/user.model.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinar,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    const accessToken = user.generateAcessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error generating Refresh and Access tokens",
      error
    );
  }
};

/* Register Controller */
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

/* Login Controller  */
//get data from body
//check username and email
//find the user in DB
//check for password
// create acccess and refresh token
//send cookie
//send response to frontend
const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(400, "Username and email are required");
  }
  // if (!username || !email) {
  //   throw new ApiError(400, "Username and email are required");
  // }

  const ExistingUser = await UserModel.findOne({
    $or: [{ email }, { username }],
  });
  if (!ExistingUser) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await ExistingUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials");
  }
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    ExistingUser._id
  );
  // console.log("accessToken", accessToken);
  // console.log("refreshToken", refreshToken);

  const loggedInUser = await UserModel.findById(ExistingUser._id).select(
    "-password -refreshToken"
  );

  // Set the refresh token as a cookie in the response
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User Logged In Successfully"
      )
    );
});

/* Logout User */
const logOutUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  // const user = await UserModel.findByIdAndUpdate(
  //   userId,
  //   { $set: { refreshToken: undefined } },
  //   { new: true }
  // );

  const user = await UserModel.findById(userId);
  user.refreshToken = undefined;
  await user.save({ validateBeforeSave: false });

  // Set the refresh token as a cookie in the response
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully"));
});

//refresh access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingRefreshToken =
      req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      throw new ApiError(401, "Unauthorized request");
    }
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    console.log("decodedToken", decodedToken);

    const user = await UserModel.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid Refresh Token");
    }
    const options = {
      httpOnly: true,
      secure: true,
    };
    const { newRefreshToken, accessToken } =
      await generateAccessAndRefreshToken(user._id);
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access Token Refreshed Successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

// Change Current User Password
const changeCurrentUserPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and New Password are required");
  }
  const userId = req.user?._id;
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "Invalid Old Password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

// Get Current User
const currentUser = asyncHandler(async (req, res) => {
  res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User Fetched Successfully"));
});

//make seprate endpoint for file update -  professional approach
//update account details
const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError(400, "All are required");
  }
  const userId = req.user._id;
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { fullname, email: email } },
    { new: true }
  ).select("-password -refreshToken"); //  {new:true} will return the updated user object

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Account Detail Updated  Successfully")
    );
});

//update avatar
//make seprate endpoint for file update -  professional approach
const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar File is required");
  }

  //TODO-  utility for  Delete previous avatar from cloudinary
  if (req.user.avatar) {
    await deleteFromCloudinary(req.user.avatar);
  }
  const avatar = await uploadOnCloudinar(
    avatarLocalPath,
    `chai_backend/user/${req.user.email}/avatar`
  );
  if (!avatar.url) {
    throw new ApiError(400, "Error while uplaoding avatar");
  }

  const userId = req.user._id;
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password -refreshToken"); //  {new:true} will return the updated user object

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar Updated  Successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverLocalPath = req.file?.path;
  if (!coverLocalPath) {
    throw new ApiError(400, "Cover Image File is required");
  }

  const coverImage = await uploadOnCloudinar(
    coverLocalPath,
    `chai_backend/user/${req.user.email}/cover_image`
  );
  if (!coverImage.url) {
    throw new ApiError(400, "Error while uplaoding Cover Image");
  }

  const userId = req.user._id;
  const updatedUser = await UserModel.findByIdAndUpdate(
    userId,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password -refreshToken"); //  {new:true} will return the updated user object

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Cover Image Updated  Successfully")
    );
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentUserPassword,
  currentUser,
  updateAccountDetails,
  updateAvatar,
  updateUserCoverImage,
};
