const router = require("express").Router();
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin,verifyTokenAndConcontrator,verifyTokenAndConsumer}=require("./verifyToken")
const User = require("../models/User");
//UPDATE user
router.put("/updateUser/:id",verifyTokenAndAdmin,async(req,res)=>
    {
       if(req.body.passord) {
       req.body.password= cryptoJs.AES.encrypt( 
            req.body.password,process.env.Pass_sec)
            .toString();
       }

    try{
        const updateduser= await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },
        {
            new:true
        });
        res.status(200).json(updateduser);
 
    } 
      catch(err){
        res.status(500).json(err);
    }
});
//DELETE one user

router.delete("/deleteUser/:id",verifyTokenAndAdmin,async(req,res)=>
{
    try{
        await User.findByIdAndDelete(req.params.id)
        res.status(200).json("User has been deleted")
    }catch(err)
    {
        res.status(500).json(err);
    }
});
//GET one use


router.get("/find/:id",verifyTokenAndAdmin,async(req,res)=>
{
    try{
       const user= await User.findById(req.params.id)
       const {password, ...others}=user._doc;
       res.status(200).json(others);
      
    }catch(err)
    {
        res.status(500).json(err);
    }
});

//get all users
router.get("/",verifyTokenAndAdmin,async(req,res)=>
{
    const query=req.query.new
    try{
       const users= query?await User.find().sort({_id:-1}).limit(1) : await User.find(req.params.id)
       res.status(200).json(users);
      
    }catch(err)
    {
        res.status(500).json(err);
    }
});

//get user stats
router.get("/stats",verifyTokenAndAdmin,async(req,res)=>{
    const date= new Date();
    const lastyear= new Date(date.setFullYear(date.getFullYear()-1));

    try{
         const data=await User.aggregate([
            {$match:{createdAt:{$gte:lastyear}}},
            {
                $project:{
                    month:{$month:"$createdAt"},

                },
            },
           {
            $group:{
                _id:"$month",
                total:{$sum:1},
            },
           },
         ]);
         res.status(200).json(data);
    }catch(err)
    {
        res.status(500).json(err);
    }
})
module.exports=router