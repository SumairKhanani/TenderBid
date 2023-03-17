const mongoose = require ("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router } = require("express");
const jwt=require('jsonwebtoken');
const { token } = require('morgan');
const Tender = require('../Models/Tender.js');
const Consumer = require('../Models/Consumer');

//Create a tender - POST Route
router.post("/create/:conID",(req, res, next) => {
    Consumer.findById(req.body.conID)
      .then(product => {
        
        const tender = new Tender({
            t_ID:req.params._id,
            TID: req.params.conID,
            Title: req.body.Title,
            Details: req.body.Details,
            Budget: req.body.Budget,
            status: req.body.status,
            conName:req.body.conName,
            conEmail:req.body.conEmail
        });
            tender.save().then(result => {
                console.log(result);
                res.status(201).json({
                message: "Tender added",
                createdTender: {
                    t_ID:req.params._id,
                    TID: req.params.conID,
                    Title: req.body.Title,
                    Details: req.body.Details,
                    Budget: req.body.Budget,
                    status: req.body.status,
                    conName:req.body.conName,
                    conName:req.body.conEmail
                }     
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                  error: err
            });
        });           
    })
});

//Read all the Tenders - GET ROUTE
router.get("/fetch/all", (req, res, next) => {
    const id=req.params.userId;
    Tender.find({ t_ID: id })
      .exec()
      .then(result => {
        res.status(200).json({
          Tender: result
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
});

//Read a single Tenders - GET ROUTE
router.get('/fetch/:id', async (req, res, next) => {
    Tender.findById({ _id: req.params.id })
    .then(result => {
        res.status(200).json({
            tender: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })

    })
})

//Update a tender - UPDATE Route
router.put('/update/:id', async (req, res, next) => {
    console.log("inside the function")
    const newTender= {
        t_ID:req.params._id,
        TID: req.params.id,
        Title: req.body.Title,
        Details: req.body.Details,
        Budget: req.body.Budget,
        conName:req.body.conName,
        conEmail:req.body.conEmail
    }
    console.log("inside the function")

    const tender= await Tender.findByIdAndUpdate(req.params.id,newTender,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true
    })

})

//Delete a consumer - DELETE Route
router.delete('/delete/:id', async (req, res, next) => {

    Tender.findOneAndUpdate({ _id: req.params.id }, {
        $set: {
            status: "INACTIVE"
        }
    })
        .then(result => {
            res.status(200).json({
                deleted_tender: result
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