import React, { memo, useEffect, useState } from 'react';
import style from "./Merchants.module.css";
import style1 from "./Agent.module.css";
import { IoMdClose } from "react-icons/io";
import { CgMaximizeAlt } from "react-icons/cg";

import { useMask } from "@react-input/mask";
import { handleEmailChange, handleInputChangeWithAlphabetOnly, handleInputChangeWithNumericValueOnly, handlePANCardNumber, isValidAadhaar, urlToFile } from '../InputValidation/InputValidation';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';

function AddAgent({ close, selectedAgent, updateList }) {
  document.body.style.overflow = "hidden";
  console.log(selectedAgent)
  const { merchantId, token } = useContextData();
  const [name, setName] = useState(selectedAgent?.merchant_agent_brand_name || '');
  const [primaryContactName, setPrimaryContactName] = useState(selectedAgent?.sell_contact?.person_name || '');
  const [primaryContactMobile, setPrimaryContactMobile] = useState(selectedAgent?.sell_contact?.person_mobile || '');
  const [isPrimaryMobileValid, setIsPrimaryMobileValid] = useState(true);
  const [primaryContactEmail, setPrimaryContactEmail] = useState(selectedAgent?.sell_contact?.person_email || "");
  const [isValidEmail, setIsValidEmail] = useState(true);
  const [street, setStreet] = useState(selectedAgent?.address?.address_street || "");
  const [stateName, setStateName] = useState(selectedAgent?.address?.address_state || "");
  const [districtName, setDistrictName] = useState(selectedAgent?.address?.address_district || "");
  const [pinCode, setPinCode] = useState(selectedAgent?.address?.address_pincode || "");
  const [panNumber, setPANnumber] = useState(selectedAgent?.pan_no || '');
  const [isValidPAN, setIsValidPAN] = useState(true);
  const [bussinessType, setBussinessType] = useState(selectedAgent?.business_type || "");
  const [aadharNumber, setAadharNumber] = useState(selectedAgent?.aadhaar_no || '');
  const [isValidAadhar, setIsValidAadhar] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [signedDate, setSignedDate] = useState(selectedAgent?.agreement_signed_date);
  const [expiryDate, setExpiryDate] = useState(selectedAgent?.agreement_expiry_date);
  const [panDocument, setPanDocument] = useState(selectedAgent?.pan_image_url || null);
  const [previewPan, setPreviewPan] = useState('');
  const [aadharDocument, setAadharDocument] = useState(selectedAgent?.aadhaar_image_url || null);
  const [previewAadhar, setPreviewAadhar] = useState('');
  const [selectedUrl, setSelectedUrl] = useState('');
  const [maxView, setMaxView] = useState(false);
  const [schemeList, setSchemeList] = useState(null);
  const [selectedScheme, setSelectedScheme] = useState(selectedAgent?.scheme_id || "");

  const inputRef = useMask({
    mask: "+91-__________",
    replacement: { _: /\d/ },
  });

  const handlePanDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPanDocument(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewPan(fileUrl);
    }
  };

  const handleAadharDocument = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAadharDocument(file);
      const fileUrl = URL.createObjectURL(file);
      setPreviewAadhar(fileUrl);
    }
  }
// pdf file preview -------------------
useEffect(() => {
  const loadExistingDocs = async () => {
    if (selectedAgent?.pan_image_url) {
      const panUrl = selectedAgent.pan_image_url;
      const panExtension = panUrl.split('.').pop()?.toLowerCase();

      const panMimeType = panExtension === 'pdf' ? 'application/pdf' : 'image/jpeg';
      const panFileName = `pan.${panExtension}`;

      try {
        const panFile = await urlToFile(panUrl, panFileName, panMimeType);
        setPanDocument(panFile);
        setPreviewPan(URL.createObjectURL(panFile));
      } catch (error) {
        console.error("Error loading PAN document:", error);
      }
    }

    if (selectedAgent?.aadhaar_image_url) {
      const aadhaarUrl = selectedAgent.aadhaar_image_url;
      const aadhaarExtension = aadhaarUrl.split('.').pop()?.toLowerCase();

      const aadhaarMimeType = aadhaarExtension === 'pdf' ? 'application/pdf' : 'image/jpeg';
      const aadhaarFileName = `aadhaar.${aadhaarExtension}`;

      try {
        const aadhaarFile = await urlToFile(aadhaarUrl, aadhaarFileName, aadhaarMimeType);
        setAadharDocument(aadhaarFile);
        setPreviewAadhar(URL.createObjectURL(aadhaarFile));
      } catch (error) {
        console.error("Error loading Aadhaar document:", error);
      }
    }
  };

  loadExistingDocs();
}, [selectedAgent]);

// Get All Scheme List -------------------------
  useEffect(() => {
    fetch(`${APIPath}merchant-service/agent-schemes/merchant/${merchantId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'Application/json'
      },
      method: "GET",
      mode: "cors"
    })
      .then((res) => res.json())
      .then((data) => {
        setSchemeList(data.data);
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])
  // Getting the State list -------------------------

  const [stateList, setStateList] = useState(null);
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ country: "India" })
    })
      .then(res => res.json())
      .then(data => {
        setStateList(data.data.states)
      })
      .catch(err => console.error(err));

  }, [])
  // Getting the District/City List -------------------------
  const [districtList, setDistrictList] = useState(null);
  useEffect(() => {
    // if (stateName === "" || !stateName) return;
    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ country: "India", state: stateName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setDistrictList(data.data);
      })
      .catch((err) => console.error(err));
  }, [stateName]);
// New Agent data object -------------------
  const newAgent = {
    merchant_agent_brand_name: name,
    merchant_agent_name: primaryContactName,
    merchant_id: selectedAgent ? selectedAgent?.merchant_id : merchantId,
    address: {
      address_street: street,
      address_district: districtName,
      address_state: stateName,
      address_pincode: pinCode,
    },
    sell_contact: {
      person_name: primaryContactName,
      person_email: primaryContactEmail,
      person_mobile: primaryContactMobile,
    },
    pan_no: panNumber,
    aadhaar_no: aadharNumber,
    business_type: bussinessType,
    agreement_expiry_date: expiryDate,
    agreement_signed_date: signedDate,
    roles:
    {
      name: "Admin",
      department_name: "Super Admin"
    },
    scheme_id: selectedScheme
  }

  const url = selectedAgent
    ? `${APIPath}merchant-service/merchant-agent/${selectedAgent?.id}`
    : `${APIPath}merchant-service/merchant-agent`;
  const method = selectedAgent ? "PUT" : "POST";

  const handleFormData = (e) => {
    e.preventDefault();
    if (!isPrimaryMobileValid) {
      alert("Please enter valid mobile number.");
      return;
    }
    if (!isValidEmail) {
      alert("Please enter valid email");
      return;
    }
    if (!isValidPAN) {
      alert("Please enter valid PAN number..");
      return;
    }
    if (!isValidAadhar) {
      alert("Please enter valid Aadhar number..");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    const jsonBlob = new Blob(
      [JSON.stringify(newAgent)],
      { type: 'application/json' }
    );
    formData.append('merchantAgentUsersDTO', jsonBlob);
    formData.append('aadhaarImage', aadharDocument);
    formData.append('panImage', panDocument);
    console.log(newAgent)
    fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
      mode: "cors"
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Request failed');
        }
        return res.json();
      })
      .then((data) => {
        if (data.status_code === 200) {
          alert(data.message);
          updateList();
          close();
        } else {
          throw new Error(data.message || 'Unknown error occurred');
        }
      })
      .catch((err) => {
        console.error('Error:', err);
        alert(err.message || 'Something went wrong');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  return <>
    <div className={style.add_merchants_parent}>
      <div className={style.add_merchants_form_container}>
        <div className={style.add_merchants_header}>
          <h2>{selectedAgent ? "Update this Agent" : "Add new Agent"}</h2>
          <h3 onClick={close}><IoMdClose /></h3>
        </div>
        <form onSubmit={(e) => {
          handleFormData(e)
        }}>
          <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
              <label>Agent Name* </label>
              <input type='text' required placeholder='Enter agent name' maxLength={30} value={primaryContactName}
                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setPrimaryContactName)}
              />
            </div>
            <div className={style.name_label_input_contaner}>
              <label>Brand Name* </label>
              <input type='text' required placeholder='Enter Organisation name' maxLength={70} value={name}
                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setName)}
              />
            </div>
          </div>
          <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
              <label>Agent Mobile* </label>
              <input ref={inputRef} required placeholder='Enter primary contact mobile' value={primaryContactMobile}
                onChange={(e) => {
                  const value = e.target.value;
                  setPrimaryContactMobile(e.target.value)
                  if (value.length <= 13) {
                    setIsPrimaryMobileValid(false)
                  }
                  if (value.length === 14) {
                    setIsPrimaryMobileValid(true)
                  }
                }}
              />
              {!isPrimaryMobileValid && <p className={style.not_valid_text}>Please type valid Mobile number</p>}
            </div>
            <div className={style.name_label_input_contaner}>
              <label>Agent Email* </label>
              <input type='email' required placeholder='Enter primary contact email' maxLength={40} value={primaryContactEmail}
                disabled={selectedAgent?.sell_contact?.person_email ? true : false}
                onChange={(e) => handleEmailChange(e, setPrimaryContactEmail, setIsValidEmail)}
              />
              {!isValidEmail && <p className={style.not_valid_text}>Please type valid Email</p>}
            </div>
          </div>
          <div className={style.add_merchants_bussiness_address}>
            <h3>Business Address</h3>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Bussiness Type* </label>
                <select value={bussinessType} required onChange={(e) => setBussinessType(e.target.value)}>
                  <option value="" disabled>Select Business Type</option>
                  <option value="retail">Retail</option>
                </select>
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Scheme Type* </label>
                <select value={selectedScheme} required onChange={(e) => setSelectedScheme(e.target.value)}>
                  <option value="" disabled>Select Scheme</option>
                  {/* {selectedAgent?.business_type && <option value={selectedAgent?.business_type}>{selectedAgent?.business_type}</option>} */}
                  {schemeList?.map((scheme) => {
                    return <option key={scheme.id} value={scheme.id}>{scheme.scheme_name}</option>
                  })}
                </select>
              </div>
            </div>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>State* </label>
                {/* <input type='text' required placeholder='Enter state' maxLength={20} value={stateName}
                  onChange={(e) => handleInputChangeWithAlphabetOnly(e, setStateName)}
                /> */}
                <select required value={stateName} onChange={(e) => setStateName(e.target.value)}>
                  <option value="" disabled>Select State</option>
                  {stateList?.map((state, id) => (
                    <option key={id} value={state.name}>{state.name}</option>
                  ))}
                </select>
              </div>
              <div className={style.name_label_input_contaner}>
                <label>City* </label>
                {/* <input type='text' required placeholder='Enter district' maxLength={20} value={districtName}
                  onChange={(e) => handleInputChangeWithAlphabetOnly(e, setDistrictName)}
                /> */}
                <select required value={districtName} onChange={(e) => setDistrictName(e.target.value)}>
                  <option value="" disabled>Select City</option>
                  {districtList?.map((district, id) => (
                    <option key={id} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Street Address* </label>
                <input type='text' required placeholder='Enter street address' maxLength={30} value={street}
                  onChange={(e) => setStreet(e.target.value)}
                />
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Pin Code*</label>
                <input type='text' required placeholder='Enter pincode' maxLength={6} minLength={6} value={pinCode}
                  onChange={(e) => handleInputChangeWithNumericValueOnly(e, setPinCode)}
                />
              </div>
            </div>
          </div>
          <div className={style.name_email_parent_container}>
            <div className={style.name_label_input_contaner}>
              <label>Aadhar Number* </label>
              <input type='text' required placeholder='Enter Aadhar number' maxLength={12} minLength={12} value={aadharNumber}
                onChange={(e) => isValidAadhaar(e, setAadharNumber, setIsValidAadhar)}
              />
              {!isValidAadhar && <p className={style.not_valid_text}>please enter valid Aadhar number</p>}
            </div>

            <div className={style.name_label_input_contaner}>
              <label>PAN Number </label>
              <input type='text' placeholder='Enter PAN number' minLength={10} maxLength={10} value={panNumber}
                onChange={(e) => {
                  handlePANCardNumber(e, setPANnumber, setIsValidPAN)
                }}
              />
              {!isValidPAN && <p className={style.not_valid_text}>please enter valid PAN number</p>}
            </div>
          </div>
          <div className={style.add_merchants_bussiness_address}>
            <h3> Document</h3>
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Upload Aadhar* </label>
                <input type='file' accept="image/*,application/pdf"
                  required={selectedAgent?.aadhaar_image_url ? false : true}
                  onChange={handleAadharDocument}
                />
                <p style={{ fontSize: '10px' }}>Kindly upload your document as a PDF file only.</p>
                {previewAadhar &&
                  <div className={style1.file_mini_view}>
                    <iframe className={style.mini_file}
                      src={previewAadhar}
                      title="Aadhar PDF Preview"
                      width='100%'
                      height='100px'
                      frameBorder="0">
                    </iframe>
                    <p className={style1.max_view}
                      onClick={() => {
                        setSelectedUrl(previewAadhar);
                        setMaxView(true);
                      }}
                    >
                      <CgMaximizeAlt />
                    </p>
                  </div>
                }

              </div>
              <div className={style.name_label_input_contaner}>
                <label>Upload PAN </label>
                <input type='file' accept="image/*,application/pdf"
                  required={selectedAgent?.pan_image_url ? false : true}
                  onChange={handlePanDocument}
                />
                <p style={{ fontSize: '10px' }}>Kindly upload your document as a PDF file only.</p>
                {previewPan &&
                  <div className={style1.file_mini_view}>
                    <iframe className={style.mini_file}
                      src={previewPan}
                      title="PAN PDF Preview"
                      width='100%'
                      height='100px'
                      frameborder="0">
                    </iframe>
                    <p className={style1.max_view}
                      onClick={() => {
                        setSelectedUrl(previewPan);
                        setMaxView(true);
                      }}
                    >
                      <CgMaximizeAlt />
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
          {selectedAgent && selectedAgent?.agreement_expiry_date &&
            <div className={style.name_email_parent_container}>
              <div className={style.name_label_input_contaner}>
                <label>Agreement signed date* </label>
                <input type='date' required placeholder='Enter date' value={signedDate}
                  onChange={(e) => setSignedDate(e.target.value)}
                />
              </div>
              <div className={style.name_label_input_contaner}>
                <label>Agreement expiry date*</label>
                <input type='date' required placeholder='Enter pincode' value={expiryDate}
                  min={signedDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                />
              </div>
            </div>
          }
          {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
            <img src='/gold-coin.png' alt='Gold loading...' />
          </div></div> :
            <div className={style.add_merchats_btn_container}>
              <button className={style.primary_login_btn}>{selectedAgent ? "Update Agent" : "Create Agent"}</button>
            </div>
          }
        </form>
      </div>
    </div>
    {maxView &&
      <div className={style1.preview_uploaded_file}>
        <div className={style1.open_file_dimension}>
          <p onClick={() => { setMaxView(false); setSelectedUrl(null) }} className={style1.pdf_close_icon}>X</p>
          <div className={style1.preview_pdf_file}>
            <iframe className={style1.open_file}
              src={selectedUrl}
              title="PDF Preview"
              width="100%"
              height="100%"
              frameBorder="0"
            />
          </div>
        </div>
      </div>
    }
  </>
}

export default memo(AddAgent);