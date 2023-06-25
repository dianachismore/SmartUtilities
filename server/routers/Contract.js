import express from "express";
import {
    createContract,
    getUserContract,
    scannId,
    getSumaChirie
} from "../controllers/Contract.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

router.route("/createcontract").post(isAuthenticated, createContract);
router.route("/scannid").post(isAuthenticated, scannId);
router.route("/getusercontract").get(isAuthenticated, getUserContract);
router.route("/getsumachirie").get(isAuthenticated, getSumaChirie);

export default router;