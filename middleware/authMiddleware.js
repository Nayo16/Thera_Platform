const jwt= require('jsonwebtoken');
const protect =(req , res , next) => { 
const token= request.headers.authorization?.split(" ")[1];
if (!token) return res.status(401).json({message:"Not Authorized"});

try {
 const decoded= jwt.verify(token , process.env.JWT_SECRET);
req.user= decoded;
next();
}
catch(err){
    res.status(401).json({message:"Invalid Token"});
}
};