import  User  from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { cookieOptions } from '../config/config.js';
import { findUserByEmail } from '../dao/user.dao.js';

// functions to generate access and refresh tokens
const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            name: user.name,
            email: user.email,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

// function to register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await findUserByEmail(email);
        if(existingUser) {
            return res.status(400).json({
                message: "User already exists with given email! Kindly Login."
            });
        }

        const user = await User.create({ name, email, password });

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        res.status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshAccessToken, cookieOptions)
            .json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            accessToken,
            refreshToken,
        });
    } catch(error) {
        res.status(500).json({
            message: "Registration failed!",
            error: error.message
        })
    }
}

// function to login user
const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;

        const user = await findUserByEmail(email);
        if(!user) {
            return res.status(401).json({
                message: "No user exists with the email! Kindly Sign Up."
            });
        }

        // validate passsword
        const isMatch = await user.matchPassword(password);
        if(!isMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        user.refreshToken = refreshToken;
        await user.save();

        

        res.status(201)
            .cookie("accessToken", accessToken, cookieOptions)
            .cookie("refreshToken", refreshToken, cookieOptions)
            .json({
            user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(501).json({
            message: "Login failed!",
            error: error.message
        })
    }
}

const logoutUser = async(req, res) => {
    try {
        User.findByIdAndUpdate(req.user._id, 
            { $unset: {
                refreshToken: 1, // remove refreshToken field from user
                }, 
            }, { new: true });
        
        return res.status(202)
                    .clearCookie("accessToken", cookieOptions)
                    .clearCookie("refreshToken", cookieOptions)
                    .json({
                        message: "User logged out successfully!"
                    });
        
    } catch (error) {
        res.status(500).json({
            message: "Logout failed!",
            error: error.message
        })
        
    }
}

const refreshAccessToken = async(req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if(!incomingRefreshToken) {
        return res.status(400).json({ message: "Refresh token not found."});
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if(!user) {
            return res.status(401).json({ message: "Invalid refresh token"});
        }

        if(user.refreshToken !== incomingRefreshToken) {
            return res.status(402).json({ message: "Refresh token is expired"});
        }

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        return res.status(200)
                .cookie("accessToken", newAccessToken, cookieOptions)
                .cookie("refreshToken", newRefreshToken, cookieOptions)
                .json({
                    newAccessToken,
                    newRefreshToken,
                });
    } catch (error) {
        res.status(500).json({ 
            message: "Token refresh failed!",
            error: error.message
        });
    }
}

export { registerUser, loginUser, logoutUser, refreshAccessToken };