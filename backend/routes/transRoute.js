const express=require('express');
const router=express.Router();
const axios=require('axios');

const {initialiseDatabase,getAllTransactions,getBarChart,getStats,getpieChart}=require("../controller/controller");


router.route('/initialize-db').get(initialiseDatabase);
router.route('/transactions').get(getAllTransactions);
router.route('/statistics').get(getStats);
router.route('/bar-chart').get(getBarChart);
router.route('/pie-chart').get(getpieChart);
// Combined API endpoint
router.route('/combined').get(async (req, res) => {
    try {
      // Fetch data from other APIs
   
      const statistics = await axios.get('/statistics');
      const barChartData = await axios.get('/bar-chart');
      const pieChartData = await axios.get('/pie-chart');
  
      // Combine responses
      const combinedResponse = {
     
        statistics: statistics.data,
        barChartData: barChartData.data,
        pieChartData: pieChartData.data
      };
  
      res.json(combinedResponse);
    } catch (error) {
      console.error('Error fetching combined data:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch combined data' });
    }
  });
  
module.exports=router;