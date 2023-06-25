import { User } from "../models/users.js";
import { Utilities } from "../models/utilities.js";
import { sendMail } from "../utils/sendMail.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";
import fs from "fs";
import * as mindee from "mindee";
import Stripe from 'stripe';
import { PDFDocument, StandardFonts } from'pdf-lib';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51MMZMJArI5w1s2J033D9QDT6VOhEU2bpWxNMxR0vXh2ZY8PuJdojSTzjzGk8eAll4kmBeP0oDPubEvVLn07WnrBT00zVrtMG7w";
const Secret_key = "sk_test_51MMZMJArI5w1s2J0KpEkPDgb4FdSWDgrDazmZPLbvmcL9Jh9qMizNC1ywZtDb3IUBwpHHyNGSGyzTmxS2u6VoGWv00J7avWaBW"
const stripe = new Stripe('sk_test_51MMZMJArI5w1s2J0KpEkPDgb4FdSWDgrDazmZPLbvmcL9Jh9qMizNC1ywZtDb3IUBwpHHyNGSGyzTmxS2u6VoGWv00J7avWaBW');


export const register = async (req, res) => {
  try {
    const { name, email, password, apartamentNr, role } = req.body;

    let user = await User.findOne({ email });
    let stripeAccount;
    let customer;

    if (user) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    // Create a Stripe account for the landlord
    if(role === 'landlord'){
      stripeAccount = await stripe.accounts.create({
        email: email,
        country: 'RO',
        type: 'custom',
        capabilities: {card_payments: {requested: true}, transfers: {requested: true}},
        business_type: 'individual',
        business_profile: {url: 'https://www.linkedin.com/feed/'},
      });
    }
    if(role === 'renter'){
      customer = await stripe.customers.create({
        description: `Customer created for ${name}`,
        email: email,
        balance: '10000000'
      });
    }

    // // Create a Stripe account link for the user's onboarding process
    // const accountLink = await stripe.accountLinks.create({
    //   account: stripeAccount.id,
    //   refresh_url: 'http://127.0.0.1:5000/api/v1/register',
    //   return_url: 'http://127.0.0.1:5000/api/v1/register',
    //   type: 'account_onboarding',
    // });


    const otp = Math.floor(Math.random() * 1000000);

    if(req.body.avatar) {
      const avatar = req.files.avatar.tempFilePath;
      const mycloud = await cloudinary.v2.uploader.upload(avatar);
      fs.rmSync("./tmp", { recursive: true });
    }
    else {
      var mycloud = {public_id:"60111_epj0kr", secure_url:"https://res.cloudinary.com/dhqzw4noh/image/upload/v1672901281/60111_epj0kr.jpg"};
    }

    var contract = {
      public_id:"contract_inchiriere_suqcdo",
      url:"https://res.cloudinary.com/dhqzw4noh/image/upload/v1673459720/contract_inchiriere_suqcdo.pdf",
      stage: 0,
      expiryDate: null
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
      apartamentNr,
      role,
      stripeAccountId: stripeAccount ? stripeAccount.id : undefined, // Add the stripeAccountId to the user document
      customer: customer ? customer.id : undefined,
      contract,
      otp,
      otp_expiry: new Date(Date.now() + process.env.OTP_EXPIRE * 60 * 1000),
    });
    const username = name.split(' ');


    if(role === 'renter'){
      // Update utilities with the user's information
      await Utilities.create({
        user: user._id,
        amount: 0,
        month: new Date().getMonth() + 1, // Get the current month
        year: new Date().getFullYear()
      });
    }

    if(role === 'landlord'){
      stripeAccount = await stripe.accounts.update(
        stripeAccount.id,
        {
          metadata: {order_id: '6735'},
          company: {
          address: {
            city: 'Jud. AR Sat. Maderat (Ors. Pancota)',
            country: 'RO',
            line1: 'nr. 396',
            line2: null,
            postal_code: '315601',
            state: null
          }},
          individual: {
            email: email,
            first_name: username[0],
            last_name: username[1],
            phone: '+49 89 416115623',
            dob:{
              day: 17,
              month: 2,
              year: 2001
            }
          },
          tos_acceptance:{
            date: Math.floor(Date.now() / 1000),
            ip: req.connection.remoteAddress
          },
          business_profile:{
            mcc: '5817',
            product_description: 'IT'
          },
          external_account: {
            object: 'bank_account',
            account_holder_name: name,
            account_holder_type: 'individual',
            routing_number: 'INGBROBU',
            account_number: 'RO49AAAA1B31007593840000',
            country: 'RO',
            currency: 'ron',
          },
        })
      }

    await sendMail(email, "Verify your account", `Your OTP is ${otp}`);

    sendToken(
      res,
      user,
      201,
      "OTP sent to your email, please verify your account"
    );
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verify = async (req, res) => {
  try {
    const otp = Number(req.body.otp);

    const user = await User.findById(req.user._id);

    if (user.otp !== otp || user.otp_expiry < Date.now()) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP or has been Expired" });
    }

    user.verified = true;
    user.otp = null;
    user.otp_expiry = null;

    await user.save();

    return res
        .status(200)
        .json({ success: false, message: "Account Verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    return sendToken(res, user, 200, "Login Successful");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    return res
      .status(200)
      .cookie("token", null, {
        expires: new Date(Date.now()),
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    sendToken(res, user, 201, `Welcome back ${user.name}`);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { name } = req.body;
    const avatar = req.files.avatar.tempFilePath;

    if (name) user.name = name;
    if (avatar) {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const mycloud = await cloudinary.v2.uploader.upload(avatar);

      fs.rmSync("./tmp", { recursive: true });

      user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      };
    }
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Profile Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Old Password" });
    }

    user.password = newPassword;

    await user.save();

    return res
      .status(200)
      .json({ success: true, message: "Password Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid Email" });
    }

    const otp = Math.floor(Math.random() * 1000000);

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpiry = Date.now() + 10 * 60 * 1000;

    await user.save();

    const message = `Your OTP for reseting the password ${otp}. If you did not request for this, please ignore this email.`;

    await sendMail(email, "Request for Reseting Password", message);

    return res.status(200).json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordOtp: otp,
      resetPasswordExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Otp Invalid or has been Expired" });
    }
    user.password = newPassword;
    user.resetPasswordOtp = null;
    user.resetPasswordExpiry = null;
    await user.save();

    return res
      .status(200)
      .json({ success: true, message: `Password Changed Successfully` });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("+password");

    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter the password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Password" });
    }

    // return res
    //   .status(200)
    //   .json({ success: true, message: "Correct Password" });
    return sendToken(res, user, 200, "Correct Password");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// export const addPost = async (req, res) => {
//   try {
//     const { image, description } = req.body;
//     const user = await User.findById(req.user._id);

//     user.posts.push({
//       image,
//       description,
//       createdAt: new Date(Date.now()),
//     });

//     await user.save();

//     res.status(200).json({ success: true, message: "Post added successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const getAllPosts = async (req, res) => {
//   try{
//     const posts = await User.find();
//     if(posts){
//       res.status(200).send(posts);
//     }
//     else{
//       res.status(404).json({success: false, message: "Fail"});
//     }
//   }
//   catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }

// }

// export const removePost = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const user = await User.findById(req.user._id);

//     user.posts = user.posts.filter(
//       (post) => post._id.toString() !== postId.toString()
//     );

//     await user.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Post removed successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const updatePost = async (req, res) => {
//   try {
//     const { postId } = req.params;

//     const user = await User.findById(req.user._id);

//     user.post = user.posts.find(
//       (post) => post._id.toString() === postId.toString()
//     );

//     user.post.completed = !user.post.completed;

//     await user.save();

//     res
//       .status(200)
//       .json({ success: true, message: "Post Updated successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// export const addCard = async (req, res) => {
//   try {
//     const { number, expiry, cvc, cardholder } = req.body;
//     const user = await User.findById(req.user._id);

//     user.cards.push({
//       number,
//       expiry,
//       cvc,
//       cardholder
//     });

//     await user.save();

//     res.status(200).json({ success: true, message: "Card added successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// // Controller to get all cards for the logged-in user
// export const getUserCards = async (req, res) => {
//   try {
//     // Find the user by ID and populate their cards array
//     const user = await User.findById(req.user._id).populate('cards');

//     // If the user is not found, return a 404 error
//     if (!user) {
//       return res.status(404).json({ success: false, message: 'User not found' });
//     }

//     // Return the user's cards array
//     return res.status(200).json({ success: true, cards: user.cards });
//   } catch (error) {
//     // If there was an error, return a 500 error
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };


export const getAllApartmentNr = async (req, res) => {
  try {
    const users = await User.find({}, 'apartamentNr');
    const apartmentNumbers = users.map(user => user.apartamentNr);
    res.json(apartmentNumbers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

export const initiateOnboarding = async(req, res) => {
  try {
    const { CONNECTED_ACCOUNT_ID } = req.user.stripeAccountId; 
    
    const accountLink = await stripe.accountLinks.create({
      account: CONNECTED_ACCOUNT_ID,
      refresh_url: 'myappconnect://onboarding-complete',
      return_url: 'myappconnect://onboarding-complete',
      type: 'account_onboarding',
    });

    // Return the account link URL to the client
    res.json({ url: accountLink.url });

    // Additional logic or UI updates can be performed here

  } catch (error) {
    // Handle any errors that occur during the process
    console.error(error);
    res.status(500).json({ error: 'An error occurred during onboarding' });
  }
}

export const payRent = async (req, res) => {
  const { amount } = req.body;
  // const { Expo } = require('expo-server-sdk');

  // Create an instance of Expo
  // const expo = new Expo();

  try {
    // Get the currently logged-in user
    const currentUser = req.user; // Assuming you have middleware to authenticate and set the logged-in user in the 'req.user' property

    // Find the landlord user with the same apartamentNr
    const landlord = await User.findOne({
      apartamentNr: currentUser.apartamentNr,
      role: 'landlord',
    });

    if (!landlord) {
      return res.status(404).json({ error: 'Landlord not found.' });
    }

    // Create a payment method for the customer's account
    const paymentMethod = await stripe.paymentMethods.create({
      type: 'card',
      card: {
        number: '4242424242424242', // Replace with an actual card number
        exp_month: 12,
        exp_year: 2023,
        cvc: '123',
      },
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'ron',
      customer: currentUser.customer,
      payment_method: paymentMethod.id,
      confirm: true,
      transfer_data: {
        destination: landlord.stripeAccountId, // Use the stripeAccountId of the landlord user
      },
    });
      
        // Update the user's rents field
        currentUser.rents.push({
          amount: amount,
          date: new Date(),
        });
    await currentUser.save();

    res.json({ paymentIntent });
        
    // After a successful payment
    // const messages = [
    //   {
    //     to: landlord.expoPushToken, // Retrieve the landlord's expoPushToken from the landlord's user record
    //     sound: 'default',
    //     title: 'Rent Payment Received',
    //     body: `You have received a rent payment of ${amount} RON.`,
    //   },
    // ];

    // Send the notification to the landlord
    // await expo.sendPushNotificationsAsync(messages);


  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ error: 'Payment failed.' });
  }
};


export const saveUtilities = async (req, res) => {
  const { amount } = req.body;

  try {
    // Fetch the user document
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create a new payment object
    const payment = {
      amount: amount,
      date: new Date()
    };

    // Update the user's document to push the new payment to the utilities array
    user.utilities.push(payment);
    await user.save();

    res.status(200).json({ message: 'Payment saved successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while saving the payment' });
  }
};


export const getPayments = async (req, res) => {
  try {
    const currentUser = req.user;
    
    // Fetch the user document
    const user = await User.findById(currentUser._id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve rents and utilities
    const rents = user.rents.map(rent => ({
      type: 'rent',
      amount: rent.amount,
      date: rent.date
    }));

    const utilities = user.utilities.map(utility => ({
      type: 'utility',
      amount: utility.amount,
      date: utility.date
    }));

    // Combine rents and utilities into a single array
    const payments = [...rents, ...utilities];

    // Sort the combined array by date in descending order
    payments.sort((a, b) => b.date - a.date);

    res.json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the payments' });
  }
};


export const getLandlordPayments = async (req, res) => {
  try {
    const currentUser = req.user;

    // Verify if the current user is a landlord
    if (currentUser.role !== 'landlord') {
      return res.status(403).json({ error: 'Access denied. Only landlords can access this resource.' });
    }

    // Find the landlord's user document
    const landlord = await User.findById(currentUser._id);

    if (!landlord) {
      return res.status(404).json({ error: 'Landlord not found' });
    }

    // Find the apartment number of the landlord
    const landlordApartmentNumber = landlord.apartamentNr;

    // Find all renters with the same apartment number
    const renters = await User.find({ role: 'renter', apartamentNr: landlordApartmentNumber });
   // Retrieve payments made by the renters
   const payments = [];

   for (const renter of renters) {
     if (renter.rents && renter.rents.length > 0) {
       const rentPayments = renter.rents.map(rent => ({
         type: 'rent',
         amount: rent.amount,
         date: rent.date
       }));

       payments.push(...rentPayments);
     }

     if (renter.utilities && renter.utilities.length > 0) {
       const utilityPayments = renter.utilities.map(utility => ({
         type: 'utility',
         amount: utility.amount,
         date: utility.date
       }));

       payments.push(...utilityPayments);
     }
   }

   // Sort the payments by date in descending order
   payments.sort((a, b) => b.date - a.date);

   res.json({ payments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the payments' });
  }
  
  }

export const pushToken =  async (req, res) => {
    const { expoPushToken } = req.body;
  
    // Assuming you have a User model
    try {
      // Find the landlord user by apartment number
      const landlord = await User.findOne({ apartamentNr: req.user.apartamentNr });
  
      if (!landlord) {
        return res.status(404).json({ error: 'Landlord not found.' });
      }
  
      // Update the landlord's expoPushToken field
      landlord.expoPushToken = expoPushToken;
      await landlord.save();
  
      res.status(200).json({ message: 'Push token updated successfully' });
    } catch (error) {
      console.error('Error updating push token:', error);
      res.status(500).json({ error: 'Failed to update push token.' });
    }
  }
  






//   // Route to save the modified contract
// router.post('/api/contract', upload.single('contract'), async (req, res) => {
//   try {
//     const { numeProprietar, prenumeProprietar } = req.body;
//     const contractBuffer = req.file.buffer;

//     // Read the contract PDF
//     const pdfDoc = await PDFDocument.load(contractBuffer);
//     const pages = pdfDoc.getPages();

//     // Replace keywords with user input
//     pages.forEach((page) => {
//       const { width, height } = page.getSize();
//       const fontSize = 12;

//       page.drawText(numeProprietar, {
//         x: width * 0.4,
//         y: height * 0.7,
//         size: fontSize,
//         font: StandardFonts.Helvetica,
//       });

//       page.drawText(prenumeProprietar, {
//         x: width * 0.4,
//         y: height * 0.65,
//         size: fontSize,
//         font: StandardFonts.Helvetica,
//       });
//     });

//     // Save the modified contract to Cloudinary
//     const modifiedContractBuffer = await pdfDoc.save();
//     const result = await cloudinary.uploader.upload_stream({
//       resource_type: 'raw',
//     }, (error, result) => {
//       if (error) {
//         console.log('Error uploading modified contract:', error);
//         res.status(500).json({ error: 'Failed to upload modified contract' });
//       } else {
//         const modifiedContractUrl = result.url;
//         res.json({ modifiedContractUrl });
//       }
//     }).end(modifiedContractBuffer);
//   } catch (error) {
//     console.log('Error saving contract:', error);
//     res.status(500).json({ error: 'Failed to save contract' });
//   }
// });




















// export const getUserContract = async (req, res) => {
//   try {
//     const user = await User.findOne({ _id: req.user._id }); // Assuming you have authentication middleware that sets req.userId
//     res.json({ contract: user.contract });
//   } catch (error) {
//     console.log('Error fetching user data:', error);
//     res.status(500).json({ error: 'Failed to fetch user data' });
//   }
// };


// // Controller for saving the modified contract
// export const saveModifiedContract = async (req, res) => {
//   try {
//     const { numeProprietar, prenumeProprietar } = req.body;
//     const contractBuffer = req.file.buffer;

//     // Read the contract PDF
//     const pdfDoc = await PDFDocument.load(contractBuffer);
//     const pages = pdfDoc.getPages();

//     // Search for and replace the keywords on each page
// // Search for and replace the keywords on each page
// pages.forEach((page) => {
//   const { width, height } = page.getSize();
//   const fontSize = 12;
//   const keyword1 = 'numeProprietar';
//   const keyword2 = 'prenumeProprietar';

//   const text = page.getText();
//   const keyword1Index = text.indexOf(keyword1);
//   const keyword2Index = text.indexOf(keyword2);

//   if (keyword1Index !== -1) {
//     const keyword1Position = page.getOperators().find(op => op.fn === 'Tj' && op.args[0].startsWith(keyword1));
//     const keyword1Y = keyword1Position.args[1];
//     page.drawText(numeProprietar, {
//       x: 0,
//       y: keyword1Y - fontSize - 5, // Adjust the -5 value to fine-tune the vertical position
//       size: fontSize,
//       font: StandardFonts.Helvetica,
//     });
//   }

//   if (keyword2Index !== -1) {
//     const keyword2Position = page.getOperators().find(op => op.fn === 'Tj' && op.args[0].startsWith(keyword2));
//     const keyword2Y = keyword2Position.args[1];
//     page.drawText(prenumeProprietar, {
//       x: 0,
//       y: keyword2Y - fontSize - 5, // Adjust the -5 value to fine-tune the vertical position
//       size: fontSize,
//       font: StandardFonts.Helvetica,
//     });
//   }
// });


//     // Save the modified contract to Cloudinary
//     const modifiedContractBuffer = await pdfDoc.save();
//     const result = await cloudinary.uploader.upload_stream(
//       { resource_type: 'raw' },
//       (error, result) => {
//         if (error) {
//           console.log('Error uploading modified contract:', error);
//           res.status(500).json({ error: 'Failed to upload modified contract' });
//         } else {
//           const modifiedContractUrl = result.url;
//           res.json({ modifiedContractUrl });
//         }
//       }
//     ).end(modifiedContractBuffer);
//   } catch (error) {
//     console.log('Error saving contract:', error);
//     res.status(500).json({ error: 'Failed to save contract' });
//   }
// };


