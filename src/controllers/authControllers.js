const jwt = require('jsonwebtoken');
const {validationResult}  = require('express-validator');
const User = require('../models/User');

const generateAccessToken = (user) => {
    console.log('secetPrivKey', process.env.JWT_SECRET)
    return jwt.sign({
        id: user._id,
        roles: user.roles,
    },
    process.env.JWT_SECRET,
    {expiresIn: '55m'}
    )
}

const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user._id,
        roles: user.roles,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {expiresIn: '7d'}
    )
}

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }

        const {username, email, password} = req.body;
        let existingUser = await User.findOne({$or: [{username}, {email}]});
        if(existingUser){
            return res.status(400).json({message: 'Username or email already in use'});
        }
        const newUser = new User({username, email, password});
        await newUser.save();

        const accessToken = generateAccessToken(newUser);
        const refreshToken = generateRefreshToken(newUser);

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                roles: newUser.roles,
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({message: 'Server error during registration'});
        
    }
}

exports.login = async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        if(!user){
            return res.status(400).json({message: 'Invalid username '});
        }
        const copmparePassword = await user.comparePassword(password);
        if(!copmparePassword){
            return res.status(400).json({message: 'Invalid password'});
        }
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        user.refreshTokens = refreshToken;
        await user.save();

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                roles: user.roles,
            }
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({message: 'Server error during login'});
        
    }
}


exports.logout = async (req, res) => {
    try {
        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(400).json({message: 'Refresh token is required'});
        }
        const user = await User.findOne({refreshTokens: refreshToken});
        if(user){
            user.refreshTokens = null;
            await user.save();
           
        }

        res.status(200).json({message: 'Logout successful'});


        
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({message: 'Server error during logout'});
        
    }
}


exports.refreshToken = async (req, res) => {
    try{
        const {refreshToken} = req.body;
        if(!refreshToken){
            return res.status(400).json({message: 'Refresh token is required'});
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decoded.id);
        if(!user || user.refreshTokens !== refreshToken){
            return res.status(401).json({message: 'Invalid refresh token'});
        }
        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);
        user.refreshTokens = newRefreshToken;
        await user.save();
        res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });


    }catch(error){
        console.error('Refresh token error:', error);
        res.status(500).json({message: 'Server error during token refresh'});
    }
}