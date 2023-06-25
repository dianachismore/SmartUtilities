import {addCard,getUserCards} from '../controllers/Card.js'
import { isAuthenticated } from "../middleware/auth.js";
import express from "express";

const router = express.Router();

router.route("/newcard").post(isAuthenticated, addCard);

// Route to get all cards for the logged-in user
router.route('/usercards').get(isAuthenticated, getUserCards);

export default router;