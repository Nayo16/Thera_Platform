const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

 exports.register= async (req , res) =>{
    try{
        const existingUser = await User.findOne({email});
        if (existingUser) return res.status(400).json({message:"User already exists"});

        const hashedPassword= await bcrypt.hash(password, 15);
    const newUser = await User.create({name, email, password:hashedPassword, role, specialization});
    res.status(201).json({message:"User is registered succesfully"});
        }
        catch(error) {
            res.status(500).json ({message:error.message});
        }
};

exports.login= async(req , res) =>{
    try{
        const {email , password} = req.body;

        const user = await User.findOne({email});
        if (!user) return res.status(404).json({message:"Invalid Credentials"});

        const isMatch = await bcrypt.compare(password , user.password);
        if(!isMatch) return res.status(400).json({message:"Invalid Credentials"});

        const token = jwt.sign({id: user._id, role:user.role},process.env.JWT_SECRET,{expiresIn:"1d" } );
         res.json({token, role:user.role});
         }
         catch(err) {
            res.status(500).json({message:err.message});
         }


};