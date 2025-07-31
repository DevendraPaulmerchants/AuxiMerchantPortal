import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import style from "../Agent/Merchants.module.css";
import style1 from "../Admin/Admin.module.css"
import { IoIosExpand, IoMdArrowRoundBack } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function QueryDetails() {
    const { id } = useParams();
    const { token } = useContextData();
    const [queryDetails, setqueryDetails] = useState(null);
    const [isloading, setIsLoading] = useState(false);
    const [openFile, setOpenFile] = useState(null)

    const getqueryDetails = () => {
        setIsLoading(true);
        // const url=`${APIPath}customer-service/merchant-support-tickets/${id}`;
        const url = `http://103.171.97.105:8070/ticket-service/tickets/${id}?requestingUserType=MERCHANT`;
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
    }
    const navigate = useNavigate();
    useEffect(() => {
        getqueryDetails()
    }, [id]);

    return (
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
                        <h4 className={style.merchant_name}>User Name:<span>{queryDetails?.createdBy || "Jitendra"}</span></h4>
                        <h4 className={style.merchant_name}>Category:<span>{queryDetails?.issueType}</span></h4>
                        <h4 className={style.merchant_name}>Priority<span>{queryDetails?.priority}</span></h4>
                    </div>
                    <div className={style.first_row_details}>
                        <h4 className={style.merchant_name}>Description:<span style={{ maxWidth: '200px' }}>{queryDetails?.description}</span></h4>
                        <h4 className={style.merchant_name}>Created At:<span>{queryDetails?.createdAt?.split("T")[0]}</span></h4>
                    </div>
                    <div className={style.ticket_details_container}>
                        {queryDetails?.attachments?.map((doc, id) => (
                            <div key={doc} className={style.tickets_details_image}>
                                <iframe src={doc}
                                    title='Attachment'
                                />
                                <button className={style.expand_button}
                                onClick={()=>{
                                    console.log("Clicked",doc)
                                    setOpenFile(doc)
                                }}
                                ><IoIosExpand /></button>
                            </div>
                        ))}
                    </div>
                    <div className={style.add_merchats_btn_container}>
                        <button className={style.primary_login_btn}>{queryDetails?.status}</button>
                    </div>
                </>
            }
        </div >
    )
}

export default QueryDetails;