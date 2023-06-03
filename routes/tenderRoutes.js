const router = require("express").Router();
const {verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin,verifyTokenAndConcontrator,verifyTokenAndConsumer,verifyTokenConsumerORAdmin}=require("./verifyToken")
//const User = require("../models/User");
const Tender = require("../models/Tender");

//CREATE tender
router.post("/createTender",verifyTokenConsumerORAdmin, async (req,res)=>
{
    const newTender = new Tender(req.body)
    try{
        const savedTender=await newTender.save();
        res.status(200).json(
            {
                success:true,
                savedTender});
    }catch(err)
    {
        res.status(500).json({success:false,err});
    }
});




//UPDATE tender
router.put("/updateTender/:id",verifyTokenConsumerORAdmin,async(req,res)=>
    {
    try{
        const updatedTender= await Tender.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },
        {
            new:true
        });
        res.status(200).json({
            success:true,
            updatedTender});
 
    } 
      catch(err){
        res.status(500).json({success:false,err});
    }
});


//DELETE HARD tender

router.delete("/deleteTender/:id",verifyTokenConsumerORAdmin,async(req,res)=>
{
    try{
        await Tender.findByIdAndDelete(req.params.id)
        res.status(200).json("TENDER has been deleted")
    }catch(err)
    {
        res.status(500).json(err);
    }
});

//GET one tender


router.get("/find/:id",verifyToken,async(req,res)=>
{
    try{
       const tender= await 
       Tender.findById(req.params.id).populate("user")
       res.status(200).json({success:true,tender});
      
    }catch(err)
    {
        res.status(500).json({success:false,err});
    }
});

//get all tenders
router.get("/",verifyToken ,async(req,res)=>
{
    try{
        const tenders= await Tender.find({})
        .populate("user")
        .limit(12)
        .sort({createdAt:-1});
       res.status(200).json(
        { 
            success:true,
            countTotal:tenders.length,
            tenders
         });
      
    }catch(err)
    {
        res.status(500).json(
        {
            success:false,
            err
        });
    }
});
//get all tenders from one user
router.get("/userTender/:uid/:tid",verifyTokenConsumerORAdmin ,async(req,res)=>
{
    try {
        const { tid, uid } = req.params;
        const tenders = await Tender
          .find({
            user: uid,
            tender: { $ne: tid },
          })
          .limit(3)
          .populate("user");
        res.status(200).send({
          success: true,
          tenders,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "error while geting relate tenders",
          error,
        });
      }
});







module.exports=router;