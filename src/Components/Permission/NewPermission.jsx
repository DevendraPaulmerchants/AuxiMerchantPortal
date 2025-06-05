import React, { useState } from 'react';
// import style from "./Merchants.module.css";
import style from "../Agent/Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { handleInputChangeWithAlphabetOnly, handleInputChangeWithNumericValueOnly } from '../InputValidation/InputValidation';

function NewPermission({ close, selectedPermission,updateList }) {
    document.body.style.overflow = "hidden";
    console.log(selectedPermission)
    const [name, setName] = useState(selectedPermission?.name || "");
    const [description, setDescription] = useState(selectedPermission?.description || "");
    const [isLoading, setIsLoading] = useState(false);

    const newPermissionData = {
        name: name,
        description: description,
    }
    const addCredit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedPermission ? `http://192.168.1.41:8080/merchant-service/permissions/${selectedPermission.id}` :
            `http://192.168.1.41:8080/merchant-service/permissions`;
        const method = selectedPermission ? "PATCH" : "POST";
        fetch(url, {
            headers: {
                "Authorization":`Barear `,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newPermissionData)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                if (data.status_code === 409) {
                    alert(data.message);
                    return;
                }
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
                    <h2>Add credit to merchants</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addCredit(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Name* </label>
                            <input type='text' required placeholder='Enter name' maxLength={30} value={name}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setName)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Description</label>
                            <textarea placeholder='enter description' value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>
                                {selectedPermission?"Update Permission":"Create Permission"}</button>
                        </div>
                    }
                </form>
            </div>
        </div>


    </>
}

export default NewPermission;