import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import style from "../Admin/Admin.module.css";
import style2 from "./Agent.module.css";
import style1 from "./Merchants.module.css";
import { IoSearch } from "react-icons/io5";
import Switch from '@mui/material/Switch';
import AddAgent from './AddAgent';
import FilterAgent from './FilterAgent';
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';
import { IoMdEye } from 'react-icons/io';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import InternalAgentList from './internal_agents/InternalAgentList';
import { dateFormat } from '../../helper';

function AgentList() {
    const { state } = useLocation();

    const { token, merchantId, agentParentList, setAgentParentList, getUserDetails } = useContextData();

    const [searchText, setSearchText] = useState("");
    const [agentList, setAgentList] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('')
    const [agentwithAccStatus, setAgentWithAccStatus] = useState(state || '');
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;
    const [isAddAgentClick, setIsAgentClick] = useState(false);
    const [isFilterClick, setIsFilterClick] = useState(false);
    const [isUpdateClick, setIsUpdateClick] = useState(false);
    // ------------------ Menu click -----------------
    const [isMenuClick, setIsMenuClick] = useState(false);
    // Check button ------------
    const [selected, setSelected] = useState('external');

    const handleSelect = (type) => {
        setSelected(type);
    };

    const closeUpdateForm = () => {
        setIsUpdateClick(false);
        setSelectedAgent(null);
    }
    const fetchAgentList = useCallback(() => {
        setIsLoading(true);
        if (agentParentList && agentParentList.length > 0) {
            setAgentList(agentParentList);
            setIsLoading(false);
            return;
        }
        fetch(`${APIPath}merchant-service/merchant-agent/all/${merchantId}?startDate=${startDate ? startDate : ''}&endDate=${endDate ? endDate : ''}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                setAgentList(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [startDate, endDate, merchantId, token, agentParentList])

    useEffect(() => {
        fetchAgentList();
    }, [fetchAgentList]);

    const clearFilter = () => {
        setAgentParentList(null);
    }
    const openAddAgentForm = () => {
        setIsAgentClick(true);
    }
    const closeAddAgentForm = () => {
        setIsAgentClick(false);
        setSelected('external')
    }
    const openFilteredForm = () => {
        setIsFilterClick(true);
    }
    const closeFilteredForm = () => {
        setIsFilterClick(false);
    }

    const filteredList = Array.isArray(agentList) ? agentList?.filter((list) => {
        // Filter by agentwithAccStatus
        if (agentwithAccStatus === "ACTIVE" && list.status !== 'ACTIVE') return false;
        if (agentwithAccStatus === "INACTIVE" && list.status !== 'INACTIVE') return false;
        // Filter by searchText
        return list?.merchant_agent_name?.toLowerCase().includes(searchText.toLowerCase());
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

    const navigate = useNavigate();
    const agentDetailsPage = (agentId) => {
        navigate(`/agent/id/${agentId}`)
    }
    const handleStatusChange = (status, verificationStatus, Id) => {
        if (!verificationStatus) {
            alert("Your KYC is not Approved Yet..");
            return;
        }
        const confirm = window.confirm("Are you sure you want to change this agent's status?");
        if (!confirm) return;
        setIsLoading(true);
        const Svalue = status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        const url = `${APIPath}merchant-service/merchant-agent/${Id}?merchant_agent_users_id=${Id}&status=${Svalue}`;
        console.log(url)
        fetch(url, {
            headers: {
                'AUthorization': `Bearer ${token}`,
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
                    setIsLoading(false);
                    return
                }
                else {
                    fetchAgentList();
                    setIsLoading(false);
                    getUserDetails();
                }
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });

    }

    const deleteSelectedAgent = () => {
        console.log(selectedAgent);
        const confirm = window.confirm("Are you sure to delete this agent..");
        if (!confirm) return;
        fetch(`${APIPath}merchant-service/merchant-agent/${selectedAgent?.id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "Application/json"
            },
            method: "DELETE",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message);
                fetchAgentList();
            })
            .catch((err) => {
                console.error(err);
                fetchAgentList();
            })
    }

    return <>
        <div className={style.merchants_parent}
            onClick={(e) => {
                e.preventDefault()
                if (isMenuClick) {
                    setIsMenuClick(false);
                }
            }}
        >
            {/* -------- External or Internal agents ---------- */}
            <div className={style2.internal_external_button_container}>
                <div className={style2.external_agent}>
                    <input
                        type="checkbox"
                        checked={selected === 'external'}
                        onChange={() => handleSelect('external')}
                    />
                    <button onClick={() => handleSelect('external')} >
                        External Agents
                    </button>
                </div>

                <div className={style2.external_agent}>
                    <input
                        type="checkbox"
                        checked={selected === 'internal'}
                        onChange={() => handleSelect('internal')}
                    />
                    <button onClick={() => handleSelect('internal')}>
                        Internal Agents
                    </button>
                </div>

            </div>

            <div className={style.merchants_parent_subheader}>
                <div className={style.search_input_field}>
                    <input type='text' placeholder='Search by agent name...' maxLength={12} value={searchText}
                        onChange={(e) => { setSearchText(e.target.value); setCurrentPage(1) }} />
                    <IoSearch />
                </div>
                {/* ------- Date wise FIlter -------------- */}
                {selected === 'external' &&
                    <div className={style2.start_date_and_end_date}>
                        <div>
                            <label>Filter by: </label>
                            <DatePicker className={style2.date_input}
                                placeholderText='Select start date'
                                maxDate={new Date()}
                                selected={startDate}
                                onChange={(date) => {
                                    setStartDate(date?.toLocaleDateString()?.split("T")[0]);
                                }}
                            />
                        </div>
                        <div>
                            <DatePicker className={style2.date_input}
                                disabled={!startDate}
                                minDate={startDate}
                                maxDate={new Date()}
                                selected={endDate}
                                onChange={(date) => setEndDate(date?.toLocaleDateString()?.split("T")[0])}
                                placeholderText='Select end date' />
                        </div>
                    </div>
                }
                <div style={{ display: "flex", gap: "16px", justifyContent: 'space-between' }}>
                    <div style={{ width: '100%' }}>
                        {/* <label style={{fontSize:'12px'}}>Filter By Status : </label> */}
                        <select style={{ width: '100%' }} className={style2.merchants_select} value={agentwithAccStatus}
                            onChange={(e) => { setAgentWithAccStatus(e.target.value) }}>
                            <option value="" disabled>Select Status</option>
                            <option value="all">All</option>
                            <option value="INACTIVE">Inactive</option>
                            <option value="ACTIVE">Active</option>
                        </select>
                    </div>
                    <div className={style.add_merchants_and_filter}>
                        <button onClick={openAddAgentForm} className={style1.primary_login_btn}>Add Agent</button>
                        {agentParentList?.length > 0 &&
                            <button onClick={clearFilter} className={style1.primary_login_btn} style={{ padding: "0px 40px" }}>Reset</button>
                            // <button onClick={openFilteredForm} className={style1.primary_login_btn} style={{ padding: "0px 40px" }}>Filter</button>
                        }
                    </div>
                </div>
            </div>
            {isLoading ? <div className={style1.loader_container}>
                <div className={style1.loader_item}>
                    <img src='/gold-coin.png' alt='Gold Coin' />
                </div>
            </div> :
                selected === 'internal' ? <InternalAgentList
                    searchText={searchText}
                    agentwithAccStatus={agentwithAccStatus}
                /> :
                    <>
                        <div className={style.table_wrapper}>
                            <table className={style.merchants_list_container} >
                                <thead>
                                    <tr>
                                        <th>Agent Name</th>
                                        <th>Org./Brand Name</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Kyc Status</th>
                                        <th>Created At</th>
                                        <th>Active/Inactive</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedList?.length > 0 ? (
                                        paginatedList?.map((val, id) => {
                                            return <tr key={id}>
                                                <td>{val?.sell_contact?.person_name}</td>
                                                <td>{val?.merchant_agent_brand_name}</td>
                                                <td>{val?.sell_contact?.person_email}</td>
                                                <td>{val?.sell_contact?.person_mobile}</td>
                                                <td>{val?.kyc_status ? "Approved" : "Pending"}</td>
                                                <td>{dateFormat(val.created_at)}</td>
                                                <td>
                                                    <Switch checked={val.status.toLowerCase() === "active"}

                                                        onClick={() => {
                                                            handleStatusChange(val.status, val.kyc_status, val.id)
                                                        }} />
                                                </td>
                                                <td><p style={{ cursor: "pointer" }}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setIsMenuClick(!isMenuClick);
                                                        setSelectedAgent(val);
                                                    }}
                                                ><IoMdEye /></p>
                                                    {isMenuClick && selectedAgent?.id === val.id &&
                                                        <div className={style2.row_actions}>
                                                            <ul className={style.user_menu_list}>
                                                                <li onClick={() => {
                                                                    agentDetailsPage(selectedAgent?.id);
                                                                }}>View & Verify</li>
                                                                <li onClick={() => { setIsUpdateClick(true); }}>Update</li>
                                                            </ul>
                                                        </div>
                                                    }
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
        {isAddAgentClick && <AddAgent close={closeAddAgentForm}
            updateList={fetchAgentList}
        />}
        {isFilterClick && <FilterAgent close={closeFilteredForm} />}
        {isUpdateClick && <AddAgent close={closeUpdateForm}
            selectedAgent={selectedAgent}
            updateList={fetchAgentList}
        />}
    </>
}

export default AgentList;