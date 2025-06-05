import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "./Transaction.module.css";
import style2 from "../Agent/Agent.module.css";
import { IoEye, IoSearch } from "react-icons/io5";
import { FcCancel, FcFlashOn, FcOk } from "react-icons/fc";
import MetalDetails from './MetalDetails';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function CreditTransaction() {
  const { token, merchantId } = useContextData();
  const [searchText, setSearchText] = useState("");
  const [transactionType, setTransactionType] = useState("");
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
    fetch(`${APIPath}credit-service/merchant-credit/credit-transfer/${merchantId}?startDate=${startDate?startDate:''}&endDate=${endDate?endDate:''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'Application/json'
      },
      method: 'GET',
      mode: 'cors'
    }).then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (transactionType === "DEBIT") {
          const sell = data.data.filter((data) => data.transactionType === "DEBIT")
          setGoldLIst(sell);
        }
        else if (transactionType === "CREDIT") {
          const buy = data.data.filter(item => item.transactionType === "CREDIT");
          setGoldLIst(buy);
        }
        else {
          setGoldLIst(data.data);
        }
      }).catch((err) => {
        console.error(err)
      }).finally(() => setIsLoading(false))
  }, [transactionType,merchantId,token,startDate,endDate])

  const filteredList = goldList?.filter((list) => list.id?.toLowerCase().includes(searchText.toLowerCase()));
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
      {isloading ? <div className={style.loader_container}><div className={style.loader_item}></div></div> :
        <>
          <div className={style.merchants_parent_subheader}>
            <div className={style.search_input_field}>
              <input type='text' placeholder='Search...' maxLength={12} value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
              <IoSearch />
            </div>
            <div className={style2.start_date_and_end_date}>
                    <div>
                        <p>Filter by date:</p>
                    </div>
                    <div>
                        <DatePicker className={style2.date_input}
                            placeholderText='Select start date'
                            maxDate={new Date()}
                            selected={startDate}
                            onChange={(date) => {
                                setStartDate(date?.toISOString()?.split("T")[0]);
                            }}
                        />
                    </div>
                    <div>
                        <DatePicker className={style2.date_input}
                            disabled={!startDate}
                            minDate={startDate}
                            maxDate={new Date()}
                            selected={endDate}
                            onChange={(date) => setEndDate(date?.toISOString()?.split("T")[0])}
                            placeholderText='Select end date' />
                    </div>
                </div>

            <div className={style1.transaction_type_input}>
              <label htmlFor="Transaction Type">Order Type: </label>
              <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                <option value="" disabled>Select Transaction Type</option>
                <option value="ALL">All</option>
                <option value="DEBIT">Debit</option>
                <option value="CREDIT">Credit</option>
                {/* <option value="TRANSFER">Transfer</option> */}
                {/* <option value="CONVERSION">Conversion</option> */}
              </select>
            </div>
          </div>
          <table className={style.merchants_list_container}>
            <thead>
              <tr>
                {/* <th>Name</th> */}
                <th>Opening amt.</th>
                <th>Transaction amt.</th>
                <th>Closing amt.</th>
                <th>Description</th>
                <th>Transaction Type</th>
                <th>Created at</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList?.length > 0 ? (
                paginatedList?.map((val, id) => {
                  return <tr key={id}>
                    {/* <td>{val.agent_name}</td> */}
                    <td>{val.opening_credits}</td>
                    <td>{val.amount}</td>
                    <td>{val.remainingCredits}</td>
                    <td>{val.description}</td>
                    <td>{val.transactionType}</td>
                    <td>{`${val.createdAt?.split("T")[0]} ${val.createdAt?.split("T")[1]}`}</td>
                    <td>
                      {val.status === 'COMPLETED' && <FcOk title='Completed'/>}
                      {val.status === 'PENDING' && <FcFlashOn title='Pending' />}
                      {val.status === 'FAILED' && <FcCancel title='Failed'/>}
                    </td>
                    {/* <td><p style={{ cursor: "pointer" }}>
                      <IoEye onClick={() => { setOpenMetalPage(true); setSelectedMetal(val) }} />
                    </p></td> */}
                  </tr>
                })
              ) : <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No Data Found</td>
              </tr>
              }
            </tbody>
          </table>
          {goldList?.length > rowsPerPage &&
            <div className={style.pagination_parent}>
              <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
              <span className={style.pagination_parent_pageno}>{currentPage}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          }
        </>}
    </div>

    {openMetalPage && <MetalDetails selectedMetal={selectedMetal} close={closeDetailsPage} />}
  </>
}

export default CreditTransaction;
