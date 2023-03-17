const { isNumber } = require("@hapi/joi/lib/common");
const mongoose = require("mongoose")
const Tender = require("./Tender");

//Schema
const bidSchema = {
    bidID:mongoose.Schema.Types.ObjectId,
    ctID:{
        type: String, 
        required: true
    },
    tenderID:{
        type: String, 
        required: true
    },
    Amount:{
        type: Number, 
        required: true
    }, 
    contractorName:{
        type: String, 
        required: true
    },
    contractorEmail:{
        type: String, 
        required: true
    }
    
}


module.exports = mongoose.model("bids", bidSchema);