import React, { useEffect, useState } from 'react';
import style1 from "../Admin/Admin.module.css";
import style2 from "../Agent/Agent.module.css";
import style from "../Agent/Merchants.module.css";
import { useNavigate, useParams } from 'react-router-dom';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import { IoMdArrowRoundBack } from 'react-icons/io';

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

    return <>
        <div className={style1.merchants_parent}>
            <div className={style.add_merchants_header}>
                <h2 className={style2.back_arrow}
                    onClick={() => {
                        navigate('/customer');
                    }}><IoMdArrowRoundBack /></h2>
                {/* <h2>Customer Details</h2> */}
            </div>
            {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                <img src='/gold-coin.png' alt='Gold Coin' />
            </div></div> :
                <>
                    <table className={style.merchant_details_page_table}>
                        <tbody>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Name:
                                        <span>{selectedCustomer?.full_name}</span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Email:
                                        <span>
                                            {selectedCustomer?.email}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Mobile No. :
                                        <span>
                                            {selectedCustomer?.phone}
                                        </span>
                                    </h4>
                                </td>
                            </tr>

                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>Current Address:
                                        <span>
                                            {selectedCustomer?.current_street}{" "}
                                            {selectedCustomer?.current_city}{" "}
                                            {selectedCustomer?.current_state}{" "}
                                            {selectedCustomer?.current_country}{" "}
                                            {selectedCustomer?.current_postal_code}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                            <tr className={style.merchant_details_page_row}>
                                <td>
                                    <h4 className={style.merchant_name}>KYC Status:
                                        <span>
                                            {selectedCustomer?.kyc_status}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>Aadhar No:
                                        <span>
                                            {selectedCustomer?.aadhaar_no || "XXXX4567"}
                                        </span>
                                    </h4>
                                </td>
                                <td>
                                    <h4 className={style.merchant_name}>PAN No:
                                        <span>
                                            {selectedCustomer?.pan_no || "XXXX678C"}
                                        </span>
                                    </h4>
                                </td>
                            </tr>
                            {selectedCustomer?.wallets?.map((val) => {
                                if (val.walletType === "SILVER") {
                                    return (
                                        <tr className={style.merchant_details_page_row}>
                                            <React.Fragment key={val.walletType}>
                                                <td>
                                                    <h4 className={style.merchant_name}>Current Avl. Silver:
                                                        <span>
                                                            {val.metalQuantity || 0.00}g
                                                        </span>
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4 className={style.merchant_name}>Invested Amount for Silver:
                                                        <span>
                                                            ₹ {val.totalInvested || 0}
                                                        </span>
                                                    </h4>
                                                </td>
                                            </React.Fragment>
                                        </tr>
                                    );
                                }
                                if (val.walletType === "GOLD") {
                                    return (
                                        <tr className={style.merchant_details_page_row}>
                                            <React.Fragment key={val.walletType}>
                                                <td>
                                                    <h4 className={style.merchant_name}>Current Avl. Gold:
                                                        <span>
                                                            {val.metalQuantity || 0.00}g
                                                        </span>
                                                    </h4>
                                                </td>
                                                <td>
                                                    <h4 className={style.merchant_name}>Invested Amount for Gold:
                                                        <span>
                                                            ₹ {val.totalInvested || 0}
                                                        </span>
                                                    </h4>
                                                </td>
                                            </React.Fragment>
                                        </tr>
                                    );
                                }
                                if (val.walletType === "FUND") {
                                    return (
                                        <tr className={style.merchant_details_page_row}>
                                            <React.Fragment key={val.walletType}>
                                                <td>
                                                    <h4 className={style.merchant_name}>Avl. Funds Balance:
                                                        <span>
                                                            ₹ {val.balance || 0}
                                                        </span>
                                                    </h4>
                                                </td>
                                            </React.Fragment>
                                        </tr>
                                    );
                                }
                            })}

                        </tbody>
                    </table>
                    <div>
                        <button className={style.primary_login_btn}
                            onClick={() => handleKycStatus(selectedCustomer?.id)}
                        >{selectedCustomer?.kyc_status === "VERIFIED" ? "✅ Verified" : "❌ Verify KYC"}</button>
                    </div>
                    <br />
                    <br />
                </>
            }
        </div>
    </>
}

export default CustomerDetails;