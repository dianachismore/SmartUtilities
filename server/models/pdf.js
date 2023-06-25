import mongoose from 'mongoose';

const pdfSchema = new mongoose.Schema({
  data: Buffer, // Binary data of the PDF file
});

export const PDF = mongoose.model('PDF', pdfSchema);

