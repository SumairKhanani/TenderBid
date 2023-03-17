const mongoose = require ("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router } = require("express");
const jwt=require('jsonwebtoken');
const { token } = require('morgan');
const Contractor = require('../Models/Contractor.js');

//Signup for contractor - POST Route
router.post("/signup", async(req, response) => {
    console.log("inside the post function");
    Contractor.find({ Email: req.body.Email })
    .exec()
        .then(contractor => {
            if (contractor.length >= 1) {
                return response.status(409).json({
                message: "Email already exists"
        });
        } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
            if (err) {
                return response.status(500).json({
                error: err
            })}
            else{const data = new Contractor({
                Name:req.body.Name,
                CompanyName:req.body.CompanyName,
                Email:req.body.Email,
                Address:req.body.Address,
                MobileNo:req.body.MobileNo,
                password:hash,
                status:req.body.status
            })
            data.save()
                    .then(result=>{
                        console.log(result);
                        response.status(200).json({
                            message:'Contractor is created'
                        })
                    })
                    .catch(err=>{
                        console.log(err);
                        response.status(500).json({
                            error:err
                        })
                    });
        }})
    }    
    })
    //response.json("User created")
})

//Contractor Login - POST Route
router.post('/login',(req,res,next)=>{
    Contractor.findOne({Email:req.body.Email})
    .exec()
    .then(contractor=>{
      if(contractor.length<1){
          return res.status(401),json({
              message:'Auth Failed'
          });
      }
      bcrypt.compare(req.body.password, contractor.password,(err,result)=>{
          if(err){
              return res.status(401).json({
                  message:'Auth Failed'
              })
          }
          if(result){
            const token =  jwt.sign({
                  Email:contractor.Email,
                  ID:contractor._id
              },
              'dollar',
              {
                  expiresIn:"1h",
              }
              )
              const refreshtoken=  jwt.sign({
                  Email:contractor.Email,
                  ID:contractor._id
              },
              'secret',
              {
                  expiresIn:"8h",
              }
              )

              return res.status(201).json({
                  message :'Auth Successfull',
                  accestoken:token,
                  refreshtoken:refreshtoken
              });


              
          }
          return res.status(401).json({
              message:'Auth Failed'
             
          });
      })
    })
    .catch();

});

//Refresh Token
router.post('/token',(req,res,next)=>{
    const refreshtoken = req.header('x-auth-token');
    console.log(refreshtoken);
    
    try {
        const decoded = jwt.verify(refreshtoken,'secret');
   //     req.userData=decoded;
        const {Email}=decoded;
        const {_id}=decoded;
        const accesstoken=  jwt.sign({
            Email:{Email},
            ID:{_id}
        },
        'dollar',
        {
            expiresIn:"20s",
        }
        )
        res.json({
            access:accesstoken
        })

    } catch (err) {
        res.status(403).json({
            error:err
        })
    }
});

//Read all contractors - GET Route
router.get("/fetch/all", (req, res, next) => {
    const id=req.params.userId;
    Contractor.find({ ID: id })
    //.select('Email ID')
      .exec()
      .then(result => {
        res.status(200).json({
            Contractor: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

//Read individual contractor - GET Route
router.get('/fetch/:id', async (req, res, next) => {
    Contractor.findById({ _id: req.params.id })
    .then(result => {
        res.status(200).json({
            contractor: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })

    })
})

//Update a contractor - UPDATE Route
router.put('/update/:id', async (req, res, next) => {
    console.log("inside the function")
    const newUser= {
        Name:req.body.Name,
        CompanyName:req.body.CompanyName,
        Email:req.body.Email,
        Address:req.body.Address,
        MobileNo:req.body.MobileNo,
        password:req.body.password,
        status:req.body.status
    }
    console.log("inside the function")

    const user= await Contractor.findByIdAndUpdate(req.params.id,newUser,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })

})

//Delete a contractor - DELETE Route
router.delete('/delete/:id', async (req, res, next) => {

    Contractor.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(result => {
            res.status(200).json({
                deleted_user: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })

        })
})



module.exports = router;