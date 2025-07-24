import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "./Transaction.module.css";
import style2 from "../Agent/Agent.module.css";
import { IoEye, IoSearch } from "react-icons/io5";
import MetalDetails from './MetalDetails';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import { useLocation } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FcCancel, FcFlashOn, FcOk } from 'react-icons/fc';

function GoldTransaction() {
  const { state } = useLocation();
  const { token, merchantId } = useContextData();
  const [searchText, setSearchText] = useState("");
  const [transactionType, setTransactionType] = useState(state || "");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  const [isloading, setIsLoading] = useState(false);
  const [goldList, setGoldLIst] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('')
  const [openMetalPage, setOpenMetalPage] = useState();
  const [selectedMetal, setSelectedMetal] = useState(null);

  useEffect(() => {
    setIsLoading(true)
    fetch(`${APIPath}merchant-service/history/merchant-transaction-history/${merchantId}?metalType=GOLD&startDate=${startDate ? startDate : ''}&endDate=${endDate ? endDate : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'Application/json'
      },
      method: 'GET',
      mode: 'cors'
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        setGoldLIst(data.data);

      }).catch((err) => {
        console.error(err)
      }).finally(() => setIsLoading(false))
  }, [ merchantId, token, startDate, endDate])

  const filteredList = goldList?.filter((list) => {
    if (transactionType === 'SELL' && list.order_type !== 'SELL') return false;
    if (transactionType === 'BUY' && list.order_type !== 'BUY') return false;
    if (transactionType === 'TRANSFER' && list.order_type !== 'TRANSFER') return false;
    if (transactionType === 'CONVERSION' && list.order_type !== 'CONVERSION') return false;
    return list.customer_name?.toLowerCase().includes(searchText.toLowerCase())
  });


  const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const closeDetailsPage = () => {
    setOpenMetalPage(false);
    setSelectedMetal(null);
    document.body.style.overflow = "auto";
  }
  return <>
    <div className={style.merchants_parent}>
      <div className={style.merchants_parent_subheader}>
        <div className={style.search_input_field}>
          <input type='text' placeholder='Search...' maxLength={12} value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
          <IoSearch />
        </div>
        <div className={style2.start_date_and_end_date}>
          <div>
            <p>Filter by :</p>
          </div>
          <div>
            <DatePicker className={style2.date_input}
              placeholderText='Select start date'
              maxDate={new Date()}
              selected={startDate}
              onChange={(date) => {
                setStartDate(date?.toLocaleDateString());
              }}
            />
          </div>
          <div>
            <DatePicker className={style2.date_input}
              disabled={!startDate}
              minDate={startDate}
              maxDate={new Date()}
              selected={endDate}
              onChange={(date) => setEndDate(date?.toLocaleDateString())}
              placeholderText='Select end date' />
          </div>
        </div>

        <div className={style1.transaction_type_input}>
          <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
            <option value="" disabled>Select Transaction Type</option>
            <option value="ALL">All</option>
            <option value="BUY">Buy</option>
            <option value="SELL">Sell</option>
            <option value="TRANSFER">Transfer</option>
            <option value="CONVERSION">Conversion</option>
          </select>
        </div>
      </div>
      {isloading ? <div className={style.loader_container}><div className={style.loader_item}></div></div> :

        <div className={style.table_wrapper}>
          <table className={style.merchants_list_container}>
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Metal Quantity(in gm)</th>
                <th>Order Type</th>
                <th>Total Price</th>
                <th>Order Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList?.length > 0 ? (
                paginatedList?.map((val, id) => {
                  return <tr key={id}>
                    <td>{val.customer_name}</td>
                    <td>{parseFloat(val.metal_quantity_grams)}</td>
                    <td>{val.order_type}</td>
                    <td>{parseFloat(val.total_price)?.toFixed(2)}</td>
                    <td>
                      {val.order_status === 'COMPLETED' && <FcOk title='Completed' />}
                      {val.order_status === 'PENDING' && <FcFlashOn title='Pending' />}
                      {val.order_status === 'FAILED' && <FcCancel title='Failed' />}
                    </td>
                    <td><p style={{ cursor: "pointer" }}>
                      <IoEye onClick={() => { setOpenMetalPage(true); setSelectedMetal(val) }} />
                    </p></td>
                  </tr>
                })
              ) : <tr>
                <td colSpan="8" style={{ textAlign: "center" }}>No Data Found</td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      }
      {goldList?.length > rowsPerPage &&
        <div className={style.pagination_parent}>
          <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
          <span className={style.pagination_parent_pageno}>{currentPage}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
        </div>
      }
    </div >

    {openMetalPage && <MetalDetails selectedMetal={selectedMetal} close={closeDetailsPage} />
    }
  </>
}

export default GoldTransaction;
