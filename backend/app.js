const express=require ("express");
const app=express();
require("dotenv").config();
const trans_route=require("./routes/transRoute");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
// app.use(cors());
app.use(cors({
       origin:'http://localhost:3000' ,
       method:['GET','POST','PUT','DELETE'],
       allowedHeaders:['Content-Type'],
    }))

app.get("/",(req,res)=>{
    res.send("hi, i m live");
});
app.use(express.json());
//to set up router 
app.use('/api',trans_route);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  }); 