import React, { useEffect, useState } from "react";
import { useContextData } from "../Context/Context";
import style from "./Profile.module.css";
import style1 from "../Admin/Admin.module.css";
import style2 from "../Agent/Merchants.module.css";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { APIPath } from "../ApIPath/APIPath";

const Profile = () => {
    const { token, merchantId, profileData } = useContextData();
    // const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchProfileData = async () => {
    //         try {
    //             const response = await fetch(`${APIPath}merchant-service/count/merchant-profile/${merchantId}`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                     'Content-Type': 'application/json'
    //                 },
    //                 method: 'GET',
    //                 mode: 'cors'
    //             });
    //             const data = await response.json();
    //             console.log(data)
    //             setProfileData(data.data);
    //             setMerchantEmail(data.data?.merchant.primary_contact.person_email)
    //         }
    //         catch (err) {
    //             console.error(err)
    //         }
    //     };

    //     fetchProfileData();
    // }, [token, merchantId]);

    const navigate = useNavigate();

    return <>
        <div className={style1.merchants_parent}>
            <div>
                <button className="back_button" onClick={() => navigate(-1)}>
                    <IoMdArrowRoundBack />
                </button>
                <div className={style.profile_container}>
                    <h2>Merchant's Profile</h2>
                    {profileData !== null ? (
                        <div className={style.merchnat_profile_details}>
                            <p><strong>Merchant Name:</strong> {profileData.merchant.merchant_name}</p>
                            <p><strong>Brand Name:</strong> {profileData.merchant.merchant_brand_name}</p>
                            <p><strong>Address:</strong> {`${profileData.merchant.address.address_street}, ${profileData.merchant.address.address_district}, ${profileData.merchant.address.address_state} - ${profileData.merchant.address.address_pincode}`}</p>
                            <p><strong>Primary Contact:</strong> {profileData.merchant.primary_contact.person_name}</p>
                            <p><strong>Contact Email:</strong> {profileData.merchant.primary_contact.person_email}</p>
                            <p><strong>Contact Mobile:</strong> {profileData.merchant.primary_contact.person_mobile}</p>
                            <p><strong>KYC Status:</strong> {profileData.merchant.kyc_status ? "Completed" : "Pending"}</p>
                            <p><strong>GST Number:</strong> {profileData.merchant.gst_no}</p>
                            <p><strong>PAN Number:</strong> {profileData.merchant.pan_no}</p>
                            <hr />
                            <p><strong>Total Customers:</strong> {profileData.total_customers}</p>
                            <p><strong>Active Customers:</strong> {profileData.total_active_customers} | <strong>Inactive Customers:</strong> {profileData.total_inactive_customers}</p>
                            <hr />
                            <p><strong>Total Agents:</strong> {profileData.total_agents}</p>
                            <p><strong>Active Agents:</strong> {profileData.total_active_agents} | <strong>Inactive Agents:</strong> {profileData.total_inactive_agents}</p>
                            <hr />
                            <p><strong>Total Gold Sold:</strong> {profileData.gold_dashboard_dto.sell_gold_in_grms} grams</p>
                            <hr />
                            <p><strong>Total Silver Sold:</strong> {profileData.silver_dashboard_dto.sell_silver_in_grms} grams</p>
                            <hr />
                            <p><strong>Total Transactions:</strong> {profileData.all_transaction_dto.total_trn_count}</p>
                            <p><strong>Total Transaction Amount:</strong> ₹{profileData.all_transaction_dto.total_trn_amount.toFixed(2)}</p>
                        </div>
                    ) : (
                        <div>
                            <p>Not Found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </>
};

export default Profile;