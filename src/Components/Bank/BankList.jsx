import React, { useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import style from "../Admin/Admin.module.css";
import style1 from "../Agent/Merchants.module.css"
import { Switch } from '@mui/material';
import AddNewBank from './AddNewBank';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
function BankList() {
    const {token,merchantId}=useContextData();
    const [bankList, setBankList] = useState(null);
    const [selectedBank, setSelectedBank] = useState(null);
    const [isNewBankClick, setIsNewBankClick] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const getBankLIst = () => {
        setIsLoading(true);
        fetch(`${APIPath}merchant-service/bank-accounts/merchant/${merchantId}`, {
            headers: {
             "Authorization":`Bearer ${token}`,
             "Content-Type":"Application/json"
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setBankList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }
    useEffect(() => {
        getBankLIst()
    }, [])

    const filteredList = bankList && bankList?.filter((list) => list.account_holder_name?.toLowerCase().includes(searchText.toLowerCase()));
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeNewBankPage = () => {
        setIsNewBankClick(false);
        setSelectedBank(null);
         document.body.style.overflow = "auto"; 
    }


    const handlePrimaryAccount = (Id,status) => {
        const confirm=window.confirm("Are You sure to make this Account Primary ?");
        if(!confirm){
            return;
        }
        setIsLoading(true);
        const Svalue = status === false ? true : false;
        const url = `${APIPath}merchant-service/bank-accounts/${Id}/primary`;
        fetch(url, {
            headers: {
                "Authorization":`Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'PUT',
            mode: "cors",
            // body:JSON.stringify({is_primary:Svalue})
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                getBankLIst();
            })
            .catch((err) => {
                console.log(err);
            }).finally(()=>{
                setIsLoading(false)
            })

    }

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div>
                    <p>Below is the list of all previously added banks.</p>
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn}
                        onClick={() => setIsNewBankClick(true)}
                    >Add New Bank</button>
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
                                <th>Holder Name</th>
                                {/* <th>Type</th> */}
                                <th>Bank</th>
                                <th>Branch</th>
                                <th>A/c Number</th>
                                <th>IFSC</th>
                                <th>Primary</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList?.length > 0 ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val.account_holder_name}</td>
                                        <td>{val.bank_name}</td>
                                        <td>{val.branch_name}</td>
                                        <td>{val.account_number}</td>
                                        <td>{val.ifsc_code}</td>
                                        <td>
                                            <Switch checked={val?.primary}
                                             onChange={(e)=>{
                                                handlePrimaryAccount(val.id,val.primary)
                                             }}
                                            />
                                        </td>
                                        <td><p style={{ cursor: "pointer" }}
                                            onClick={() => {
                                                setSelectedBank(val);
                                                setIsNewBankClick(true);
                                            }}
                                        ><MdEdit /></p></td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {bankList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {isNewBankClick && <AddNewBank 
        close={closeNewBankPage} 
        selectedAccount={selectedBank}
        updateList={getBankLIst}
        />}
    </>
}

export default BankList;