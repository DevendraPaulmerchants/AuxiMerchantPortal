import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "../Agent/Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function TicketDetails() {
    const { id } = useParams();
    const { token } = useContextData();
    console.log(id);
    const [queryDetails, setqueryDetails] = useState(null);
    const [agnent, setAgent] = useState(null);
    const [isloading, setIsLoading] = useState(false);

    const getqueryDetails = useCallback(() => {
        setIsLoading(true);
        fetch(`${APIPath}customer-service/agent-support-tickets/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setqueryDetails(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [id, token])

    useEffect(() => {
        if (!queryDetails?.merchant_agent_id) return;
        setIsLoading(true);
        fetch(`${APIPath}merchant-service/merchant-agent/${queryDetails?.merchant_agent_id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setAgent(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => setIsLoading(false))

    }, [queryDetails?.merchant_agent_id, token])

    const navigate = useNavigate();

    useEffect(() => {
        getqueryDetails()
    }, [getqueryDetails]);

    // const closeTicket=(id)=>{
    //     const Status=queryDetails?.status === "OPEN" ? "CLOSED" :"OPEN"
    //     const confirm=window.confirm(`Are you sure to ${Status} this query ?`);
    //     if(!confirm) return;
    //     setIsLoading(true);
    //     fetch(`${APIPath}customer-service/agent-support-tickets/${id}/status?status=${Status}`, {
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //             'Content-Type': "application/json",
    //         },
    //         method: "PATCH",
    //         mode: "cors"
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             console.log(data);
    //             setqueryDetails(data.data);
    //             getqueryDetails();
    //             alert(data.message);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         })
    //         .finally(() => {
    //             setIsLoading(false)
    //         })
    // }

    return <>
        <div className={style1.merchants_parent}>
            <div className={style.add_merchants_header}>
                <h2 style={{ cursor: "pointer" }} onClick={() => {
                    navigate(-1)
                }}><IoMdArrowRoundBack /></h2>
            </div>
            {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                <img src='/gold-coin.png' alt='Loading' />
            </div></div> :
                <>
                    <table className={style.merchant_details_page_table}>
                        <tbody>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>User Name:
                                        <span>
                                            {queryDetails?.agent_name || "Jitendra Kumar"}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Category:
                                        <span>
                                            {queryDetails?.category}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Subject:
                                        <span>
                                            {queryDetails?.subject}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Priority
                                        <span>
                                            {queryDetails?.priority}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Description:
                                        <span style={{ maxWidth: '200px' }}>
                                            {queryDetails?.description}
                                        </span>
                                    </h4>
                                </td>
                                <td >
                                    <h4 className={style.merchant_name}>Created At:
                                        <span>
                                            {queryDetails?.createdAt?.split("T")[0]}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Status:
                                        <span>{queryDetails?.status}</span>
                                    </h4>
                                </td>
                            </tr>
                            <p>Agent Details:</p>
                            <tr>
                                <td >
                                    <h4 className={style.merchant_name}>Agent Name:
                                        <span>
                                            {agnent?.merchant_agent_name}
                                        </span>
                                    </h4>
                                </td>
                                <td >
                                    <h4 className={style.merchant_name}>Agent Email:
                                        <span>
                                            {agnent?.sell_contact?.person_email}
                                        </span>
                                    </h4>
                                </td>
                                <td >
                                    <h4 className={style.merchant_name}>Agent Mobile no.:
                                        <span>
                                            {agnent?.sell_contact?.person_mobile}
                                        </span>
                                    </h4>
                                </td>
                                <td >
                                    <h4 className={style.merchant_name}>Is Agent Verified:
                                        <span>
                                            {agnent?.verification_status === "VERIFIED" ? "YES" : "NO"}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div className={style.add_merchats_btn_container}>
                        <button className={style.primary_login_btn}
                        // onClick={()=>closeTicket(queryDetails?.id)}
                        >{queryDetails?.status}
                            {/* {queryDetails?.status === "OPEN" && "CLOSE"} */}
                            {/* {queryDetails?.status === "CLOSED" && "CLOSED"} */}
                        </button>
                    </div>
                </>

            }
        </div>
    </>
}

export default TicketDetails;