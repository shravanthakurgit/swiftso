
import validator from 'validator';
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import mongoose from 'mongoose';
import userModel from '../models/userModel.js';

import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import createRefreshToken from '../utils/createRefreshToken.js';
import createAccessToken from '../utils/createAccessToken.js';
import generateOTP from '../utils/generateOTP.js';
import sendOTPEmail from '../utils/sendOTPEmail.js';
import sendEmail from '../utils/sendEmail.js';
import addressModel from '../models/addressModel.js';

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET)
}




const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isProduction = process.env.NODE_ENV === 'production';

    const cookiesOption = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: '/'
    };

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User doesn't exist" });
    }

    if (!user.password) {
      return res.status(500).json({ success: false, message: "User has no password stored." });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (isMatched) {
      const accessToken = await createAccessToken(user._id); 
      const refreshToken = await createRefreshToken(user._id);

      res.cookie('accessToken', accessToken, cookiesOption);
      res.cookie('refreshToken', refreshToken, cookiesOption);

      return res.json({
        success: true,
        message: "Login Successfully",
        tokens: { accessToken, refreshToken }
      });
    }
    
    
    else {
      return res.status(401).json({ success: false, message: "Incorrect password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

  
  const registerUser = async (req, res) => {
  try {
    // console.log("Incoming request body:", req.body);

    const { first_name, last_name, email, password } = req.body;

    // 1. Check for required fields
    if (!first_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, email, and password are required.",
      });
    }

    // 2. Check for existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    // 3. Validate email
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // 4. Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    // 5. Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Save the user
    const newUser = await userModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    const save = await newUser.save()
    const verifyEmailUrl= `${process.env.FRONTEND_URL}verify-email?code=${save?._id}`;


    const accessToken = await createAccessToken(newUser._id); 
    const refreshToken = await createRefreshToken(newUser._id);



    const verifyEmail = await sendEmail({
      to: email,
      subject: "Please Verify Your Email",
      html: verifyEmailTemplate({
        name: first_name,
        url: verifyEmailUrl
      })
    })



    // 7. Generate token
    // const token = createToken(newUser._id);


     const cookiesOption = {
        httpOnly: true,
        secure : true,
        samesite: "None"
      }

      res.cookie('accessToken',accessToken,cookiesOption )
      res.cookie('refreshToken',refreshToken,cookiesOption )

  
    return res.status(201).json({ message:"Login SuccessFully" ,success: true, tokens: {
         accessToken, refreshToken }
      
      });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};



const verifyEmailController = async (req, res) => {
  try {
    const { code } = req.body;

    console.log("Incoming code for verification:", code);

  
    if (!mongoose.Types.ObjectId.isValid(code)) {
      return res.status(400).json({ success: false, message: "Invalid verification link or code." });
    }

    const user = await userModel.findOne({ _id: code });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired code." });
    }

    if (user.verified_email) {
      return res.status(200).json({ success: true, message: "Your email is already verified. " });
    }

    await userModel.updateOne({ _id: code }, { verified_email: true });

    return res.json({ success: true, message: "Email Verification Successfull. " });

  } catch (error) {
    console.error("Email verification error:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

 
  
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    // Validate admin credentials
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    ) {
      // Create a structured payload so the token can be verified easily
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' } // optional: set expiration
      );

      return res.json({ success: true, token });
    } else {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


 const productManageUser = async (req, res) => {
    res.json({ msg: 'Managing product as user/admin' });
  };

  const logoutController = async (req, res) => {
  try {
    const userId = req.userId;

    const isProduction = process.env.NODE_ENV === 'production';

    const cookiesOption = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: '/'
    };

    res.clearCookie('accessToken', cookiesOption);
res.clearCookie('refreshToken', cookiesOption);

    await userModel.findByIdAndUpdate(userId, {
      refresh_token: ""
    });

    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};



const updateUserDetails = async (req,res)=>{
  try {
    const userId = req.userId // auth middlewear
    const {first_name, last_name, mobile,gender} = req.body

    // let hashedPassword = ""

    // if(password){
    //   hashedPassword = await bcrypt.hash(password, 10);
    // }

    // if(!gender){
    //   return res.json({
    //   message : "Provide Gender ",
    //   success : false,
    //   error: false,
    // })
    // }

const updateFields = {};
    if (first_name !== undefined) updateFields.first_name = first_name;
    if (last_name !== undefined) updateFields.last_name = last_name;
    if (mobile !== undefined) updateFields.mobile = mobile;
    if (gender !== undefined) updateFields.gender = gender;

    const result = await userModel.updateOne({ _id: userId }, updateFields);

    return res.json({
      message : "Updated Successfully ",
      success : true,
      error: false,
      data : {
        result
      }
    })
  
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const forgotPassword = async (req,res) => {
  try {

    const {email} = req.body

    const user = await userModel.findOne({email})

    if(!user){
      return res.json({
        message: "Email not found ! ",
        success: false
      })
    }

    const otp = generateOTP();
    const expireTime = new Date(Date.now() + 10 * 60 * 1000);

    const update =await userModel.findByIdAndUpdate(user._id,
      {
        forgot_password_otp : otp,
        forgot_password_expiry : expireTime
      }
    )

     await sendOTPEmail({
      to: email,
      subject: "Swiftso Password Reset OTP",
      html: `
        <h3>Hello ${user.first_name || ''},</h3>
        <p>Your OTP for password reset is:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you did not request this, please ignore this email.</p>
        <br />
        <small>Swiftso Support</small>
      `,
    });

    return res.json({ success: true, message: "OTP sent to your email." });


    
  } catch (error) {
  console.error("Forgot Password Error:", error); // 👈 see actual error
  return res.status(500).json({ success: false, message: error.message || "Server error" });
}
};



const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Please Provide Email ! " });
    }

    if (!otp) {
      return res.status(400).json({ success: false, message: "Please Provide OTP" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }


    

 
    if (user.forgot_password_otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }


     if (user.forgot_password_expiry < new Date()) {
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    return res.json({ success: true, message: "OTP Verifed  SuccessFully. " });

  } catch (error) {
    console.error("Reset Error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
};
  


const resetPassword = async (req, res) => {
  try {
    const { email, newPassword, confirmPassword, otp } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email required." });
    }

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP required." });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({ success: false, message: "Please provide both New Password & Confirm Password." });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ success: false, message: "New Password and Confirm Password must match." });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }


    if( !user.forgot_password_expiry ||
      new Date(user.forgot_password_expiry) < new Date()){
        return res.status(401).json({ success: false, message: "Expired OTP." });
      }

    // ✅ Verify OTP
    if (
      user.forgot_password_otp !== otp
     
    ) {
      return res.status(401).json({ success: false, message: "Invalid OTP." });
    }

    

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await userModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      forgot_password_otp: "",
      forgot_password_expiry: null,
    });

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};



const removeUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Please provide an email",
      });
    }

    const deletedUser = await userModel.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


const getUserDetails = async (req, res) => {
  try {
    const userId = req.userId; 

    const user = await userModel.findById(userId)
  .select("first_name last_name email role avatar status verified_email mobile gender address") 
  .populate({
    path: "address",
    options: { sort: { createdAt: -1 } },
  })
  .populate("likedProduct");


    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};



const addAddress = async (req, res) => {

  try {
    const userId = req.userId;
    const addressData = req.body;
     console.log(addressData)


if(!userId){
   res.status(401).json({
      success: false,
      message: "UserId Required",
      addressData: addressData,
      address: newAddress
    });
}

    const newAddress = await addressModel.create({
      ...addressData,
      email: addressData.email || '',
    });

    await userModel.findByIdAndUpdate(userId, {
      $push: { address: newAddress._id }
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
       addressData: addressData,
      address: newAddress
    });
  } catch (err) {
    res.status(501).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};


const editAddress = async (req, res) => {

  try {
    const userId = req.userId;
    const {_id,name,
  address,
  address_2,
  city,
  state,
  country,
  pincode,
  phone,
  email,
  landmark} = req.body;


if(!userId ){
   res.status(401).json({
      success: false,
      message: "UserId Required",
    
    });
}

if(!_id ){
   res.status(401).json({
      success: false,
      message: "Provide Address Id",
    
    });
}

    const updateAddress = await addressModel.updateOne({_id:_id},{
  name,
  address,
  address_2,
  city,
  state,
  country,
  pincode,
  phone,
  email,
  landmark
    }) 
  // await userModel.findByIdAndUpdate(userId, {
  //   });

    res.status(201).json({
      success: true,
      message: "Address Updated Successfully",
      address: updateAddress
    });
  } catch (err) {
    res.status(501).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const getUser = async (req,res) =>{
  try {
    const users = await userModel.find({})
    return res.json({success: true, users})
  } catch (error) {
    res.status(500).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken =
      req.cookies.refreshToken || req?.headers?.authorization?.split(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({ message: "No Refresh Token or Invalid Refresh Token" });
    }

    const verifyToken = jwt.verify(refreshToken, process.env.REFRESH_SECRET);

    if (!verifyToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    const userId = verifyToken.userId;
    const newAccessToken = await createAccessToken(userId);

    const isProduction = process.env.NODE_ENV === 'production';

    const cookiesOption = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: '/',
    };

    res.cookie('accessToken', newAccessToken, cookiesOption);
    console.log("New Access Token Generated",)

    return res.json({
      success: true,
      message: "New Access Token Generated",
      accessToken: newAccessToken, 
    });
  } catch (error) {
    console.error("[REFRESH ERROR]:", error.message); // optional debug
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};


  export {
    loginUser,
    registerUser,
    adminLogin,
    productManageUser,
    verifyEmailController,
    logoutController,
    updateUserDetails,
    forgotPassword,
    verifyOTP,
    resetPassword,
    removeUser,
    getUserDetails,
    addAddress,
    getUser,
    refreshToken,
    editAddress,
  }

  