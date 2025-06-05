import React, { useEffect, useState } from 'react';
import style1 from "../Agent/Merchants.module.css";
import style from "../Admin/Admin.module.css";
import { IoSearch } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import { MdDelete } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function TicketList() {
  const { token,merchantId } = useContextData();
  const [supportList, setSupportList] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;
  // Get all Tickets list ----------------- 
  const getSupportRequest = () => {
    setIsLoading(true);
    fetch(`${APIPath}customer-service/agent-support-tickets/merchant/${merchantId}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "Application/json"
      },
      method: "GET",
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setSupportList(data.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      })
  }
  useEffect(() => {
    getSupportRequest();
    
  }, []);

  // const deleteQuery = (id) => {
  //   const confirm = window.confirm("Are you sure you want to delete this query? This action cannot be undone.");
  //   if (!confirm) {
  //     return;
  //   }
  //   else {
  //     fetch(`${APIPath}customer-service/agent-support-tickets/${id}`, {
  //       headers: {
  //         "Authorization": `Bearer ${token}`,
  //         "Content-Type": "Application/json"
  //       },
  //       method: "DELETE",
  //       mode: "cors"
  //     })
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data);
  //         alert(data.message)
  //         getSupportRequest();
  //       })
  //       .catch((err) => {
  //         console.error(err);
  //       })
  //   }
  // }
  const filteredList = supportList?.filter((list) => list?.subject?.toLowerCase().includes(searchText.toLowerCase()));

  const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const navigate = useNavigate();
  const selectedSupportList = (Id) => {
    navigate(`/view_ticket/${Id}`);
  }

  return <>
    <div className={style.merchants_parent}>
      <div className={style.merchants_parent_subheader}>
        <div className={style.search_input_field}>
          <input
            type='text'
            placeholder='Search by name or email..'
            maxLength={12}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setCurrentPage(1);
            }}
          />
          <IoSearch />
        </div>
      </div>
      {isLoading ? (
        <div className={style1.loader_container}>
          <div className={style1.loader_item}>
            <img src='/gold-coin.png' alt='Gold Coin' />
          </div>
        </div>
      ) : (
        <>
          <table className={style.merchants_list_container}>
            <thead>
              <tr>
                <th>Raised By</th>
                <th>Category</th>
                <th>Subject</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedList?.length > 0 ? (
                paginatedList?.map((val, id) => (
                  <tr key={id} style={{ position: "relative" }}>
                    <td>{val.agent_name || "Jitendra Kumar"}</td>
                    <td>{val.category}</td>
                    <td style={{ maxWidth: "200px" }}>{val.subject}</td>
                    <td>{val.priority}</td>
                    <td>{val.status}</td>
                    <td>
                      <p style={{ fontSize: "24px", display: 'flex', gap: '20px', justifyContent: 'center' }}>
                        <GoEye style={{cursor:"pointer"}}  onClick={() => { selectedSupportList(val.id); }} />{" "}
                        {/* <MdDelete style={{cursor:"pointer"}}  onClick={() => deleteQuery(val.id)} /> */}
                      </p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                </tr>
              )}
            </tbody>
          </table>
          {supportList?.length > rowsPerPage &&
            <div className={style.pagination_parent}>
              <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
              <span className={style.pagination_parent_pageno}>{currentPage}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          }
        </>
      )}
    </div>
  </>
}

export default TicketList;