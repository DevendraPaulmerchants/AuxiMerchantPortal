import React, { useState } from 'react';
import style from "../Agent/Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function AddQuery({ close, updateList }) {
    document.body.style.overflow = "hidden";
    const {token,merchantId} =useContextData();
    const [category, setCategory] = useState("");
    const [priority, setPriority] = useState("");
    const [subject,setSubject]=useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const newQuriesData = {
        createdBy:"MERCHANT",
        merchantId:merchantId,
        priority:priority,
        category: category,
        subject:subject,
        description: description,
    }
    const sendQuery = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${APIPath}customer-service/merchant-support-tickets`, {
            headers: {
                "Authorization":`Bearer ${token} `,
                "Content-Type": "application/json"
            },
            method: "POST",
            mode: "cors",
            body: JSON.stringify(newQuriesData)
        })
            .then((res) => res.json())
            .then((data) => {
                alert(data.message)
                close();
                updateList();
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }
    
    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Create Ticket</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => sendQuery(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Category* </label>
                            <select required value={category} onChange={(e) => setCategory(e.target.value)}>
                                <option value="" disabled>Select Category</option>
                                <option value="TECHNICAL">Technical</option>
                                <option value="OPERATIONAL">Operational</option>
                                <option value="BILLING">Billing</option>
                                <option value="GENERAL_INQUIRY"> General Inquiry</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Priority* </label>
                            <select required value={priority} onChange={(e) => setPriority(e.target.value)}>
                                <option value="" disabled>Select Priority</option>
                                <option value="HIGH">High</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="LOW">Low</option>
                                <option value="CRITICAL"> Critical</option>
                            </select>
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Subject:</label>
                            <input type='text' placeholder='enter subject..' required value={subject} maxLength={150}
                             onChange={(e) => setSubject(e.target.value)} />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Write Query:</label>
                            <textarea  placeholder='enter queries..' required value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>Send</button>
                        </div>
                    }
                </form>
            </div>
        </div>


    </>
}

export default AddQuery;