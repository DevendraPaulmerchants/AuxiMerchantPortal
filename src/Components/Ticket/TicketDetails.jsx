import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "../Agent/Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoIosExpand, IoMdArrowRoundBack } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';
import CommentPopUp from './CommentPopUp';
import { dateFormat } from '../../helper';
import DocMaxView from '../docMaxView/DocMaxView';
import Comments from '../comments/Comments';

function TicketDetails() {
    const { id } = useParams();
    const { token, merchantId } = useContextData();
    const [queryDetails, setqueryDetails] = useState(null);
    const [agnent, setAgent] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [openComments, setOpenComments] = useState(false);
    const [openFile, setOpenFile] = useState(null)

    const getqueryDetails = useCallback(() => {
        setIsLoading(true);
        // const url=`${APIPath}customer-service/agent-support-tickets/${id}`
        const url = `${APIPath}ticket-service/tickets/${id}?requestingUserType=AGENT`
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
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

    const sendToAuxiVaults = (ticketId) => {
        setIsLoading(true);
        fetch(`${APIPath}ticket-service/tickets/${ticketId}/escalate?escalatedByUserId=${merchantId}&escalatedByUserType=AGENT`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "POST",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                alert(data.message);
                getqueryDetails();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return <>
        <div className={style1.merchants_parent}>
            <div className={style.add_merchants_header}>
                <button className='back_button' onClick={() => {
                    navigate(-1)
                }}><IoMdArrowRoundBack /></button>
            </div>
            {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                <img src='/gold-coin.png' alt='Loading' />
            </div></div> :
                <>
                    <div className={style.first_row_details}>
                        <h4 className={style.merchant_name}>User Name:<span>{queryDetails?.agent_name || "Jitendra Kumar"}</span></h4>
                        <h4 className={style.merchant_name}>Category:<span>{queryDetails?.issueType}</span></h4>
                        <h4 className={style.merchant_name}>Description:<span>{queryDetails?.description}</span></h4>
                    </div>
                    <div className={style.first_row_details}>
                        <h4 className={style.merchant_name}>Priority<span>{queryDetails?.priority}</span></h4>
                        <h4 className={style.merchant_name}>Created At:<span>{dateFormat(queryDetails?.createdAt)}</span></h4>
                        <h4 className={style.merchant_name}>Status:<span>{queryDetails?.status}</span></h4>
                    </div>
                    <p>Agent Details:</p>
                    <div className={style.first_row_details}>
                        <h4 className={style.merchant_name}>Agent Name:<span>{agnent?.merchant_agent_name}</span></h4>
                        <h4 className={style.merchant_name}>Agent Email:<span>{agnent?.sell_contact?.person_email}</span></h4>
                        <h4 className={style.merchant_name}>Agent Mobile no.:<span>{agnent?.sell_contact?.person_mobile}</span></h4>
                        <h4 className={style.merchant_name}>Is Agent Verified:<span>{agnent?.verification_status === "VERIFIED" ? "YES" : "NO"}</span></h4>
                    </div>
                    <h2 style={{
                        fontSize: '16px',
                        color: '#000',
                        fontWeight: '500'
                    }}>Attachments:</h2>
                    <div className={style.ticket_details_container}>
                        {queryDetails?.attachments?.map((doc, id) => (
                            <div key={doc} className={style.tickets_details_image}>
                                <iframe src={doc}
                                    title='Attachment'
                                />
                                <button className={style.expand_button}
                                    onClick={() => {
                                        console.log("Clicked", doc)
                                        setOpenFile(doc)
                                    }}
                                ><IoIosExpand /></button>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        border: '1px solid rgba(38,38,38,0.5)',
                        borderRadius: '10px'
                    }}>
                        <h2 style={{
                            fontSize: '16px',
                            color: '#000',
                            fontWeight: '500',
                            textAlign:'center'
                        }}>Previous Comments:</h2>
                        <Comments comments={queryDetails?.comments} />
                    </div>
                    <div className={style.add_merchats_btn_container}>
                        <button className={style.primary_login_btn}
                            onClick={() => setOpenComments(true)}
                        >{(queryDetails?.status === 'CLOSED' || '') ? '✅ Closed' : 'Reply'}
                        </button>
                        <button className={style.primary_login_btn}
                            onClick={(e) => {
                                e.preventDefault();
                                sendToAuxiVaults(queryDetails?.ticketId);
                            }}
                        >Send to Auxi Vault
                        </button>
                    </div>
                </>
            }
        </div >
        {openComments && <CommentPopUp close={() => setOpenComments(false)} ticketId={id} updateDetails={getqueryDetails} />}
        {openFile !== null && <DocMaxView doc={openFile} close={()=>setOpenFile(null)} />}
    </>
}

export default TicketDetails;