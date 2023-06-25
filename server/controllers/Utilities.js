import {Utilities} from '../models/utilities.js'
import { User } from "../models/users.js";
import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51MMZMJArI5w1s2J0KpEkPDgb4FdSWDgrDazmZPLbvmcL9Jh9qMizNC1ywZtDb3IUBwpHHyNGSGyzTmxS2u6VoGWv00J7avWaBW');

export const updateUtilities = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    const month = new Date().getMonth() + 1;
    const year = new Date().getFullYear();
    
    const monthlyUtilities = await Utilities.findOneAndUpdate(
      { user: userId, month, year },
      { amount },
      { new: true, upsert: true, runValidators: true }
    );
    
    console.log('monthlyUtilities:', monthlyUtilities); // add logging statement
    
    res.status(200).json({ monthlyUtilities });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update monthly utilities' });
  }
}

export const getAmount = async (req, res) => {
  try {
    const userId = req.user._id; // assuming the logged-in user's ID is available in req.user.id
    const utilities = await Utilities.findOne({ user: userId });
    if (!utilities) {
      return res.status(404).json({ message: "Monthly utilities not found" });
    }
    const amount = utilities.amount;
    res.json({ amount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


export const adminDashboard = async (req, res) => {
  try {
    const utilities = await Utilities.find().populate('user', 'apartamentNr')
    res.json(utilities)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
}

export const updateAmountAfterPayment = async (req, res) => {
  try {
    // Find the monthly utility document for the current user and update the amount to 0
    await Utilities.findOneAndUpdate({ user: req.user._id }, { $set: { amount: 0 } });

    return res.status(200).json({ message: 'Amount updated to 0 successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getAllPayedUtilities = async (req, res) => {
  try {
    const renters = await User.find({ role: 'renter'});
    const payments = [];
    for (const renter of renters) {
      if (renter.utilities && renter.utilities.length > 0) {
        const utilityPayments = renter.utilities.map(utility => ({
          type: 'utility',
          amount: utility.amount,
          date: utility.date,
          apartmentNumber: renter.apartamentNr
        }));
        payments.push(...utilityPayments);
      }
    }
   // Sort the payments by date in descending order
   payments.sort((a, b) => b.date - a.date);
   res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the payments' });
  }}