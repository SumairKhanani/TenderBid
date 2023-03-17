const { response } = require("express");
const express = require("express");
const app = express();
const mongoose = require ("mongoose");
app.use(express.json());
mongoose.set('strictQuery', true)
const bodyParser = require('body-parser')

const consumer = require("./Models/Consumer");
const contractor = require("./Models/Contractor");
const tender = require("./Models/Tender");
const bid = require("./Models/Bid");
const consumerRoutes = require("./Routes/consumerRoutes.js");
const contractorRoutes = require("./Routes/contractorRoutes.js");
const tenderRoutes = require("./Routes/tenderRoutes.js");
const bidRoutes = require("./Routes/bidRoutes.js");
/*
mongoose.connect("mongodb://127.0.0.1:27017/webproject", {
    useNewUrlParser : true,
    useUnifiedTopology : true
}, (err) => {
    if(!err)
    {
        console.log("connected to the database")        //connecting to the local mongodb
    } else{
        console.log("error")
    }
})   */
mongoose.connect("mongodb://127.0.0.1:27017/projectdb").catch((err) => {
    console.log("error connecting to the database!");
    });
    mongoose.connection.on("error", (err) => {
    console.log("database connect error!");
    });
    mongoose.connection.on("connected", () => {
    console.log("connected to the database");
});  

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/consumer", consumerRoutes);
app.use("/contractor", contractorRoutes);
app.use("/tender", tenderRoutes);
app.use("/bid", bidRoutes);

app.listen(5000,() => {
    console.log("on port 5000")
})