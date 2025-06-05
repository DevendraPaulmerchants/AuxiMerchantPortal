import React, { useState } from 'react';
import style from "./Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { handleInputChangeWithAlphabetOnly } from '../InputValidation/InputValidation';
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function FilterAgent({ close }) {
    const {token,setAgentParentList}=useContextData();
    document.body.style.overflow="hidden"; 
    const [agentName, setAgentName] = useState(null);
    const [agentId, setAgentId] = useState(null);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const filterData={
        agent_name:agentName,
        merchant_agent_users_id:agentId,
        from_date:fromDate,
        to_date:toDate
    }
    const filteAgentList = (e) => {
        e.preventDefault();
        if(agentName || agentId || fromDate || toDate){
            console.log(filterData);
            setIsLoading(true);
            fetch(`${APIPath}/merchant-service/merchant-agent/search`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': "Application/json"
                },
                method: "POST",
                body: JSON.stringify(filterData),
                mode: 'cors'
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data.data);
                    setAgentParentList(data.data);
                    setIsLoading(false);
                    close();
                }).catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                })
        }
        else{
            alert("Please fill at least one field");
            return
        }
    }

    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Filter Agent</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => filteAgentList(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Agent Name</label>
                            <input type='text' placeholder='Enter agent name' maxLength={50} value={agentName}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setAgentName)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>AgentId</label>
                            <input type='text' placeholder='Enter AgentId' maxLength={20} value={agentId}
                                onChange={(e) => setAgentId(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>From date </label>
                            <input type='date' placeholder='from date' value={fromDate}
                                // min={new Date().toISOString().split("T")[0]}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>To date </label>
                            <input type='date' required placeholder='to date' maxLength={40} value={toDate}
                                min={fromDate}
                                onChange={(e) => setToDate(e.target.value)}
                                disabled={!fromDate}
                            />

                        </div>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>Apply</button>
                        </div>
                    }

                </form>
            </div>
        </div>
    </>
}

export default FilterAgent;