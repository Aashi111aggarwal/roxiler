


import React, { useState, useEffect } from 'react';
import axios from 'axios';


const TransactionsTable = ({selectedMonth}) => {
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState('');
  // const [selectedMonth, setSelectedMonth] = useState('March');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransactions();
  }, [selectedMonth, currentPage, searchText,totalPages]);

  const fetchTransactions = async () => {
    try {
      const res=await axios.get(`http://localhost:5000/api/transactions?month=${selectedMonth}&page=${currentPage}&per_page=${totalPages}&search=${searchText}`);
      setTransactions(res.data.data);
      
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };


  const handleNextPage=()=>{
    if(currentPage<totalPages){
        setCurrentPage(currentPage+1);
        fetchTransactions(selectedMonth);
    }
}

const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      fetchTransactions(selectedMonth);
    }
  };

  return (
    <div className='transaction-table'>
      <div className=" flex justify-center gap-2 mb-10" >
      
<input className="text-center" type="text" value={searchText} onChange={handleSearchChange} placeholder="Search transaction" />
        <button className=" font-bold text-white bg-yellow-500 text-yellow-900 px-4 py-2 rounded"onClick={() => setSearchText('')}>Clear</button>
      </div>
<div className="flex justify-center mr-10 ml-10 mb-8">
<table className="border-collapse border border-gray-300 bg-white shadow-md" >
        <thead className="bg-yellow-500">
          <tr>
            <th className="px-4 py-2 text-center border border-yellow-500">Title</th>
            <th className="px-4 py-2 text-center border border-yellow-500">Description</th>
            <th className="px-4 py-2 text-center border border-yellow-500 ">Price</th>
            <th className="px-4 py-2 text-center border border-yellow-500">Category</th>
            <th className="px-4 py-2 text-center border border-yellow-500">Sold</th>
            <th className="px-4 py-2 text-center border border-yellow-500">Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index} className="border-t border-gray-300">
              <td className="border px-4 py-2 border border-gray-300">{transaction.title}</td>
              <td className="border px-4 py-2 border border-gray-300">{transaction.description}</td>
              <td className="border px-4 py-2 border border-gray-300">{transaction.price}</td>
              <td className="border px-4 py-2 border border-gray-300 ">{transaction.category}</td>
             <td className="border px-4 py-2 border border-gray-300">{transaction.sold}</td>
             <td className="border px-4 py-2 border border-gray-300">{transaction.image}</td>
            </tr>
          ))}
        </tbody>
      </table>
</div>
      
      <div className='flex justify-center items-center gap-2 mb-20'>
        <button className=" font-bold text-white bg-yellow-500 text-yellow-900 px-4 py-2 rounded" onClick={handlePreviousPage}>Previous</button>
        <span className='font-bold'>{currentPage} / {totalPages}</span>
        <button className=" font-bold text-white bg-yellow-500 text-yellow-900 px-4 py-2 rounded" onClick={handleNextPage}>Next</button>
        <br></br><br></br><hr></hr>
     </div>
    </div>
  )
}

export default TransactionsTable