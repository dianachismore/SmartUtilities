import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const cardSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true
    },
    expiry: {
        type: String,
        required: true
    },
    cvc: {
        type: Number,
        required: true
    },
    cardholder: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

export const Card = mongoose.model("Card", cardSchema);
