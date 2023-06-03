const router = require("express").Router();
const User= require("../models/User");
const cryptoJs=require("crypto-js");
const jwt=require("jsonwebtoken");

//REGISTER
router.post("/register",async(req,res)=>
{
     const newUser= new User({
        username: req.body.username,
        companyName:req.body.companyName,
        email:req.body.email,
        password:cryptoJs.AES.encrypt( 
            req.body.password,process.env.Pass_sec)
            .toString(),
        Address:req.body.Address,
        ContactNo:req.body.ContactNo,
        role:req.body.role
     })
     try{
        const savedUser= await newUser.save()
        res.status(201).json(savedUser)
        } catch(err){
           res.status(500).json(err);
        }
   });

     
//LOGIN
router.post("/login",async (req,res)=>
{
    try
    {
     const user=await User
     .findOne({email:req.body.email});
     !user && res.status(401).json(
        "wrong credentials");

     const hashedPassword=cryptoJs.AES
     .decrypt(user.password,process.env.Pass_sec);
     
     const Originalpassword =hashedPassword.toString(cryptoJs.enc.Utf8);
     
     Originalpassword !==req.body.password &&
     res.status(401).json("wrong crediantials");

        const accessToken=jwt.sign({
            id:user._id,
            role:user.role,
            isAdmin:user.isAdmin,
        }, process.env.JWT_SEC,
        {expiresIn:"3d"}
        );

     const {password, ...others}=user._doc;
     res.status(200).json({...others,accessToken});
    
    }catch(err)
    {
        res.status(500).json(err);
    }
})


module.exports=router