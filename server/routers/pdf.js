import express from "express";
const router = express.Router();
import {uploadPDF} from '../controllers/pdf.js'

// Define the route for PDF file upload
router.route('/uploadpdf').post(uploadPDF);


export default router;