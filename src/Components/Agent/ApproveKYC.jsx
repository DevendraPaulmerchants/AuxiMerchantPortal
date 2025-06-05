import React, { useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function ApproveKYC({ close, docType, agentId }) {
    console.log(docType);
    const { token } = useContextData();
    const [approvalDescription, setApprovalDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const rejectedData = {
        ...(docType === "AADHAAR" &&
        {
            aadhaar_verification_status: "REJECTED",
            aadhaar_rejection_reason: approvalDescription,
        }),
        ...(docType === "PAN" &&
        {
            pan_verification_status: "REJECTED",
            pan_rejection_reason: approvalDescription
        }),
    }

    const rejectDocument = () => {
        setIsLoading(true);
        fetch(`${APIPath}merchant-service/merchant-agent/${docType.toLowerCase()}-verification-status/${agentId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json",
            },
            method: "PATCH",
            body: JSON.stringify(rejectedData),
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setIsLoading(false);
                close();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            })
    }
    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Comments</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => rejectDocument(e)}>
                    <div className={style.name_label_input_contaner}>
                        <label>Rejected Comments </label>
                        <textarea type='text' required placeholder='Enter description' maxLength={150} value={approvalDescription}
                            onChange={(e) => setApprovalDescription(e.target.value)}
                            style={{ width: "96%" }} />
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> : <div className={style.approve_and_reject_btn_container}>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            // onClick={()=>setApprovalStatus("REJECTED")}
                            >Reject</button>
                        </div>
                        {/* <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={()=>setApprovalStatus("APPROVED")}
                            >Approved</button>
                        </div> */}
                    </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default ApproveKYC;