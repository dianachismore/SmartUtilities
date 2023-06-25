import express from "express";
import {
  forgetPassword,
  getMyProfile,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
  updateProfile,
  verify,
  getAllApartmentNr,
  payRent,
  initiateOnboarding,
  saveUtilities,
  getPayments,
  getLandlordPayments,
  pushToken,
  verifyPassword
  // getUserContract,
  // saveModifiedContract
} from "../controllers/User.js";
import { isAuthenticated } from "../middleware/auth.js";

import {
  createPost,
} from "../controllers/Post.js";
const router = express.Router();


// import multer from 'multer';

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

// // User routes
// router.route('/getusercontract').get(getUserContract);

// // Contract routes
// router.route('/savemodifiedcontract').post(upload.single('contract'), saveModifiedContract);








router.route("/register").post(register);

router.route("/verify").post(isAuthenticated, verify);

router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/me").get(isAuthenticated, getMyProfile);

router.route("/updateprofile").put(isAuthenticated, updateProfile);
router.route("/updatepassword").put(isAuthenticated, updatePassword);
router.route("/verifypassword").post(isAuthenticated, verifyPassword);
router.route("/forgetpassword").post(forgetPassword);
router.route("/resetpassword").put(resetPassword);
router.route("/getallapartmentnr").get(getAllApartmentNr);
router.route("/payrent").post(isAuthenticated,payRent);
router.route("/saveutilities").post(isAuthenticated,saveUtilities);
router.route("/getpayments").get(isAuthenticated,getPayments);
router.route("/getlandlordpayments").get(isAuthenticated,getLandlordPayments);
router.route("/initiateonboarding").post(isAuthenticated, initiateOnboarding);
router.route("/pushtoken").post(isAuthenticated,pushToken);
// router.route("/newpost").post(isAuthenticated, addPost);

// router.route("/getallposts").get(getAllPosts);

// router
//   .route("/post/:postId")
//   .get(isAuthenticated, updatePost)
//   .delete(isAuthenticated, removePost);



export default router;
