import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
// import style from "../MerchantManagement/Merchants.module.css";
import style from "../Agent/Merchants.module.css";
import style1 from "./Margin.module.css";
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';

function AddNewScheme({ close, selectedAccount, updateList }) {
    document.body.style.overflow = "hidden";
    const { token,merchantId,merchantName } = useContextData();
    // const [metalType, setMetalType] = useState(selectedAccount?.metal_type || "");
    // const [margin, setMargin] = useState(selectedAccount?.margin || 0)
    const [schemeName, setSchemeName] = useState(selectedAccount?.scheme_name || "")
    // ----------- Gold --------------------------
    const [goldbuymargin, setGoldbuymargin] = useState(selectedAccount?.gold_buy_margin || 0);
    const [goldsellmargin, setGoldsellmargin] = useState(selectedAccount?.gold_sell_margin || 0);
    const [goldtransfermargin, setGoldtransfermargin] = useState(selectedAccount?.gold_transfer_margin || 0);
    const [goldconversionmargin, setGoldconversionmargin] = useState(selectedAccount?.gold_conversion_margin || 0);
    // ---------------------- Silver ---------------------
    const [silverbuymargin, setSilverbuymargin] = useState(selectedAccount?.silver_buy_margin || 0);
    const [silversellmargin, setSilversellmargin] = useState(selectedAccount?.silver_sell_margin || 0);
    const [silvertransfermargin, setSilvertransfermargin] = useState(selectedAccount?.silver_transfer_margin || 0);
    const [silverconversionmargin, setSilverconversionmargin] = useState(selectedAccount?.silver_conversion_margin || 0);
    // ----------- Platinum --------------------------
    const [platinumbuymargin, setPlatinumbuymargin] = useState(selectedAccount?.platinum_buy_margin || 0);
    const [platinumsellmargin, setPlatinumsellmargin] = useState(selectedAccount?.platinum_sell_margin || 0);
    const [platinumtransfermargin, setPlatinumtransfermargin] = useState(selectedAccount?.platinum_transfer_margin || 0);
    const [platinumconversionmargin, setPlatinumconversionmargin] = useState(selectedAccount?.platinum_conversion_margin || 0);

    const [isLoading, setIsLoading] = useState(false);

    console.log(selectedAccount);
    // const id = metalType === "gold"
    //     ? selectedAccount?.goldMarginId
    //     : metalType === "silver"
    //         ? selectedAccount?.silverMarginId
    //         : metalType === "platinum"
    //             ? selectedAccount?.platinumMarginId
    //             : null;


    const newScheme = {
        scheme_name: schemeName,
        merchant_id:merchantId,
        update_by:merchantName,
        created_by:merchantName,
        gold_buy_margin: parseFloat(goldbuymargin),
        gold_sell_margin: parseFloat(goldsellmargin),
        gold_conversion_margin: parseFloat(goldconversionmargin),
        gold_transfer_margin: parseFloat(goldtransfermargin),

        silver_buy_margin: parseFloat(silverbuymargin),
        silver_sell_margin: parseInt(silversellmargin),
        silver_conversion_margin: parseFloat(silverconversionmargin),
        silver_transfer_margin: parseFloat(silvertransfermargin),

        platinum_buy_margin: parseFloat(platinumbuymargin),
        platinum_sell_margin: parseFloat(platinumsellmargin),
        platinum_conversion_margin: parseFloat(platinumconversionmargin),
        platinum_transfer_margin: parseFloat(platinumtransfermargin),

    }

    const addPermission = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedAccount ? `${APIPath}merchant-service/agent-schemes/${selectedAccount?.id}`
            : `${APIPath}merchant-service/agent-schemes`;
        const method = selectedAccount ? "PATCH" : "POST";
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newScheme)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data);
                setIsLoading(false);
                alert(data.message);
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
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    {selectedAccount ? <h2>Update this Scheme Margin</h2> : <h2>Add New Scheme Margin</h2>}
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Scheme Name*</label>
                            <input type='text' required value={schemeName} onChange={(e) => setSchemeName(e.target.value)}
                                readOnly={selectedAccount}
                                placeholder='Enter scheme name..'
                            />
                        </div>
                        {/* <div className={style.name_label_input_contaner}>
                            <label>Select Metal Type* </label>
                            <select required value={metalType} onChange={(e) => setMetalType(e.target.value)}>
                                <option value="" disabled>Select Metal</option>
                                <option value="GOLD">Gold</option>
                                <option value="SILVER">Silver</option>
                                <option value="PLATINUM">Platinum</option>
                            </select>
                        </div> */}
                    </div>
                    {/* ----------- Gold Margin -------------------- */}
                    <h2 className={style1.metal_margin_type}>Gold Margin</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={goldbuymargin}
                                onChange={(e) => setGoldbuymargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={goldsellmargin}
                                onChange={(e) => setGoldsellmargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={goldtransfermargin}
                                onChange={(e) => setGoldtransfermargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={goldconversionmargin}
                                onChange={(e) => setGoldconversionmargin(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* ------------- Silver Margin ---------- */}
                    <h2 className={style1.metal_margin_type}>Silver Margin</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={silverbuymargin}
                                onChange={(e) => setSilverbuymargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={silversellmargin}
                                onChange={(e) => setSilversellmargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={silvertransfermargin}
                                onChange={(e) => setSilvertransfermargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={silverconversionmargin}
                                onChange={(e) => setSilverconversionmargin(e.target.value)}
                            />
                        </div>
                    </div>
                    {/* ------------------ Platinum Margin ----------- */}
                    <h2 className={style1.metal_margin_type}>Platinum Margin</h2>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Buy*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={platinumbuymargin}
                                onChange={(e) => setPlatinumbuymargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Sell*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={platinumsellmargin}
                                onChange={(e) => setPlatinumsellmargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Transfer*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={platinumtransfermargin}
                                onChange={(e) => setPlatinumtransfermargin(e.target.value)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Conversion*</label>
                            <input type='decimal' required placeholder='Margin in %' min={0} max={10} value={platinumconversionmargin}
                                onChange={(e) => setPlatinumconversionmargin(e.target.value)}
                            />
                        </div>
                    </div>
                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>
                                {selectedAccount ? "Update" : "Add"}
                            </button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default AddNewScheme;