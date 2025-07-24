import React, { useEffect, useState } from 'react';
// import style1 from './Merchants.module.css';
import style1 from "../Agent/Merchants.module.css";
import style2 from "../Agent/Agent.module.css";
import style from "../Admin/Admin.module.css";
import { IoSearch } from "react-icons/io5";
import { GoEye } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function CreditApproval() {
    const { token, merchantId } = useContextData();
    const [merchantPendingCreditList, setMerchantPendingCreditList] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const getApprovalRequest = React.useCallback(() => {
        fetch(`${APIPath}credit-service/credit-request/approval/${merchantId}?startDate=${startDate ? startDate : ''}&endDate=${endDate ? endDate : ''}`, {
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
                setMerchantPendingCreditList(data.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setIsLoading(false);
            })
    }, [merchantId, startDate, endDate, token]);

    useEffect(() => {
        getApprovalRequest();
    }, [getApprovalRequest])

    const filteredList = merchantPendingCreditList
        && merchantPendingCreditList?.filter((list) => list.merchant_agent_name?.toLowerCase().includes(searchText.toLowerCase()));

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
    const selectedCreditList = (Id) => {
        navigate(`/credit_approval/${Id}`);
    }

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input
                        type='text'
                        placeholder='Search by requested by'
                        maxLength={12}
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
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
                {/* <div>

                </div> */}
                {/* <div>
                    <p>Credits request from Agents/Submerchants</p>
                </div> */}
            </div>
            {isLoading ? (
                <div className={style1.loader_container}>
                    <div className={style1.loader_item}>
                        <img src='/gold-coin.png' alt='Gold Coin' />
                    </div>
                </div>
            ) : (
                <>
                    <div className={style.table_wrapper}>
                        <table className={style.merchants_list_container}>
                            <thead>
                                <tr>
                                    <th>Requested By</th>
                                    {/* <th>Transaction Type</th> */}
                                    <th>Payment Method</th>
                                    <th>A/C no.</th>
                                    <th>Req. Credits</th>
                                    <th>Payment Status</th>
                                    <th>Approval Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => (
                                        <tr key={id} style={{ position: "relative" }}>
                                            <td>{val.merchant_agent_name || val.sub_merchant_name || "Vikash basant"}</td>
                                            {/* <td>{val.transaction_type || "0"}</td> */}
                                            <td>{val.payment_method || "Cash"}</td>
                                            <td>{`XXXX${val.acc_no?.slice(-4)}` || "1234"}</td>
                                            <td>{val.amount || "0"}</td>
                                            <td>{val.payment_status || "Pending"}</td>
                                            <td>{val.approval_status || "Pending"}</td>
                                            <td>
                                                <p style={{ cursor: "pointer", fontSize: "24px" }}
                                                    onClick={() => { selectedCreditList(val.id); }}>
                                                    <GoEye />
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
                    </div>
                    {merchantPendingCreditList?.length > rowsPerPage &&
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

export default CreditApproval;