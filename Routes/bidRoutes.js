const mongoose = require ("mongoose");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Router } = require("express");
const jwt=require('jsonwebtoken');
const { token } = require('morgan');
const Bid = require('../Models/Bid');
const Tender = require('../Models/Tender');
const Contractor = require('../Models/Contractor');

//Create a bid - POST Route
router.post("/add/:ct_ID/:t_ID",(req, res, next) => {
    Contractor.findById(req.body.ct_ID)
      .then(product => {
        Tender.findOne(req.body.t_id)
      .then(product => {
        const bid = new Bid({
            bidID: req.params._id,
            ctID: req.params.ct_ID,
            tenderID: req.params.t_ID,
            Amount: req.body.Amount,
            contractorName: req.body.contractorName,
            contractorEmail: req.body.contractorEmail,
        });
            bid.save().then(result => {
                console.log(result);
                res.status(201).json({
                message: "Bid added",
                createdTender: {
                    bidID: req.params._id,
                    ctID: req.params.ct_ID,
                    tenderID: req.params.t_ID,
                    Amount: req.body.Amount,
                    contractorName: req.body.contractorName,
                    contractorEmail: req.body.contractorEmail,
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
    })
})

//Read bid for a specific tender - GET Route
router.get('/fetch/:id', async (req, res, next) => {
    Bid.find({ tenderID: req.params.id })
    .then(result => {
        res.status(200).json({
            Bid: result
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })

    })
})

//Read bid for a specific tender - GET Route
router.get('/fetch/contractorbids/:id', async (req, res, next) => {
    Bid.find({ ctID: req.params.id })
    .then(result => {
        res.status(200).json({
            Bid: result
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