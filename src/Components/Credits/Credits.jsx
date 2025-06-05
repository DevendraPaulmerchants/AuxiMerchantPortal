import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
import style1 from "../Agent/Merchants.module.css";
import style2 from "../Agent/Agent.module.css"
import { GoEye } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import RequestCredits from './RequestCredits';
import { useNavigate } from 'react-router-dom';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

function Credits() {
    const { token, merchantId } = useContextData();
    const [creditList, setCreditList] = useState(null);
    // const [selectedMerchant, setSelectedMerchant] = useState(null);
    // const [addCreditForm, setAddCreditForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')
    const [isRequestCreditClick, setIsRequestCreditClick] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    // const [isCreditMenuOpen, setIsCreditMenuOpen] = useState(false);
    // const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });



    const fetchCrditList = React.useCallback(() => {
        setIsLoading(true);
        fetch(`${APIPath}credit-service/credit-request/${merchantId}?startDate=${startDate?startDate:''}&endDate=${endDate?endDate:''}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setCreditList(data.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }, [merchantId, startDate, endDate, token]);

    useEffect(() => {
        fetchCrditList();
    }, [fetchCrditList]);

    const filteredList = creditList && creditList?.filter((list) => list.payment_method?.toLowerCase().includes(searchText.toLowerCase()));
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const closeCreditRequestForm = () => {
        setIsRequestCreditClick(false)
        document.body.style.overflow = "auto";
    };

    const navigate = useNavigate();
    const openCreditDetailsPage = (id) => {
        navigate(`/credit/${id}`);
    }

    return (
        <>
            <div className={style.merchants_parent}>
                <div className={style.merchants_parent_subheader}>
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
                    <div className={style.add_merchants_and_filter}>
                        <button className={style1.primary_login_btn} onClick={() => {
                            setIsRequestCreditClick(true);
                        }}>
                            Request Credits
                        </button>
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
                                    <th>Requested Credits</th>
                                    <th>Requested Date</th>
                                    <th>Transaction Type</th>
                                    {/* <th>Payment Status</th> */}
                                    <th>Approval Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => (
                                        <tr key={id} style={{ position: "relative" }}>
                                            <td>{val?.amount || "0"}</td>
                                            <td>{val?.created_at?.split("T")[0] || ""}</td>
                                            <td>{val?.transaction_type}</td>
                                            {/* <td>{val?.payment_status || "Pending"}</td> */}
                                            <td>{val?.approval_status}</td>
                                            <td>
                                                <p
                                                    style={{ cursor: "pointer", fontSize: "24px" }}
                                                    onClick={() => {
                                                        openCreditDetailsPage(val.id);
                                                    }}
                                                >
                                                    <GoEye />
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" style={{ textAlign: "center" }}>No Data Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {creditList?.length > rowsPerPage &&
                            <div className={style.pagination_parent}>
                                <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                                <span className={style.pagination_parent_pageno}>{currentPage}</span>
                                <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                            </div>
                        }
                    </>
                )}
            </div>


            {isRequestCreditClick && <RequestCredits
                close={closeCreditRequestForm}
                updateList={fetchCrditList}
            />}
        </>
    );
}

export default Credits;
