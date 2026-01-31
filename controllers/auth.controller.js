import User from "../models/user.js"
import appError from '../utils/appError.js';
import httpStatusText from '../utils/httpStatusText.js';
import { asyncWrapper } from "../utils/asyncHandler.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendEmail } from '../utils/sendEmails.js';
import { signUpTemp, password_reset } from "../utils/htmlTemplates.js"
import { generateActivationToken } from "../utils/genrateActivationToken.js";
import { generateJwtAndSetcookie } from "../utils/generate_jwt_cookie.js";
import Token from "../models/token.js";
import Randomstring from "randomstring";

const register = asyncWrapper(async (req, res, next) => {
    const { email, userName, password } = req.body;

    const existUser = await User.findOne({ email });

    if (existUser) return next(appError.create("User already exists", 400, httpStatusText.FAIL));
    const hashPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_ROUNDS));

    const activationToken = generateActivationToken(email);



    const confirmationlink = `http://localhost:3000/api/Auth/activate_account/${activationToken}`;

    const messageSent = await sendEmail({
        to: email,
        subject: "Activate Account",
        html: signUpTemp(confirmationlink),
    });

    if (!messageSent) return next(appError.create("someting want wrong", 400, httpStatusText.FAIL));

    await User.create({ ...req.body, password: hashPassword });

    return res.status(200).json({ success: true, message: "Check you email" })
});

const activateAccount = asyncWrapper(async (req, res, next) => {
    const { token } = req.params;

    const { email } = jwt.verify(token, process.env.JWT_SECRET_ACTIVATION);

    const user = await User.findOneAndUpdate({ email }, { isConfirmed: true });

    if (!user) return next(appError.create("user notfound ", 404, httpStatusText.FAIL));

    //create a cart @TODO 

    //send response
    return res.json({ success: true, message: "try to login" });
    // redirect to home page ot thanks page @TODO
});

const login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(appError.create("Email not found", 404, httpStatusText.FAIL));

    if (!user.isConfirmed) return next(appError.create("you should activate your account!", 400, httpStatusText.FAIL));

    const match = await bcrypt.compare(password, user.password);

    if (!match) return next("password dosent match", 400, httpStatusText.FAIL);

    const token = generateJwtAndSetcookie(res, user);

    await Token.create({
        token,
        user: user._id,
        agent: req.headers['user-agent'],
        expiredAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    /*
     isValid:true,
     agent:req.headers['user-agent'],
     expiredAt:new Date(Date.now()+7*24*60*60*1000)
     @TODO
     */
    return res.json({ success: true, results: { token } });
});

const forgetCode = asyncWrapper(async (req, res, next) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(appError.create("Email not found", 404, httpStatusText.FAIL));

    if (!user.isConfirmed) return next(appError.create("please activate your email first!", 400, httpStatusText.FAIL));

    const forgetcode = Randomstring.generate({
        length: 5,
        charset: 'numeric'
    });

    user.forgetcode = forgetcode;
    await user.save();

    const messageSent = await sendEmail({
        to: email,
        subject: "Reset password",
        html: password_reset(forgetcode),
    });

    if (!messageSent) return next(appError.create("someting want wrong", 400, httpStatusText.FAIL));

    return res.status(200).json({ success: true, message: "Check you email" })

});

const restPassword = asyncWrapper(async (req, res, next) => {
    const { email, password, forgetcode } = req.body;

    const user = await User.findOne({ email });

    if (!user) return next(appError.create("Email not found", 404, httpStatusText.FAIL));

    if (forgetcode !== user.forgetcode) return next(appError.create("invalid code !", 400, httpStatusText.FAIL));

    const hashPassword = await bcrypt.hash(
        password,
        parseInt(process.env.BCRYPT_ROUNDS));
    user.password = hashPassword;

    await user.save();

    await Token.updateMany(
        { user: user._id },
        { isValid: false }
    );



    // const tokens=await Token.find(({user:user._id}));

    // tokens.forEach(async(token)=>{
    //     token.isValid=false;
    //     await token.save();
    // });
    //redirect login frontend
    return res.json({ success: true, message: "try to login again" });
});

export { register, activateAccount, login, forgetCode, restPassword };