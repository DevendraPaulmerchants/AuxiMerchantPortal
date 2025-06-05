import React, { useState, useEffect } from 'react';
import style from "../Agent/Merchants.module.css"
import { IoMdClose } from "react-icons/io";
import { handleIFSC, handleInputChangeWithAlphabetOnly, handleInputChangeWithNumericValueOnly } from '../InputValidation/InputValidation';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';

function AddNewBank({ close, selectedAccount,updateList }) {
    document.body.style.overflow = "hidden";
    const {token,merchantId}=useContextData();
    const [bankHolderName, setBankHolderName] = useState(selectedAccount?.account_holder_name || "");
    const [bankName, setBankName] = useState(selectedAccount?.bank_name || "");
    const [branchName, setBranchName] = useState(selectedAccount?.branch_name || "");
    const [accountNumber, setAccountNumber] = useState(selectedAccount?.account_number || "");
    const [ifscCode, setIFSCCode] = useState(selectedAccount?.ifsc_code || "");
    const [isIFSC, setIsIFSC] = useState(true);
    const [accountType, setAccountType] = useState(selectedAccount?.account_type || "");
    const [isLoading, setIsLoading] = useState(false);


    const newBankData = {
        account_holder_name: bankHolderName,
        bank_name: bankName,
        branch_name: branchName,
        account_number: accountNumber,
        ifsc_code: ifscCode,
        account_type: accountType,
        merchant_id:merchantId

    }
    const addPermission = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedAccount ? `${APIPath}merchant-service/bank-accounts/${selectedAccount.id}`
            : `${APIPath}merchant-service/bank-accounts`;
        const method=selectedAccount ? "PATCH" : "POST";    
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newBankData)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setIsLoading(false);
                updateList();
                close();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }


    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>{selectedAccount ? "Updated This Account" : "Add New Account"}</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Bank Holder Name* </label>
                            <input type='text' required placeholder='Enter bank holder name' minLength={3} maxLength={30} value={bankHolderName}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setBankHolderName)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Bank Name</label>
                            <input type='text' required placeholder='Enter bank name' maxLength={50} value={bankName.toUpperCase()}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setBankName)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Branch Name</label>
                            <input type='text' required placeholder='Enter descriptions' maxLength={150} value={branchName}
                                onChange={(e) => setBranchName(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Account Number</label>
                            <input type='text' required placeholder='Enter descriptions' minLength={8} maxLength={18} value={accountNumber}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setAccountNumber)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>IFSC Code</label>
                            <input type='text' required placeholder='Enter descriptions' minLength={11} maxLength={11} value={ifscCode}
                                onChange={(e) => handleIFSC(e, setIFSCCode, setIsIFSC)}
                            />
                            {!isIFSC && <p className={style.not_valid_text}>Please write valid IFSC Code..</p>}
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Select Type</label>
                            <select value={accountType} onChange={(e) => setAccountType(e.target.value)}>
                                <option value="" disabled>Select A/C Type</option>
                                <option value="SAVINGS">Saving</option>
                                <option value="CURRENT">Current</option>
                                <option value="BUSINESS">Bussiness</option>
                            </select>
                        </div>
                    </div>

                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>
                                {selectedAccount ? "Update Bank" : "Add bank"}
                            </button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default AddNewBank;