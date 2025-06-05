import React, { useState } from 'react';
// import style from "./Merchants.module.css";
import style from "../Agent/Merchants.module.css"
import { IoMdClose } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { data, useNavigate } from 'react-router-dom';
import { APIPath } from '../ApIPath/APIPath';

function 
ApprovalForm({ close,creditId}) {
    console.log(creditId);
    const {token,getUserDetails} =useContextData()
    const [approvalDescription, setApprovalDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [approvalStatus,setApprovalStatus]=useState("");

    const approvalData={
        // merchant_id:merchantId,
        approval_coment:approvalDescription,
        approval_status:approvalStatus
    }
    const navigate=useNavigate();

    const handleApprovalAction=(e)=>{
        e.preventDefault();
        console.log(approvalData);
        setIsLoading(true);
        fetch(`${APIPath}credit-service/credit-request/approve/${creditId}`,{
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':"Application/json"
            },
            method:"PUT",
            // body:JSON.stringify(approvalData),
            mode:"cors"
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.status_code === 666){
                alert(` ${data.message?.split(":")[0]} Insufficient available credits`);
                return
            }
            if(data.status_code !== 200){
                alert(data.message);
                return
            }
            console.log(data);
            alert(data.message);
            close();
            getUserDetails();
        })
        .catch((err)=>{
            console.error(err);
            alert(data.message);
            return
        }).finally(()=>setIsLoading(false))
    }
    const handleRejectAction=(e)=>{
        e.preventDefault();
        console.log(approvalData);
        setIsLoading(true);
        fetch(`${APIPath}credit-service/credit-request/reject/${creditId}`,{
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-Type':"Application/json"
            },
            method:"PUT",
            mode:"cors"
        })
        .then((res)=>res.json())
        .then((data)=>{
            console.log(data);
            if(data.status_code !== 200){
                alert(data.message);
                return
            }
            console.log(data);
            alert(data.message);
            close();
            navigate("/credits");
        })
        .catch((err)=>{
            console.error(err);
            alert(data.message);
            return
        }).finally(()=>setIsLoading(false))
    }
    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Approve credits for the merchant</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form 
                // onSubmit={(e)=>handleCreditAction(e)}
                >
                    <div className={style.name_label_input_contaner}>
                        <label>Approval Coments(optional) </label>
                        <textarea type='text'  placeholder='Enter description' maxLength={150} value={approvalDescription}
                            onChange={(e) => setApprovalDescription(e.target.value)}
                            style={{ width: "96%" }} />
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> : <div className={style.approve_and_reject_btn_container}>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={(e)=>{setApprovalStatus("reject");handleRejectAction(e)}}
                            >Reject</button>
                        </div>
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}
                            onClick={(e)=>{setApprovalStatus("approved");handleApprovalAction(e)}}
                            >Approve</button>
                        </div>
                    </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default ApprovalForm;