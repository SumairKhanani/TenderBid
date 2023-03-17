const { isNumber } = require("@hapi/joi/lib/common");
const mongoose = require("mongoose");
//const Consumer = require("./Consumer");


const tenderSchema = {
    t_ID:mongoose.Schema.Types.ObjectId,
    TID:{
        type: String, 
        required: true
    },
    Title:{
        type: String, 
        required: true
    },
    Details:{
        type: String, 
        required: true
    },
    Budget:{
        type: Number, 
        required: true
    },
    status:{
        type: String,
        enum: ["ACTIVE", "INACTIVE"],
        required: true
      },
    conName:{
        type: String, 
        required: true
    },
    conEmail:{
        type: String, 
        required: true
    }

}

module.exports = mongoose.model("tenders", tenderSchema);