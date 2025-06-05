import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "../Admin/Admin.module.css";
import style1 from "../Agent/Merchants.module.css"
import { GoEye } from "react-icons/go";
import { IoSearch } from "react-icons/io5";
import Switch from '@mui/material/Switch';
const localSubMerchant = [
    {
        sub_merchant_id: "submerchant-a3507a1e5736",
        sub_merchant_name: "ABC Traders",
        organisation_name: "Paul Merchant Finance",
        address: {
            street: "123 Main Street",
            district: "Mumbai",
            state: "Maharashtra",
            postal_code: "400001"
        },
        primary_contact: {
            person_name: "John Doe",
            person_email: "john.doe@example.com",
            person_mobile: "9876543210"
        },
        account_contact: {
            person_name: "Jane Smith",
            person_email: "jane.smith@example.com",
            person_mobile: "8765432109"
        },
        kyc_status: "PENDING",
        gst_no: "123456789012345",
        pan_no: "XXXXX1234X",
        status: "PENDING_APPROVAL",
        agreement_signed_date: "2025-01-01",
        agreement_expiry_date: "2026-01-01",
        business_type: "small-bussiness",
        created_at: "2025-03-01T12:52:34.829294Z",
        updated_at: "2025-03-01T12:52:34.829318Z",
        merchant_id: "merchant-d2432efada90"
    }
]

function SubMerchantList() {
    const [searchText, setSearchText] = useState("");
    const [subMerchantList, setSubMerchantList] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const [isAddAgentClick, setIsAgentClick] = useState(false);
    const [isFilterClick, setIsFilterClick] = useState(false);

    const fetchSubmerchantList = () => {
        setIsLoading(true)
        fetch(`http://192.168.1.41:8090/merchant-service/sub-merchant`, {
            headers: {
                // 'Authorization': ``,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setSubMerchantList(data.data);
                setIsLoading(false)
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false)
            })
    }
    const openAddAgentForm = () => {
        setIsAgentClick(true);
    }
    const closeAddAgentForm = () => {
        setIsAgentClick(false);
        fetchSubmerchantList();
        document.body.style.overflow = "auto";
    }
    const openFilteredForm = () => {
        setIsFilterClick(true);
    }
    const closeFilteredForm = () => {
        setIsFilterClick(false);
        document.body.style.overflow = "auto";
    }

    useEffect(() => {
        fetchSubmerchantList();
        console.log(localSubMerchant)
    }, [])

    const filteredList = (subMerchantList && subMerchantList.length > 0)
        ? subMerchantList.filter((list) => list.sub_merchant_name?.toLowerCase().includes(searchText.toLowerCase()))
        : localSubMerchant.filter((list) => list.sub_merchant_name?.toLowerCase().includes(searchText.toLowerCase()));

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
    const selectedMerchant = (SubMerchantId) => {
        navigate(`/sub_merchant/${SubMerchantId}`);
        // navigate(`${merchantId}`)
    }
    const handleStatusChange = (e,Id) => {
        const Svalue = e.target.value;
        console.log(Svalue);
        const url = `http://192.168.1.41:8090/merchant-service/merchant-agent/${Id}?merchant_agent_users_id=${Id}&status=${Svalue}`;
        console.log(url)
    }
    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by name or email..' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button onClick={openAddAgentForm} className={style1.primary_login_btn}>Add Sub Merchant</button>
                    <button onClick={openFilteredForm} className={style1.primary_login_btn} style={{ padding: "0px 40px" }}>Filter</button>
                </div>
            </div>
            {isLoading ? <div className={style1.loader_container}>
                <div className={style1.loader_item}>
                    <img src='/gold-coin.png' alt='Gold Coin' />
                </div>
            </div> :
                <>
                    <table className={style.merchants_list_container}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Mobile</th>
                                <th>Avl. Credits</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val.sub_merchant_name}</td>
                                        <td>{val.primary_contact?.person_email}</td>
                                        <td>{val.primary_contact?.person_mobile}</td>
                                        <td>{val.primary_contact - val.used_credit}</td>
                                        <td>
                                            <Switch checked={val.status.toLowerCase() === "active"}
                                                onChange={(e) => handleStatusChange(e, val.sub_merchant_id)}
                                            />
                                        </td>
                                        <td><p style={{ cursor: "pointer" }}
                                            onClick={() => selectedMerchant(val.sub_merchant_id)}
                                        ><GoEye /></p></td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {paginatedList &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {/* {isAddAgentClick && <AddAgent close={closeAddAgentForm} />} */}
        {/* {isFilterClick && <FilterAgent close={closeFilteredForm} />} */}
    </>
}

export default SubMerchantList;