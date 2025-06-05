import React, { useState } from 'react';
import style1 from "../Admin/Admin.module.css";
// import style from "./Merchants.module.css";
import style from "../Agent/Merchants.module.css"
import { Navigate, useParams } from 'react-router-dom';

const selectedSubMerchant = [
    {
        aadhaar_no: "XXXXXXXX9012",
        account_contact: { person_name: 'Jane Doe', person_email: 'jane.doe@example.com', person_mobile: '+0987654381' },
        address: { street: '123 Example St', district: 'Example City', state: 'Example State', postal_code: '12346' },
        agreement_expiry_date: "2026-01-01",
        agreement_signed_date: "2025-01-01",
        created_at: "2025-02-28T07:36:19.277672Z",
        kyc_status: "Verified",
        merchant_agent_name: "Example Merchant Agent 3",
        merchant_agent_users_id: "mauser-43f2e8e4-a44d-4b36-8968-4e0c53939ee3",
        merchant_id: "merchant-71c36183-081c-4a07-baae-58e7558c63ec",
        pan_no: "XXXXX1234X",
        primary_contact: {
            person_email: "john.doe@example.com",
            person_mobile: "+1234567890",
            person_name: "John Doe",
        },

        status: "ACTIVE",
        total_credit: 70000,
        used_credit: 2000,
        updated_at: "2025-02-28T07:36:19.277705Z"
    }
]

function SubMerchantDetails() {
    const id=useParams();
    const [isloading, setIsloading] = useState(false);
    console.log(id);
    const backOneStep=()=>{
        Navigate(-1)
    }
    return <>
        <div className={style1.merchants_parent}>
            <div className={style.add_merchants_header}>
                <h2>SubMerchant`s Details</h2>
                {/* <h2 onClick={backOneStep}>Back</h2> */}
            </div>
            {isloading ? <div className={style.loader_container}><div className={style.loader_item}></div></div> :
                <table className={style.merchant_details_page_table}>
                    <tbody>
                        <tr className={style.merchant_details_page_row}>
                            <td>
                                <h4 className={style.merchant_name}>Agent`s Name:
                                    <span>
                                        {selectedSubMerchant[0]?.merchant_agent_name}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Agent`s Email:
                                    <span>
                                        {selectedSubMerchant[0]?.primary_contact?.person_email}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Agent`s Mobile:
                                    <span>
                                        {selectedSubMerchant[0]?.primary_contact?.person_mobile}
                                    </span>
                                </h4>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <h4 className={style.merchant_name}>Available Credits:
                                    <span>
                                        {selectedSubMerchant[0]?.total_credit - selectedSubMerchant[0]?.used_credit}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>KYC Status:
                                    <span>
                                        {selectedSubMerchant[0]?.kyc_status}
                                    </span>
                                </h4>
                            </td>
                            <td>
                                <h4 className={style.merchant_name}>Address:
                                    <span>
                                        {selectedSubMerchant[0]?.address.street},{" "}
                                        {selectedSubMerchant[0]?.address.district},{" "}
                                        {selectedSubMerchant[0]?.address.state},{" "}
                                        {selectedSubMerchant[0]?.address.postal_code}
                                    </span>
                                </h4>
                            </td>
                        </tr>
                    </tbody>
                </table>
            }
        </div>
    </>
}

export default SubMerchantDetails;