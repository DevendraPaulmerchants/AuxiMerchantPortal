import { useEffect, useState } from "react";
import { useContextData } from "../../Context/Context";
import style from '../../Admin/Admin.module.css';
import style1 from "../Merchants.module.css";
import { Switch } from "@mui/material";
import { APIPath } from "../../ApIPath/APIPath";
import { CiEdit } from "react-icons/ci";
import InternalAgentForm from "./InternalAgentForm";
import { IoMdClose } from "react-icons/io";

function InternalAgentList({ searchText, agentwithAccStatus }) {
    const { token, merchantId } = useContextData();

    const [agentList, setAgentList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    useEffect(() => {
        setIsLoading(true)
        fetch(`${APIPath}merchant-service/internal-agent/all/${merchantId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'Application/json'
            },
            method: 'GET',
            mode: 'cors'
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setAgentList(data.data);
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [token, merchantId])

    const filteredList = Array.isArray(agentList)
        ? agentList.filter((list) => {
            // Filter by agentwithAccStatus
            if (agentwithAccStatus === "ACTIVE" && !list.active) return false;
            if (agentwithAccStatus === "INACTIVE" && list.active) return false;
            // Filter by searchText
            return list?.full_name?.toLowerCase().includes(searchText.toLowerCase());
        })
        : [];

    const totalPages = Math.ceil(filteredList?.length / rowsPerPage);
    const startIndex = (currentPage - 1) * rowsPerPage;
    const paginatedList = filteredList?.slice(startIndex, startIndex + rowsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const closeEditedAgent = () => {
        setSelectedRow(null)
    }

    return (
        <>
        <div>
            {isLoading ? <div className={style1.loader_container}>
                <div className={style1.loader_item}>
                    <img src='/gold-coin.png' alt='Gold Coin' />
                </div>
            </div> :
                <>
                    <div className={style.table_wrapper}>
                        <table className={style.merchants_list_container} >
                            <thead>
                                <tr>
                                    <th>Emp. Id</th>
                                    <th>Branch Address</th>
                                    <th>Emp. Name</th>
                                    <th>Email</th>
                                    <th>Mobile</th>
                                    <th>Active/Inactive</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedList?.length > 0 ? (
                                    paginatedList?.map((val, id) => {
                                        return <tr key={id}>
                                            <td>{val?.emp_id}</td>
                                            <td>{val.branch_address}</td>
                                            <td>{val?.full_name}</td>
                                            <td>{val?.email}</td>
                                            <td>{val?.mobile}</td>
                                            <td><Switch checked={val.active} /></td>
                                            <td>
                                                <p ><CiEdit cursor='pointer' fontSize={20}
                                                    onClick={() => {
                                                        setSelectedRow(val)
                                                    }} /> </p>
                                            </td>
                                        </tr>
                                    })
                                ) : <tr>
                                    <td colSpan="6" style={{ textAlign: "center" }}>No Data Found</td>
                                </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    {agentList?.length > rowsPerPage &&
                        <div className={style.pagination_parent}>
                            <button onClick={handlePrev} disabled={currentPage === 1}>&lt;</button>
                            <span className={style.pagination_parent_pageno}>{currentPage}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages}>&gt;</button>
                        </div>
                    }
                </>
            }
        </div>
         {selectedRow &&
            <InternalAgentForm close={closeEditedAgent} selectedRow={selectedRow} />
        }
        </>
    )

}

export default InternalAgentList;