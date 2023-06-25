import { PDF } from "../models/pdf.js";
import fs from "fs";

export const uploadPDF = (req, res) => {
    const pdfPath = 'C:/Users/diana/OneDrive/Desktop/contract_inchiriere.pdf'; // Replace with the actual PDF file path
  
    // Read the PDF file as binary data
    const pdfData = fs.readFileSync(pdfPath);
  
    // Create a new PDF document in the database
    const newPDF = new PDF({ data: pdfData });
  
    // Save the PDF document
    newPDF.save((err, savedPDF) => {
      if (err) {
        console.error('Failed to save PDF:', err);
        res.status(500).json({ error: 'Failed to save PDF' });
      } else {
        console.log('PDF saved successfully:', savedPDF);
        res.json({ message: 'PDF uploaded and saved successfully' });
      }
    });
  };
