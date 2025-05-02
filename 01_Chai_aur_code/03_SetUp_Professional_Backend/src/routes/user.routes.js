import { Router } from "express";
import {
  changeCurrentUserPassword,
  currentUser,
  getUserChannelProfile,
  getUserWatchHistory,
  loginUser,
  logOutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateUserCoverImage,
} from "../controllers/user.cotrollers.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", loginUser);

/* Refresh token */
router.post("/refresh-token", refreshAccessToken);

/* Secured Routes */
router.post("/logout", verifyJWT, logOutUser);
router.post("/change-password", verifyJWT, changeCurrentUserPassword);
router.get("/current-user", verifyJWT, currentUser);
router.patch("/update-account", verifyJWT, updateAccountDetails);
router.patch(
  "/update-avatar",
  verifyJWT,
  upload.single("avatar"),
  updateAvatar
);
router.patch(
  "/update-cover-image",
  verifyJWT,
  upload.single("/coverImage"),
  updateUserCoverImage
);
router.get("/user-channel-profile/:username", verifyJWT, getUserChannelProfile);
router.get("/watch-history", verifyJWT, getUserWatchHistory);

export default router;
