import React, { useCallback, useEffect, useState } from 'react';
import style1 from "../Admin/Admin.module.css";
import style from "./Merchants.module.css";
import style2 from "./Agent.module.css";
import { Link, useNavigate, useParams } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';
import { memo } from 'react';
import ApproveKYC from './ApproveKYC';
import AddAgent from './AddAgent';
import { CgMaximizeAlt } from 'react-icons/cg';
import { FcClock, FcCancel, FcOk } from 'react-icons/fc';
import { dateAndTimeFormat } from '../../helper';


function AgentDetails() {
    const { agentId } = useParams();
    const { token } = useContextData();
    const [isloading, setIsloading] = useState(true);
    const [selectedAgent, setSelectedAgent] = useState(null);
    const [openReject, setOpenReject] = useState(false);
    const [docType, setDocType] = useState("");
    const [showImage, setShowImage] = useState(false);
    const [isUpdateClicked, setIsUpdateClicked] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState('');
    const [maxView, setMaxView] = useState(false);

    const fetchAgentDetails = useCallback(() => {
        setIsloading(true)
        fetch(`${APIPath}merchant-service/merchant-agent/${agentId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json",
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setSelectedAgent(data.data)
                setIsloading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsloading(false);
            })
    }, [token, agentId])

    useEffect(() => {
        fetchAgentDetails()
    }, [fetchAgentDetails])

    const navigate = useNavigate();

    const approveAadhar = () => {
        if (selectedAgent?.aadhaar_verification === "VERIFIED") {
            alert("KYC has already been verified. No further action is required.");
            setShowImage(false);
            return;
        }
        if (selectedAgent?.aadhaar_verification === "REJECTED") {
            alert("KYC has already been rejected. No further action is required.");
            setShowImage(false);
            return;
        }
        setIsloading(true)
        fetch(`${APIPath}merchant-service/merchant-agent/aadhaar-verification-status/${agentId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json",
            },
            method: "PATCH",
            body: JSON.stringify({ aadhaar_verification_status: 'VERIFIED' }),
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                fetchAgentDetails();
                setIsloading(false);
                // setShowImage(false);
                setMaxView(false)
            })
            .catch((err) => {
                console.log(err);
                setIsloading(false);
            })
    }

    const approvePan = () => {
        if (selectedAgent?.pan_verification === "VERIFIED") {
            alert("KYC has already been verified. No further action is required.");
            setShowImage(false);
            return;
        }
        if (selectedAgent?.pan_verification === "REJECTED") {
            alert("KYC has already been rejected. No further action is required.");
            setShowImage(false);
            return;
        }
        setIsloading(true)
        fetch(`${APIPath}merchant-service/merchant-agent/pan-verification-status/${agentId}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "Application/json",
            },
            method: "PATCH",
            body: JSON.stringify({ pan_verification_status: 'VERIFIED' }),
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                fetchAgentDetails();
                setIsloading(false);
                // setShowImage(false);
                setMaxView(false);
            })
            .catch((err) => {
                console.log(err);
                setIsloading(false);
            })
    }
    const openRejectPage = () => {
        setOpenReject(false);
    }
    const closeUpdateDetails = useCallback(() => {
        setIsUpdateClicked(false);
        document.body.style.overflow = 'auto';
    }, []);
    return <>
        <div className={style1.merchants_parent}>
            <div className={style.add_merchants_header}>
                <h2 className={style2.back_arrow}
                    onClick={() => {
                        navigate('/agent');
                    }}><IoMdArrowRoundBack /></h2>
            </div>
            {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                <img src='/gold-coin.png' alt='Gold Coin' />
            </div></div> :
                <>
                    <div className={style.customer_details_first_row}>
                        <h4 className={style.merchant_name}>Brand name:
                            <span>{selectedAgent?.merchant_agent_brand_name}</span>
                        </h4>
                        <h4 className={style.merchant_name}>Agent`s Name:
                            <span>
                                {selectedAgent?.sell_contact?.person_name}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>Bussiness Type:
                            <span>
                                {selectedAgent?.business_type}
                            </span>
                        </h4>
                        <h4 className={style.merchant_name}>Scheme Name:
                            <span>
                                <Link to='/scheme_margin' state={{ schemeName: selectedAgent?.agent_scheme_dto?.scheme_name }}>
                                    {selectedAgent?.agent_scheme_dto?.scheme_name || ''}
                                </Link>
                            </span>
                        </h4>
                    </div>

                    <div className={style.customer_details_first_row}>
                        <h4 className={style.merchant_name}>Agent`s Email:
                            <span>
                                {selectedAgent?.sell_contact?.person_email}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Agent`s Mobile No:
                            <span>
                                {selectedAgent?.sell_contact?.person_mobile}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Address:
                            <span>
                                {selectedAgent?.address?.address_street},{" "}
                                {selectedAgent?.address?.address_district},{" "}
                                {selectedAgent?.address?.address_state},{" "}
                                {selectedAgent?.address?.address_pincode}
                            </span>
                        </h4>
                    </div>
                    <div className={style.customer_details_first_row}>
                        <h4 className={style.merchant_name}>Verification Status:
                            <span>
                                {selectedAgent?.verification_status}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>KYC Status:
                            <span>
                                {(selectedAgent?.kyc_status) ? "Verified" : "Pending"}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>Aadhar Number:
                            <span>
                                {selectedAgent?.aadhaar_no}
                            </span>
                        </h4>

                        <h4 className={style.merchant_name}>PAN Number:
                            <span>
                                {selectedAgent?.pan_no}
                            </span>
                        </h4>
                    </div>
                    <div className={style.customer_details_first_row}>
                        {selectedAgent?.agreement_signed_date &&
                            <h4 className={style.merchant_name}>Agreement signed date:
                                <span>
                                    {selectedAgent?.agreement_signed_date}
                                </span>
                            </h4>
                        }

                        {selectedAgent?.agreement_expiry_date &&
                            <h4 className={style.merchant_name}>Agreement expiry date:
                                <span>
                                    {selectedAgent?.agreement_expiry_date}
                                </span>
                            </h4>
                        }

                        {selectedAgent?.created_at &&
                            <h4 className={style.merchant_name}>Created At:
                                <span>
                                    {dateAndTimeFormat(selectedAgent?.created_at)}
                                </span>
                            </h4>
                        }

                        {selectedAgent?.updated_at &&
                            <h4 className={style.merchant_name}>Updated At:
                                <span>
                                    {dateAndTimeFormat(selectedAgent?.updated_at)}
                                </span>
                            </h4>
                        }
                    </div>
                    <div className={style.agent_document}>
                        <div>
                            <p>Aadhar :</p>
                            <div
                                // className={style.agent_document_image}
                                className={`${style.agent_document_image} ${style[selectedAgent?.aadhaar_verification]}`}>
                                <iframe title='Aadhar pdf view'
                                    src={selectedAgent?.aadhaar_image_url}
                                    width='100%'
                                    height='150px'
                                    frameborder="0"
                                />
                                <div className={`${style[selectedAgent?.aadhaar_verification?.toLowerCase()]}`}>
                                    <p className={style2.max_view}
                                        onClick={() => {
                                            setSelectedUrl(selectedAgent?.aadhaar_image_url);
                                            setMaxView(true);
                                        }}
                                    >
                                        <CgMaximizeAlt />
                                    </p>
                                    <p className={style.document_kyc_status}>
                                        {selectedAgent?.aadhaar_verification === "VERIFIED" && <FcOk title='Approved' />}
                                        {selectedAgent?.aadhaar_verification === "REJECTED" && <FcCancel title='Rejected' />}
                                        {selectedAgent?.aadhaar_verification === "PENDING" && <FcClock title='Pending' />}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <p>PAN :</p>
                            <div
                                className={`${style.agent_document_image} ${style[selectedAgent?.pan_verification]}`}
                            >
                                <iframe title='Pan Pdf View'
                                    src={selectedAgent?.pan_image_url}
                                    width='100%'
                                    height='150px'
                                    frameborder="0"
                                />
                                <div className={`${style[selectedAgent?.pan_verification?.toLowerCase()]}`}>
                                    <p className={style2.max_view}
                                        onClick={() => {
                                            setSelectedUrl(selectedAgent?.pan_image_url);
                                            setMaxView(true);
                                        }}
                                    >
                                        <CgMaximizeAlt />
                                    </p>
                                    <p className={style.document_kyc_status}>

                                        {selectedAgent?.pan_verification === "VERIFIED" && "✅"}
                                        {selectedAgent?.pan_verification === "REJECTED" && "❌"}
                                        {selectedAgent?.pan_verification === "PENDING" && <FcClock title='Pending' />}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <br />
                    <div style={{ display: 'flex', gap: '4rem' }}>
                        <button className={style.primary_login_btn}
                            onClick={() => setIsUpdateClicked(true)}
                        >Update Details</button>
                        <button className={style.primary_login_btn}>Verify Kyc</button>
                    </div>
                </>
            }
        </div >
        {maxView &&
            <div className={style2.preview_uploaded_file}>
                <div className={style2.open_file_dimension}>
                    <p onClick={() => { setMaxView(false); setSelectedUrl(null) }} className={style2.pdf_close_icon}>X</p>
                    <div className={style2.preview_pdf_file} >
                        <iframe
                            // className={style2.open_file}
                            src={selectedUrl}
                            title="PDF Preview"
                            width="100%"
                            height="80%"
                            frameBorder="0"
                        />
                        {(selectedUrl === selectedAgent?.aadhaar_image_url && selectedAgent?.aadhaar_verification !== 'VERIFIED') &&
                            <div className={style.verify_btn}>
                                <button className={style.primary_login_btn}
                                    onClick={() => approveAadhar()}
                                >Approve</button>
                                <button className={style.primary_login_btn}
                                    onClick={() => { setOpenReject(true); setDocType("AADHAAR") }}
                                    disabled={selectedAgent?.aadhaar_verification === "VERIFIED" ||
                                        selectedAgent?.aadhaar_verification === "REJECTED"}
                                >Reject</button>
                            </div>
                        }
                        {(selectedUrl === selectedAgent?.pan_image_url && selectedAgent?.pan_verification !== 'VERIFIED') &&
                            <div className={style.verify_btn}>
                                <button className={style.primary_login_btn}
                                    onClick={() => approvePan()}
                                >Approve</button>
                                <button className={style.primary_login_btn}
                                    onClick={() => { setOpenReject(true); setDocType("PAN") }}
                                    disabled={selectedAgent?.pan_verification === "VERIFIED" ||
                                        selectedAgent?.pan_verification === "REJECTED"}
                                >Reject</button>
                            </div>
                        }
                    </div>
                </div>
            </div>
        }
      
        {openReject && <ApproveKYC close={openRejectPage} agentId={selectedAgent?.id} docType={docType} />}
        {
            isUpdateClicked && <AddAgent close={closeUpdateDetails}
                selectedAgent={selectedAgent}
                updateList={fetchAgentDetails} />
        }
    </>
}

export default memo(AgentDetails);