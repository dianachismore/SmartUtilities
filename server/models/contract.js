import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const contractSchema = new mongoose.Schema({
    landlord: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    dataInchiriere: {
      type: String,
      required: true,
    },
    adresaApartament: {
      type: String,
      required: true,
    },
    componenteApartament: {
      type: String,
      required: true,
    },
    stareApartament: {
      type: String,
      required: true,
    },
    dataFinal: {
      type: String,
      required: true,
    },
    sumaChirie: {
      type: String,
      required: true,
    },
    numeProprietar:{
      type: String,
      required: true,
    },
    prenumeProprietar:{
      type: String,
      required: true,
    },
    domiciliuProprietar:{
      type: String,
      required: true,
    },
    serieIdProprietar:{
      type: String,
      required: true,
    },
    nrIdProprietar:{
      type: String,
      required: true,
    },
    numeChirias:{
      type: String,
      required: true,
    },
    prenumeChirias:{
      type: String,
      required: true,
    },
    domiciliuChirias:{
      type: String,
      required: true,
    },
    serieIdChirias:{
      type: String,
      required: true,
    },
    nrIdChirias:{
      type: String,
      required: true,
    },
  });
  
export const Contract = mongoose.model('Contract', contractSchema);