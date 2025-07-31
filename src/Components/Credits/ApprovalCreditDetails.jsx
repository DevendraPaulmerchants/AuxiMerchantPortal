import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
// import style from "./Merchants.module.css";
import style from "../Agent/Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import ApprovalForm from './ApprovalForm';
import { dateFormat } from '../../helper';
// import ApprovalForm from './ApprovalForm';

function ApprovalCreditDetails() {
    const { id } = useParams();
    const { token } = useContextData();
    const [creditDetails, setCreditDetails] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [isApprovebtnClick, setIsApprovebtnClick] = useState(false)

    const getCreditDetails = () => {
        setIsLoading(true);
        fetch(`${APIPath}credit-service/credit-request/fetch/${id}`, {
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
                setCreditDetails(data.data);
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    const navigate = useNavigate();
    useEffect(() => {
        getCreditDetails()
    }, [id]);

    const openApproveForm = () => {
        if (creditDetails?.payment_status !== "SUCCESSFUL") {
            alert("Please Verify Payment First...");
            return;
        }
        if (creditDetails?.approval_status === "APPROVED") {
            alert("Credits Already Approved...");
            return;
        }
        setIsApprovebtnClick(true)
    }
    const closeApproveForm = () => {
        setIsApprovebtnClick(false);
        getCreditDetails();
    }
    const approvePayment = (id) => {
        if (creditDetails?.payment_status === "SUCCESSFUL") {
            alert("Payment Already Approved...");
            return;
        }
        setIsLoading(true);
        fetch(`${APIPath}credit-service/credit-request/approve/payment-status/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "PUT",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                alert(data.message);
                getCreditDetails();
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
            <div className={style1.credit_details_container}>
                <div className={style.add_merchants_header}>
                    <button className='back_button' onClick={() => {
                        navigate(-1)
                    }}><IoMdArrowRoundBack /></button>
                </div>
                {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                    <img src='/gold-coin.png' alt='Loading' />
                </div></div> :
                    <>
                        {creditDetails === null ? <p>Data not Found</p>
                            :
                            <>
                                <div className={style.first_row_details}>
                                    <h4 className={style.merchant_name}>Agent`s Name:<span>{creditDetails?.agent_merchant_agent_name || "vikash basant"}</span></h4>
                                    <h4 className={style.merchant_name}>Requested Credits:<span>{creditDetails?.amount}</span></h4>
                                    <h4 className={style.merchant_name}>Requested At:<span>{dateFormat(creditDetails?.created_at)}</span></h4>
                                </div>
                                <div className={style.first_row_details}>
                                    <h4 className={style.merchant_name}>Transaction Type:<span>{creditDetails?.transaction_type}</span></h4>
                                    <h4 className={style.merchant_name}>Payment Method:<span>{creditDetails?.payment_method}</span></h4>
                                </div>
                                <div className={style.first_row_details}>
                                    <h4 className={style.merchant_name}>Approval Status:<span>{creditDetails?.approval_status}</span></h4>
                                    <h4 className={style.merchant_name}>Payment Status:<span>{creditDetails?.payment_status}</span></h4>
                                    <h4 className={style.merchant_name}>Credit Request Status:<span>{creditDetails?.status}</span></h4>
                                </div>
                                <h3>Account details</h3>
                                <h4>Credited to :</h4>
                                <div className={style.first_row_details}>
                                    <h4 className={style.merchant_name}>A/c Holder Name:<span>{creditDetails?.account_holder_name}</span></h4>
                                    <h4 className={style.merchant_name}>A/c Number:<span>{creditDetails?.acc_no}</span></h4>
                                    <h4 className={style.merchant_name}>IFSC Code:<span>{creditDetails?.ifsc_code}</span></h4>
                                </div>
                                <div className={style.add_merchats_btn_container}>
                                    <button className={style.primary_login_btn}
                                        onClick={() => approvePayment(creditDetails?.id)}
                                    >{creditDetails?.payment_status === 'SUCCESSFUL' ? '✅ Payment Approved' : 'Approve Payment'}</button>
                                    <button className={style.primary_login_btn}
                                        disabled={creditDetails?.payment_status !== "SUCCESSFUL"}
                                        onClick={openApproveForm}
                                    >{creditDetails?.approval_status === 'PENDING' ? 'Approve Request' :
                                        creditDetails?.approval_status === '❌ REJECTED' ? 'Rejected' : ' ✅ Approved'
                                        }</button>
                                    {creditDetails?.approval_status === 'PENDING' &&
                                        <button className={style.primary_login_btn}>Reject Request</button>
                                    }
                                </div>
                            </>
                        }
                    </>
                }
            </div>
        </div>
        {isApprovebtnClick && <ApprovalForm
            close={closeApproveForm}
            creditId={creditDetails?.id}
        />}
    </>
}

export default ApprovalCreditDetails;