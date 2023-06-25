import { Card } from "../models/card.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import fs from "fs";
import * as mindee from "mindee";

export const addCard = async (req, res) => {
    try {
      const { number, expiry, cvc, cardholder } = req.body;
      const cardFields ={
        number,
        expiry,
        cvc,
        cardholder,
        owner: req.user._id,
      }

      if (!number || !expiry || !cvc || !cardholder) {
        return res.json({ error: 'Please add all the fields!' });
      }
      const newCard = new Card(cardFields);
      await newCard.save();

      return res.status(200).json({ success: true, message: "Card added successfully" });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
  
// Define a controller function to get all cards of a user
export const getUserCards = async(req, res) => {
    try {
      // Find all cards associated with the user
      const cards = await Card.find({ owner: req.user._id });
  
      // Return the cards as a response
      return res.json(cards);
    } catch (error) {
      return res.status(500).json({ message: 'Server Error' });
    }
  };