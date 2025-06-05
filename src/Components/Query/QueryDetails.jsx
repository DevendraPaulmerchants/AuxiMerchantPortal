import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "../Agent/Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoMdArrowRoundBack } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function QueryDetails() {
    const { id } = useParams();
    const {token} =useContextData();
    console.log(id);
    const [queryDetails, setqueryDetails] = useState(null);
    const [isloading, setIsLoading] = useState(false);

    const getqueryDetails = () => {
        setIsLoading(true);
        fetch(`${APIPath}customer-service/merchant-support-tickets/${id}`, {
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
    }
    const navigate = useNavigate();
    useEffect(() => {
        getqueryDetails()
    }, [id]);

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
                                            {queryDetails?.createdBy || "Jitendra"}
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
                                        <span style={{maxWidth:'200px'}}>
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
                            </tr>
                        </tbody>
                    </table>
                    <div className={style.add_merchats_btn_container}>
                        <button className={style.primary_login_btn}
                        >
                            {queryDetails?.status}
                        </button>
                    </div>
                </>

            }
        </div>
    </>
}

export default QueryDetails;