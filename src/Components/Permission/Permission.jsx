import React, { useEffect, useState } from 'react';
import style from "../Admin/Admin.module.css";
// import style1 from "./Merchants.module.css";
import style1 from "../Agent/Merchants.module.css";
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import NewPermission from './NewPermission';
import { APIPath } from '../ApIPath/APIPath';

function Permission() {
    const [permissionList, setpermissionList] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState("");
    const [isRequestpermissionClick, setIsRequestpermissionClick] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const fetchCrditList = () => {
        setIsLoading(true);
        fetch(`${APIPath}/permissions`, {
            headers: {
                "Authorization":"",
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setpermissionList(data.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        fetchCrditList();
    }, []);

    const filteredList = permissionList && permissionList?.filter((list) => list.name?.toLowerCase().includes(searchText.toLowerCase()));
    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };


    const closepermissionRequestForm = () => {
        setIsRequestpermissionClick(false);
        setSelectedPermission(null);
        // fetchCrditList();
        document.body.style.overflow = "auto";
    };

    return (
        <>
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
                    <div className={style.add_merchants_and_filter}>
                        <button className={style1.primary_login_btn} onClick={() => {
                            setIsRequestpermissionClick(true);
                        }}>
                            Create permissions
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
                                    <th>Permission Name</th>
                                    <th>Descriptions</th>
                                    <th>Created At</th>
                                    <th>Updated At</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => (
                                        <tr key={id} style={{ position: "relative" }}>
                                            <td>{val.name || "Merchants name"}</td>
                                            <td>{val.description || "0"}</td>
                                            <td>{val.created_at?.split("T")[0] || ""}</td>
                                            <td>{val.updated_at?.split("T")[0]}</td>
                                            <td>
                                                <p
                                                    style={{ cursor: "pointer", fontSize: "24px" }}
                                                    onClick={(e) => {setSelectedPermission(val) }}
                                                >
                                                    <MdEdit />
                                                </p>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: "center" }}>No Data Found</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    </>
                )}
            </div>
            {(isRequestpermissionClick || selectedPermission) && <NewPermission close={closepermissionRequestForm} 
            selectedPermission={selectedPermission} updateList={fetchCrditList} /> }
        </>
    );
}

export default Permission;
