import React, { useState, useEffect , useRef} from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';



const BarChart = ({selectedMonth}) => {
    const [chartData, setChartData] = useState([]);
   
    const chartRef = useRef(null);

  
    useEffect(() => {
      fetchChartData();
    }, [selectedMonth]);

    const fetchChartData=async ()=>{
        try {
           const res=await axios.get(`http://localhost:5000/api/bar-chart?month=${selectedMonth}`);
           setChartData(res.data);
           console.log(chartData);
           renderChart(res.data); 
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
        }
    }
    

    const renderChart = (data) => {
      if (data.length === 0) {
        return; }
      const labels = data.map(item => item.range);
      const counts = data.map(item => item.count);

      if (chartRef.current !== null) {
        chartRef.current.destroy();
      }

      const ctx = document.getElementById('myChart').getContext('2d');
      chartRef.current =new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Number of Items',
            data: counts,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    };
 
   
    

 
  
 
  return (
    <div className="transactions-bar-chart text-center ">
    <h2 className='text-4xl font-bold mb-10'>Transactions Bar Chart</h2>
   <div className='mx-auto max-w-3xl mb-8'> <canvas id="myChart" className='w-full' width="300" height="150"></canvas>
   </div>
   
    
    </div>
  )
}

export default BarChart