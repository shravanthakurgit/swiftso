import express from 'express';
import { loginUser,registerUser,adminLogin,productManageUser, verifyEmailController, logoutController, updateUserDetails, forgotPassword, verifyOTP, resetPassword, removeUser, getUserDetails, addAddress, getUser, refreshToken, editAddress } from '../controllers/userController.js';
import auth from '../middleware/auth.js';
import authAdmin from '../middleware/authAdmin.js';

const userRouter = express.Router();

userRouter.post('/register',registerUser)
userRouter.post('/verify-email', verifyEmailController)
userRouter.post('/auth', auth)
userRouter.post('/login',loginUser)
userRouter.post('/remove-user',authAdmin,removeUser)
userRouter.post('/admin',adminLogin)
userRouter.post('/product-manager',productManageUser)
userRouter.post('/logout',auth, logoutController)
userRouter.put('/update-user',auth, updateUserDetails)
userRouter.post('/forgot-password',forgotPassword)
userRouter.post('/verify-otp',verifyOTP)
userRouter.post('/reset-password',resetPassword)
userRouter.get("/profile", auth, getUserDetails);
userRouter.post("/add-address",auth, addAddress);
userRouter.put("/edit-address",auth, editAddress);
userRouter.get('/get-users', authAdmin, getUser)
userRouter.post('/refresh-token',refreshToken)

export default userRouter;