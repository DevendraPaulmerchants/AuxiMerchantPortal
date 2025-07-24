import React, { useEffect, useState } from 'react';
// import style from "./Merchants.module.css";
import style from "../Agent/Merchants.module.css";
import style1 from "./Credits.module.css"
import { IoMdClose } from "react-icons/io";
import { handleInputChangeWithNumericValueOnly } from '../InputValidation/InputValidation';
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function RequestCredits({ close, updateList }) {
    const { token, merchantId } = useContextData();
    document.body.style.overflow = "hidden";
    const [creditsPoint, setCreditsPoints] = useState();
    // const [description, setDescription] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [primaryAccount, setPrimaryAccount] = useState(null);
    const [merchantPrimaryAccount, setMerchantPrimaryAccount] = useState(null);

    const getPrimaryAccount = () => {
        const Url = paymentMethod === "UPI" ? `https://uat.magicalvacation.com/api/v1/admin/accounts/upis?is_primary=true` : `https://uat.magicalvacation.com/api/v1/admin/accounts/banks?is_primary=true`
        setIsLoading(true);
        fetch(Url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setPrimaryAccount(data.data[0]);
            })
            .catch((err) => {
                console.error(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }
    const getMerchantPrimaryAccount = () => {
        setIsLoading(true)
        fetch(`${APIPath}merchant-service/bank-accounts/merchant/primary/${merchantId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setMerchantPrimaryAccount(data.data);
            })
            .catch((err) => {
                console.error(err)
            }).finally(() => {
                setIsLoading(false)
            })
    }
    useEffect(() => {
        if (paymentMethod === "") return;
        getPrimaryAccount();
        getMerchantPrimaryAccount();
    }, [paymentMethod])

    const creditData = {
        amount: parseInt(creditsPoint),
        payment_method: paymentMethod,
        ...(paymentMethod === "UPI" ? {
            upi_id: primaryAccount?.upi_id,
            linked_mobile_no: primaryAccount?.linked_mobile_number
        } : {
            account_holder_name: primaryAccount?.account_holder_name,
            acc_no: primaryAccount?.account_number,
            ifsc_code: primaryAccount?.ifsc_code
        }),
        merchant_id: merchantId
    }
    const addCredit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${APIPath}credit-service/credit-request`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'POST',
            mode: "cors",
            body: JSON.stringify(creditData)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setIsLoading(false);
                close();
                updateList();
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    }
    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Request credit to admin</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addCredit(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Credits* </label>
                            <input type='text' required placeholder='Enter credits' min={1} max={100000} maxLength={8} value={creditsPoint}
                                onChange={(e) => handleInputChangeWithNumericValueOnly(e, setCreditsPoints)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Payment Method* </label>
                            <select required value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                                <option value="" disabled>Select Payment Method</option>
                                <option value="UPI">UPI</option>
                                <option value="BANK_TRANSFER">Bank Transfer</option>
                                {/* <option value="Manual Transfer">Manual Transfer</option> */}
                            </select>
                        </div>
                    </div>
                    {paymentMethod !== "" &&
                        <>
                            {(primaryAccount && merchantPrimaryAccount ?
                                <div className={style1.name_email_parent_container_1}>
                                    <h3>Account details</h3>
                                    {/* {paymentMethod === "BANK_TRANSFER" && */}
                                    <>
                                        <div>
                                            <h3>To</h3>
                                            {paymentMethod === "BANK_TRANSFER" &&
                                                <div className={style.name_email_parent_container}>
                                                    <p>A/C No. : <b>{primaryAccount?.account_number}</b></p>
                                                    <p>A/c Holder Name: <b>{primaryAccount?.account_holder_name}</b></p>
                                                    <p>IFSC Code: <b>{primaryAccount?.ifsc_code}</b></p>
                                                </div>
                                            }
                                            {paymentMethod === "UPI" &&
                                                <div className={style.name_email_parent_container}>
                                                    <p>UPI Id. :<b>{primaryAccount?.upi_id}</b></p>
                                                    <p>Linked Mobile: <b>{primaryAccount?.linked_mobile_number}</b></p>
                                                </div>
                                            }
                                        </div>
                                        <div>
                                            <h3>From</h3>
                                            <div className={style.name_email_parent_container}>
                                                <p>A/C No. : <b>{merchantPrimaryAccount?.account_number}</b></p>
                                                <p>A/c Holder Name: <b>{merchantPrimaryAccount?.account_holder_name}</b></p>
                                                <p>IFSC Code: <b>{merchantPrimaryAccount?.ifsc_code}</b></p>
                                            </div>
                                        </div>
                                    </>
                                </div>
                                :
                                <p>Bank Not Found</p>
                            )}
                        </>

                    }
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>Request Credits</button>
                        </div>
                    }
                </form>
            </div>
        </div>


    </>
}

export default RequestCredits;