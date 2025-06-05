import React, { useCallback, useEffect, useState } from 'react';
import { IoSearch } from "react-icons/io5";
import { MdEdit } from "react-icons/md";
import style from "../Admin/Admin.module.css";
import style1 from "../Agent/Merchants.module.css";
import AddNewRole from './AddNewRole';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import { GoEye } from 'react-icons/go';
import { MdDelete } from "react-icons/md";

function Role() {
    const { token } = useContextData();
    const [roleList, setRoleList] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedRoleId, setSelectedRoleId] = useState("");
    const [isNewRoleClick, setIsNewRoleClick] = useState(false);
    const [searchText, setSearchText] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    // Getting all the role list -----------------------
    const getRoleLIst = useCallback(() => {
        setIsLoading(true);
        fetch(`${APIPath}merchant-service/roles`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "Application/json"
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setRoleList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }, [token])

    useEffect(() => {
        getRoleLIst()
    }, [getRoleLIst])

    const filteredList = roleList && roleList?.filter((list) => list.name?.toLowerCase().includes(searchText.toLowerCase()))

    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeNewRolePage = () => {
        setIsNewRoleClick(false);
        setSelectedRoleId("");
        document.body.style.overflow = "auto";
    }
    // ------------- Delete selected row ---------------------
    const deleteSelectedRole = (id) => {
        setIsLoading(true)
        fetch(`${APIPath}merchant-service/roles/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'Application/json'
            },
            method: 'DELETE',
            mode: 'cors'
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.message);
                alert(data.message)
            })
            .finally(() => setIsLoading(false))
    }

    return <>
        <div className={style.merchants_parent}>
            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                <div className={style.add_merchants_and_filter}>
                    <button className={style1.primary_login_btn}
                        onClick={() => setIsNewRoleClick(true)}
                    >Add New Role</button>
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
                                <th>Description</th>
                                <th>Permission</th>
                                <th>Created</th>
                                <th>Updated</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedList ? (
                                paginatedList?.map((val, id) => {
                                    return <tr key={id}>
                                        <td>{val.name}</td>
                                        <td>{val.description}</td>
                                        <td>
                                            {/* <div className={style.current_value}>
                                                {val.permissions_names?.slice(0, 1).map((perm, id) => (
                                                    <p key={id}>{perm}{" "}...</p>
                                                ))}

                                                <div className={style.on_hover}>
                                                    {val.permissions_names.map((perm, id) => (
                                                        <p key={id}>{perm}</p>
                                                    ))}
                                                </div>
                                            </div> */}
                                            {val?.permissions?.map((perm, id) => (
                                                <p key={id}>{perm.name}</p>
                                            ))}
                                        </td>

                                        <td>{val.created_at?.split("T")[0]}</td>
                                        <td>{val.updated_at?.split("T")[0]}</td>
                                        <td><p style={{ cursor: "pointer", fontSize: "24px" }}
                                            // onClick={()=>{setSelectedRoleId(val.id);setSelectedRole(val)}}
                                            onClick={() => { deleteSelectedRole(val.id) }}
                                        ><MdDelete /></p></td>
                                    </tr>
                                })
                            ) : <tr>
                                <td colSpan="7" style={{ textAlign: "center" }}>No Data Found</td>
                            </tr>
                            }
                        </tbody>
                    </table>
                    {roleList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
        {isNewRoleClick && <AddNewRole close={closeNewRolePage} updateList={getRoleLIst} />}
    </>
}

export default Role;