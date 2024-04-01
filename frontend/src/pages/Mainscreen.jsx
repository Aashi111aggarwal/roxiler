import React,{useState} from "react";
import TransactionsTable from '../components/TransactionTable/TransactionsTable'
import BarChart from '../components/BarChart/BarChart'
import Statistics from "../components/Statistics/Statistics";
import './mainscreen.css'
const Mainscreen = () => {
  const [selectedMonth, setSelectedMonth] = useState('March');
  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);}
  return (
    <div className="main_screen bg-blue-100">
    <h1 id="m-heading" className="font-bold text-5xl text-center border-3 border-gray-300 mb-8 text-gray-500 ">Transaction Dashboard</h1>
    <div className="flex justify-center gap-3 mt-4 mb-10">
    <h2 className=" text-center text-2xl font-bold  "> Select Month</h2>
    <select value={selectedMonth} onChange={handleMonthChange}>
        {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
          <option key={index} value={month}>{month}</option>
        ))}
      </select></div>
    
   
 <TransactionsTable selectedMonth={selectedMonth}/>
<Statistics selectedMonth={selectedMonth}/>
 <BarChart selectedMonth={selectedMonth}/>
</div>
  )
}

export default Mainscreen