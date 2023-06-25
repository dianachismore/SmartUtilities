import { 
    updateUtilities, 
    adminDashboard, 
    getAmount, 
    updateAmountAfterPayment, 
    getAllPayedUtilities
} from '../controllers/Utilities.js'
import { isAuthenticated } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.route("/updateutilities").put(isAuthenticated, updateUtilities);
router.route("/getamount").get(isAuthenticated,getAmount);
router.route("/admindashboard").get(adminDashboard)
router.route("/updateamountafterpayment").put(isAuthenticated, updateAmountAfterPayment);
router.route("/getallpayedutilities").get(getAllPayedUtilities);

export default router;