import React, { useEffect,useState } from 'react'
import axios from 'axios';
import './statistics.css'
const Statistics = ({selectedMonth}) => {

    const [statistics, setStatistics] = useState({});
  // const [selectedMonth, setSelectedMonth] = useState('March');

  useEffect(()=>{
    fetchData();
  },[selectedMonth]);

  const fetchData=async ()=>{
    try {
        
        const res= await axios.get(`http://localhost:5000/api/statistics?month=${selectedMonth}`)
        setStatistics(res.data);

    } catch (error) {
          console.error('Error fetching statistics data:', error);
    }
  }
  return (
 <div className="transaction-statistics flex flex-col items-center mb-10 ">
    <h1 className="text-4xl font-bold mb-10" >Transaction Statistics - {selectedMonth} </h1>
  
    <div className='bg-yellow-500 mb-20 p-15 font-bold text-white  text-yellow-900 rounded text-2xl '>
        <p  className='p-4'>Total amount of sale: <span className='text-white'>{statistics.total_sale_amount}</span></p>
        <p className='p-4'>Total sold items: <span className='text-white'>  {statistics.sold_items_count}</span></p>
        <p className='p-4'>Total amount of sale: <span className='text-white'>{statistics.not_sold_items_count}</span> </p>
    </div>
 </div>
  )
}

export default Statistics