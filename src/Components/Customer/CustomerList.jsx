import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "../Agent/Merchants.module.css";
import style2 from "../Agent/Agent.module.css";
import { IoMdEye } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import Switch from '@mui/material/Switch';
import { useLocation, useNavigate } from 'react-router-dom';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function CustomerList() {
  const { state } = useLocation();
  console.log(state);
  const { token, merchantId, getUserDetails } = useContextData();
  const [searchText, setSearchText] = useState("");
  const [customerList, setCustomerList] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('')
  const [customerwithAccStatus, setCustomerWithAccStatus] = useState(state || '');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const getCustomerList = React.useCallback(() => {
    fetch(`${APIPath}merchant-service/merchant/customers/${merchantId}?startDate=${startDate ? startDate : ''}&endDate=${endDate ? endDate : ''}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': "Application/json"
      },
      method: "GET",
      mode: "cors"
    }).then((res) => res.json())
      .then((data) => {
        // console.log(data.data);
        setCustomerList(data.data);
        setIsLoading(false);
      }).catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [  merchantId, token, startDate, endDate]);


  useEffect(() => {
    getCustomerList();
  }, [getCustomerList])

  const filteredList = customerList && customerList?.filter((list) => {
    // Filter by customer Account Status ---------------------
    if (customerwithAccStatus === 'ACTIVE' && list.account_status !== 'ACTIVE') return false;
    if (customerwithAccStatus === 'INACTIVE' && list.account_status !== 'INACTIVE') return false;
    //  Filter by Customer Name --------------------------------
    return list?.full_name?.toLowerCase().includes(searchText.toLowerCase())
      || list.email?.toLowerCase().includes(searchText.toLowerCase())
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

  const handleStatusChange = (status, kycStatus, Id) => {
    if (kycStatus !== "VERIFIED") {
      alert("KYC is not Verified Yet for this customer");
      return;
    }
    const confirm = window.confirm("Are you sure to modify this customer status?");
    if (!confirm) {
      return;
    }
    else {
      setIsLoading(true);
      const Svalue = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
      const url = `${APIPath}customer-service/api/customers/${Id}?&status=${Svalue}`;
      console.log(url)
      fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        method: 'PATCH',
        mode: "cors",
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status_code === 403) {
            alert(data.message);
            return
          }
          else {
            getCustomerList();
            getUserDetails();
          }
        })
        .catch((err) => {
          console.error(err);
        }).finally(() => setIsLoading(false))
    }
  }

  const navigate = useNavigate();
  const customerDetailsPage = (customerId) => {
    navigate(`/customer/id/${customerId}`)
  }
  const deleteSelectedCustomer = () => {
    setIsLoading(true)
    console.log(selectedCustomer);
    fetch(`${APIPath}customer-service/api/customers/${selectedCustomer?.id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': "Application/json"
      },
      method: "DELETE",
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        alert(data.message);
        getCustomerList();
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
        getCustomerList();
      })
  }

  return <>
    <div className={style.merchants_parent}
      onClick={(e) => {
        if (selectedCustomer) {
          setSelectedCustomer(null)
        }
      }}
    >
      <div className={style.merchants_parent_subheader}>
        <div className={style.search_input_field}>
          <input type='text' placeholder='Search by name..' maxLength={12} value={searchText}
            onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
          <IoSearch />
        </div>
        <div className={style2.start_date_and_end_date}>
          {/* <div>
            <p>Filter by date:</p>
          </div> */}
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
        <div>
          {/* <label>Filter By Status : </label> */}
          <select className={style2.merchants_select} value={customerwithAccStatus}
            onChange={(e) => { setCustomerWithAccStatus(e.target.value) }}>
            <option value="" disabled>Select Status</option>
            <option value="all">All</option>
            <option value="INACTIVE">Inactive</option>
            <option value="ACTIVE">Active</option>
          </select>
        </div>

      </div>

      {isLoading ? <div className={style1.loader_container}>
        <div className={style1.loader_item}>
          <img src='/gold-coin.png' alt='Gold Coin' />
        </div>
      </div> :
        <>
          <div className={style.table_wrapper}>
            <table className={style.merchants_list_container}>
              <thead>
                <tr>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>KYC Status</th>
                  <th>Active/Inactive</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedList?.length > 0 ? (
                  paginatedList?.map((val, id) => {
                    return <tr key={id}>
                      <td>{val.full_name}</td>
                      <td>{val.email}</td>
                      <td>{val.phone}</td>
                      <td>{val.kyc_status}</td>
                      <td>
                        <Switch checked={val.account_status.toLowerCase() === "active"}
                          onChange={() => {
                            handleStatusChange(val.account_status, val.kyc_status, val.id)
                          }}
                        />
                      </td>
                      <td><p style={{ cursor: "pointer" }}
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedCustomer(val);
                        }}
                      ><IoMdEye /></p>
                        {val.id === selectedCustomer?.id &&
                          <div className={style2.row_actions}>
                            <ul className={style.user_menu_list}>
                              <li onClick={() => {
                                customerDetailsPage(selectedCustomer?.id);
                              }}>View & Verify</li>
                              {/* <li onClick={() => { setIsUpdateClick(true); }}>Update</li> */}
                            </ul>
                          </div>
                        }
                      </td>
                    </tr>
                  })
                ) : <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                </tr>
                }
              </tbody>
            </table>
          </div>
          {customerList?.length > rowsPerPage &&
            <div className={style.pagination_parent}>
              <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
              <span className={style.pagination_parent_pageno}>{currentPage}</span>
              <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
            </div>
          }
        </>
      }
    </div>
  </>
}

export default CustomerList;