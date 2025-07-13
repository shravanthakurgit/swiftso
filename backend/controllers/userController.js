
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
import dotenv from 'dotenv';
dotenv.config();

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



    
    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account is suspended. Contact support team.",
      });
    }

    if (user.status === "inactive") {
      return res.status(403).json({
        success: false,
        message: "Your account is inactive. Contact support team.",
      });
    }


    

    const isMatched = await bcrypt.compare(password, user.password);



    if (isMatched) {
    const accessToken = await createAccessToken(user);
const refreshToken = await createRefreshToken(user);


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
    const { first_name, last_name, email, password } = req.body;

    
    if (!first_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "First name, email, and password are required.",
      });
    }

    
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email.",
      });
    }

    
    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format.",
      });
    }

    // 4. Validate email domain
   const allowedDomains = [
  'gmail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'me.com',
  'protonmail.com',
  'proton.me',
  'proton.me',
  'zoho.com',
  'gmx.com',
  'mail.com',
  'aol.com',
  'fastmail.com',
  'yandex.com',
];

    const emailDomain = email.split('@')[1].toLowerCase();
    const isUniversityEmail =
      emailDomain.endsWith('.edu') ||
      emailDomain.includes('.ac.') ||
      emailDomain.includes('.edu.');

    const isAllowedDomain = allowedDomains.includes(emailDomain) || isUniversityEmail;

    if (!isAllowedDomain) {
      return res.status(400).json({
        success: false,
        message: "Email domain not allowed. Try another eg. gmail, outlook... etc",
      });
    }

    
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      first_name,
      last_name,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${savedUser._id}`;

    
    await sendEmail({
      to: email,
      subject: "Please Verify Your Email",
      html: verifyEmailTemplate({
        name: first_name,
        url: verifyEmailUrl,
      }),
    });

    // 10. Generate tokens
    const accessToken = createAccessToken(savedUser);
    const refreshToken = createRefreshToken(savedUser);

    // 11. Set cookies
    const cookiesOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };

    res.cookie("accessToken", accessToken, cookiesOptions);
    res.cookie("refreshToken", refreshToken, cookiesOptions);

    // 12. Return response
    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      success: true,
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
    });
  }
};

export default registerUser;





const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userModel.findOne({ email });

    const isEnvAdmin = (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASS
    );

    let role, userId, isPasswordValid = false;

    if (user) {
      isPasswordValid = await bcrypt.compare(password, user.password);
      role = user.role;
      userId = user._id;
    } else if (isEnvAdmin) {
      isPasswordValid = true;
      role = 'admin';
      userId = 'env-admin'; // placeholder ID
    }

    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const allowedRoles = ['admin', 'manager'];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({ success: false, message: "Access denied: not an admin" });
    }

    const payload = {
      userId,
      email,
      role
    };

    const token = jwt.sign(payload, process.env.ACCESS_SECRET, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '2h',
    });
    console.log(token)

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('[adminLogin error]', error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};




export const resendVerificationEmail = async (req, res) => {
  try {
    const userId = req.userId; // From auth middleware
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    if (user.verified_email) {
      return res.status(400).json({ success: false, message: "Email already verified." });
    }

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${user._id}`;

    await sendEmail({
      to: user.email,
      subject: "Verify Your Email Address",
      html: verifyEmailTemplate({
        name: user.first_name || "User",
        url: verifyEmailUrl,
      }),
    });

    res.status(200).json({ success: true, message: "Verification email sent." });
  } catch (error) {
    console.error("Error sending verification email:", error);
    res.status(500).json({ success: false, message: "Server error." });
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

    if (!verifyToken || !verifyToken.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid Refresh Token",
      });
    }

    
    const user = await userModel.findById(verifyToken.userId).select("email role _id");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const newAccessToken = await createAccessToken(user);

    const isProduction = process.env.NODE_ENV === 'production';

    const cookiesOption = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "None" : "Lax",
      path: '/',
    };

    res.cookie('accessToken', newAccessToken, cookiesOption);
    console.log("New Access Token Generated");

    return res.json({
      success: true,
      message: "New Access Token Generated",
      accessToken: newAccessToken,
    });

  } catch (error) {
    console.error("[REFRESH ERROR]:", error.message);
    res.status(500).json({
      success: false,
      message: error.message || "Something went wrong",
    });
  }
};





export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "user", "staff", "manager"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role provided." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.role = role;
    await user.save();

    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    console.error("Error updating user role:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { status } = req.body;

    const validStatuses = ["active", "inactive", "suspended"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status provided." });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.status = status;
    await user.save();

    res.status(200).json({ message: "User status updated successfully", user });
  } catch (err) {
    console.error("Error updating user status:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Server error" });
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

  