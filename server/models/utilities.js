import mongoose from "mongoose";

const monthlyUtilitiesSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
    month: {
      type: Number,
      required: true
    },
    year: {
      type: Number,
      required: true
    }
  });

export const Utilities = mongoose.model("Utilities", monthlyUtilitiesSchema);