import React, { useEffect, useState } from 'react';
import style1 from "../Admin/Admin.module.css";
import style2 from "../Agent/Agent.module.css";
import style from "../Agent/Merchants.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { dateAndTimeFormat } from '../../helper';

function CustomerDetails() {
    const { customerId } = useParams();
    const { token } = useContextData();
    console.log(customerId);
    const [isloading, setIsloading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [agentdetails, setAgentDetails] = useState(null);

    const getDetails = () => {
        setIsloading(true)
        fetch(`${APIPath}customer-service/api/customers/${customerId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setSelectedCustomer(data.data);
                if (data.data?.merchant_agent_id) {
                    fetch(`${APIPath}merchant-service/merchant-agent/${data.data?.merchant_agent_id}`, {
                        headers: {
                            "Authorization": `Bearer ${token}`,
                            "Content-Type": "Application/json",
                        },
                        method: "GET",
                        mode: "cors"
                    })
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data.data)
                            setAgentDetails(data.data)
                        })
                        .catch((err) => {
                            console.log(err);
                        })
                }
                setIsloading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsloading(false);
            })
    }

    useEffect(() => {
        getDetails();
    }, [])

    const navigate = useNavigate();
    const handleKycStatus = (id) => {
        const confirm = window.confirm("Are you sure you want to approve the KYC for this customer? This action cannot be undone.");
        if (!confirm) return
        setIsloading(true)
        fetch(`${APIPath}customer-service/api/customers/kyc-status/${id}?kycStatus=VERIFIED`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json",
            },
            method: "PATCH",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                getDetails();
                setIsloading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsloading(false);
            })
    }

    return (
        <div className={style1.merchants_parent}>
            <div className={style.add_merchants_header}>
                <button
                    className={style2.back_arrow}
                    onClick={() => navigate('/customer')}
                    aria-label="Go back to customer list"
                    tabIndex={0}
                    type="button"
                >
                    <IoMdArrowRoundBack />
                </button>
                {/* <h2>Customer Details</h2> */}
            </div>
            {isloading ? (
                <div className={style.loader_container}>
                    <div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold Coin' />
                    </div>
                </div>
            ) : (
                <>
                    <div className={style.customer_details_first_row}>
                        <h4 className={style.merchant_name}>
                            Name: <span>{selectedCustomer?.full_name}</span>
                        </h4>
                        <h4 className={style.merchant_name}>
                            Email: <span>{selectedCustomer?.email}</span>
                        </h4>
                        <h4 className={style.merchant_name}>
                            Mobile No.: <span>{selectedCustomer?.phone}</span>
                        </h4>
                        <h4 className={style.merchant_name}>
                            Agent Name: <span>{agentdetails?.merchant_agent_name ? agentdetails.merchant_agent_name : ""}</span>
                        </h4>
                    </div>
                    <div className={style.customer_details_first_row}>
                        <h4 className={style.merchant_name}>
                            Current Address: <span>
                                {selectedCustomer?.current_street}{" "}
                                {selectedCustomer?.current_city} 
                                {selectedCustomer?.current_state}{" "}
                                {selectedCustomer?.current_country}{" "}
                                {selectedCustomer?.current_postal_code}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>
                            Created At: <span>{dateAndTimeFormat(selectedCustomer?.created_at)}</span>
                        </h4>
                    </div>
                    <div className={style.customer_details_first_row}>
                        <h4 className={style.merchant_name}>
                            KYC Status: <span>{selectedCustomer?.kyc_status}</span>
                        </h4>
                        <h4 className={style.merchant_name}>
                            Aadhar No: <span>{selectedCustomer?.aadhaar_no || "XXXX4567"}</span>
                        </h4>
                        <h4 className={style.merchant_name}>
                            PAN No: <span>{selectedCustomer?.pan_no || "XXXX678C"}</span>
                        </h4>
                    </div>
                    {selectedCustomer?.wallets?.map((val) => {
                        if (val.walletType === "SILVER") {
                            return (
                                <div className={style.customer_details_first_row} key={val.walletType}>
                                    <h4 className={style.merchant_name}>
                                        Current Avl. Silver:&nbsp;
                                        <span>{val.metalQuantity || 0.00}g</span>
                                    </h4>
                                    <h4 className={style.merchant_name}>
                                        Invested Amount for Silver:&nbsp;
                                        <span>₹ {val.totalInvested || 0}</span>
                                    </h4>
                                </div>
                            );
                        }
                        if (val.walletType === "GOLD") {
                            return (
                                <div className={style.customer_details_first_row} key={val.walletType}>
                                    <h4 className={style.merchant_name}>
                                        Current Avl. Gold:&nbsp;
                                        <span>{val.metalQuantity || 0.00}g</span>
                                    </h4>
                                    <h4 className={style.merchant_name}>
                                        Invested Amount for Gold:&nbsp;
                                        <span>₹ {val.totalInvested || 0}</span>
                                    </h4>
                                </div>
                            );
                        }
                        if (val.walletType === "FUND") {
                            return (
                                <div className={style.customer_details_first_row} key={val.walletType}>
                                    <h4 className={style.merchant_name}>
                                        Avl. Funds Balance:&nbsp;
                                        <span>₹ {val.balance || 0}</span>
                                    </h4>
                                </div>
                            );
                        }
                        return null;
                    })}
                    <div>
                        <button
                            className={style.primary_login_btn}
                            onClick={() => handleKycStatus(selectedCustomer?.id)}
                        >
                            {selectedCustomer?.kyc_status === "VERIFIED" ? "✅ Verified" : "❌ Verify KYC"}
                        </button>
                    </div>
                    <br />
                    <br />
                </>
            )}
        </div>
    );
}

export default CustomerDetails;