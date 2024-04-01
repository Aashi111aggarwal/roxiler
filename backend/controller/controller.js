const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const moment=require('moment');
require("dotenv").config();

mongoose.connect(process.env.MONGODB_URL,
 { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
  console.log('app is connected to database')});
// U4c6YF1DxWIwf6Ym

const productSchema = new mongoose.Schema({

 title: String,
    description: String,
    price: Number,
    dateOfSale: Date,
    category: String,
    id:{
        type:Number,
        required:true,
    },
    title:{
        type:String,
        required:true,
    },
price:{
        type:Number,
        required:true,

    },
    description: {
        type: String,
        required: true
      },
   
      category: {
        type: String,
        required: true
      },
      image: {
        type: String,
        required: true
      },
      sold: {
        type: Boolean,
        required: true
      },
      dateOfSale: {
        type: Date
      }
});

const Product = mongoose.model('Product', productSchema);

const initialiseDatabase= async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const products = response.data;
        console.log(products);
        await Product.create(products);
        
        res.json({ success: true, message: 'Database initialized successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Database initialization failed' });
    }
};


function getMonthNumber(monthName) {
  const months = [
    'January', 'February', 'March', 'April',
    'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'
  ];
  const lowerCaseMonthName = monthName.toLowerCase();
  const index = months.findIndex(month => month.toLowerCase() === lowerCaseMonthName);
  return index !== -1 ? index + 1 : null;
}



const getAllTransactions=async(req,res)=>{
  try{
    const { page = 1, perPage = 10, search = '', month } = req.query;
  const skip=(page-1)*perPage;
  console.log('Search parameter:', search);
  let baseQuery={};
    

  if (search) {
  
    const searchAsNumber = parseFloat(search);
    if (!isNaN(searchAsNumber)) {
    
      baseQuery = { price: searchAsNumber };
    } else {
    
      baseQuery = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ]
      };
    }
  }

  if (month) {
    const monthQuery = 
    {$expr: { $and: [{ $eq: [{ $type: "$dateOfSale" }, "date"] }, { $eq: [{ $month: "$dateOfSale" }, getMonthNumber(month)] }] } }
    baseQuery = { ...baseQuery, ...monthQuery };
}


  //count of total matching documents
  const totalCount=await Product.countDocuments(baseQuery);

  //retrieving matching products with pagination
  const products=await Product.find(baseQuery).skip(skip).limit(perPage);

  res.json({
    total_count: totalCount,
    page,
    per_page: perPage,
    data: products
  });}
  catch(error){
    console.log(error);
    res.status(500).json({error:error.message});

  }

}

const getStats=async(req,res)=>{
 try {
  const {month}=req.query;

  const monthQueried=moment().month(month).month();

  const startDate=moment().month(monthQueried).startOf('month').toDate();
 
  const endDate=moment().month(monthQueried).endOf('month').toDate();
  
   // Total sale amount of selected month
          const totalSaleAmount = await Product.aggregate([
            {
                $match: {
                    $expr: {
                        $eq: [{ $month: '$dateOfSale' }, monthQueried + 1] 
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$price' }
                }
            }
        ]);

        // Total number of sold items of selected month
        const soldItemsCount = await Product.countDocuments({
            $expr: {
                $eq: [{ $month: '$dateOfSale' }, monthQueried + 1] 
            },
            sold:true
        });

 

       // Total number of not sold items of selected month
        const notSoldItemsCount = await Product.countDocuments({
       $expr: {
          $eq: [{ $month: '$dateOfSale' }, monthQueried + 1] 
      },
      sold:false
        });

        res.json({
            total_sale_amount: totalSaleAmount.length > 0 ? totalSaleAmount[0].total : 0,
            sold_items_count: soldItemsCount,
            not_sold_items_count: notSoldItemsCount,
      
            
        });

 } catch (error) {
  console.error(error);
        res.status(500).json({error:error.message});
 }
  
}

const priceRanges = [
  { min: 0, max: 100 },
  { min: 101, max: 200 },
  { min: 201, max: 300 },
  { min: 301, max: 400 },
  { min: 401, max: 500 },
  { min: 501, max: 600 },
  { min: 601, max: 700 },
  { min: 701, max: 800 },
  { min: 801, max: 900 },
  { min: 901, max: Infinity } 
];


const getBarChart=async(req,res)=>{

try {
  const {month}=req.query;

 
 

  const priceRangeData = await Promise.all(priceRanges.map(async range => {
      const { min, max } = range;
      
      const count = await Product.countDocuments({
          price: { $gte: min, $lte: max }, // Price falls within the current range
         
         
           $expr: { $and: [{ $eq: [{ $type: "$dateOfSale" }, "date"] }, { $eq: [{ $month: "$dateOfSale" }, getMonthNumber(month)] }] } 
         
      

      });

      return { range: `${min}-${max}`, count };
  }));

  res.json(priceRangeData);
} catch (error) {
  res.status(500).json({error:error.message});
}

}

const getpieChart= async(req,res)=>{
const {month}=req.query;

 
try {
  const categories=await Product.aggregate([
    {
      $match:{
        $expr:{$eq:[{$month:'$dateOfSale'},getMonthNumber(month)]}
      }
    },{
    $group: {
      _id:'$category',
      count: { $sum: 1 }
    }}
  ]);

  res.json(categories);
  
} catch (error) {
  res.status(500).json({error:error.message});
}
}


module.exports={initialiseDatabase,getAllTransactions,getBarChart,getStats,getpieChart};