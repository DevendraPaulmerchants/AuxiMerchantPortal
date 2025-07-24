import React, { useEffect, useState } from 'react';
import style from "../Agent/Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';
import { dateFormat } from '../../helper';

function CreditDetails() {
    const { id } = useParams();
    const { token } = useContextData();
    console.log(id);
    const [creditDetails, setCreditDetails] = useState(null)
    const [isloading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        fetch(`${APIPath}credit-service/credit-request/fetch/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'Application/json'
            }
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setCreditDetails(data.data)
            })
            .catch((err) => {
                console.error(err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [id, token])

    const navigate = useNavigate();
    return <>
        <div className={style1.merchants_parent}>
            <div className={style.credit_details_container}>
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
                                        <h4 className={style.merchant_name}>Payment Method:
                                            <span>
                                                {creditDetails?.payment_method}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}>Requested Credits:
                                            <span>
                                                {creditDetails?.amount}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}>Requested At:
                                            <span>
                                                {dateFormat(creditDetails?.created_at)}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}>Payment Status:
                                            <span>
                                                {creditDetails?.payment_status}
                                            </span>
                                        </h4>
                                    </td>

                                </tr>
                                <div>Bank Details/UPI Details:</div>
                                <tr className={style.merchant_details_page_row}>
                                    {creditDetails?.payment_method === "UPI" ?
                                        <td>
                                            <h4 className={style.merchant_name}>UPI Id:
                                                <span>
                                                    {creditDetails?.upi_id}
                                                </span>
                                            </h4>
                                        </td> :
                                        <td>
                                            <h4 className={style.merchant_name}>Account Holder Name:
                                                <span>
                                                    {creditDetails?.account_holder_name}
                                                </span>
                                            </h4>
                                        </td>
                                    }
                                    {creditDetails?.payment_method === "UPI" ?
                                        <td>
                                            <h4 className={style.merchant_name}>Linked Mobile No:
                                                <span>
                                                    {creditDetails?.linked_mobile_no}
                                                </span>
                                            </h4>
                                        </td> :
                                        <td>
                                            <h4 className={style.merchant_name}>Account Number:
                                                <span>
                                                    {creditDetails?.acc_no}
                                                </span>
                                            </h4>
                                        </td>
                                    }
                                    {creditDetails?.payment_method !== "UPI" &&
                                        <td>
                                            <h4 className={style.merchant_name}>IFSC Code:
                                                <span>
                                                    {creditDetails?.ifsc_code}
                                                </span>
                                            </h4>
                                        </td>
                                    }
                                </tr>
                                {/* <h2 style={{fontSize:"16px", color:"rgba(38,38,38,0.8)"}}>Agent details:- </h2>
                                <tr>
                                    <td>
                                        <h4 className={style.merchant_name}>Name:
                                            <span>
                                                {creditDetails?.agent_sell_contact?.person_name}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}>Mobile:
                                            <span>
                                                {creditDetails?.agent_sell_contact?.person_mobile}
                                            </span>
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 className={style.merchant_name}>Email:
                                            <span>
                                                {creditDetails?.agent_sell_contact?.person_email}
                                            </span>
                                        </h4>
                                    </td>
                                </tr> */}
                            </tbody>
                        </table>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            >{creditDetails?.approval_status === "APPROVED" ? "✅ Approved" : "❌ Pending"}
                            </button>
                        </div>
                    </>

                }

            </div>
        </div>
    </>
}

export default CreditDetails