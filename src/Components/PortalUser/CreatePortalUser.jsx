import React, { useEffect, useState } from 'react';
import style from "../Agent/Merchants.module.css";
import { IoMdClose } from "react-icons/io";
import { useMask } from "@react-input/mask";
import { handleEmailChange, handleInputChangeWithAlphabetOnly, } from '../InputValidation/InputValidation';
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function AddUser({ close, updateList,selecteduser }) {
    const { token, merchantId } = useContextData();
    document.body.style.overflow = "hidden";
    const [name, setName] = useState(selecteduser?.name || '');
    const [userEmail, setUserEmail] = useState(selecteduser?.email || "");
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [mobile, setMobile] = useState(selecteduser?.phone || '');
    const [departmentList, setDepartmentList] = useState(null);
    const [departmentName, setDepartmentName] = useState(selecteduser?.departmentName || "");
    // const [department, setDepartment] = useState({ name: '', id: '' });
    // const [role, setRole] = useState({ name: '', id: '' });
    const [roleList, setRoleList] = useState(null);
    // const [roleId, setRoleId] = useState("");
    const [roleName, setRoleName] = useState(selecteduser?.roleName || "")
    const [isLoading, setIsLoading] = useState(false);

    const inputRef = useMask({
        mask: "+91-__________",
        replacement: { _: /\d/ },
    });

    useEffect(() => {
        setIsLoading(true);
        fetch(`${APIPath}oauth-service/departments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setDepartmentList(data.data)
            })
            .catch((err) => {
                console.log(err);
            }).finally(()=>setIsLoading(false))
    }, []);

    useEffect(() => {
        setIsLoading(true);
        fetch(`${APIPath}oauth-service/roles?departmentName=${departmentName}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: 'GET',
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data)
                setRoleList(data.data)
            })
            .catch((err) => {
                console.log(err);
            }).finally(()=>setIsLoading(false))
    }, [departmentName, token])

    const [selectedRole,setSelectedRole] = useState(null);
   
    const handlePermission = (e) => {
        console.log(e.target)
    }
    const newUser = {
        merchant_id: merchantId,
        portal_id: merchantId,
        type_of_user: "MERCHANT",
        name: name,
        email: userEmail,
        phone: mobile,
        role: {
            name: roleName,
            department_name: departmentName,
            permission_ids: selectedRole?.permission_ids,
            permission_names: selectedRole?.permission_names
        }
        // departmentName:departmentName,
        // role: roleId,
    }

    const handleFormData = (e) => {
        e.preventDefault();
        if (isValidEmail) {
            setIsLoading(true)
            fetch(`${APIPath}oauth-service/auth/register`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                method: 'POST',
                body: JSON.stringify(newUser),
                mode: "cors"
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    if (data.status_code !== 201) {
                        alert(data.message);
                        return;
                    }
                    alert(data.message);
                    close();
                    updateList();
                })
                .catch((err) => {
                    console.log(err);
                }).finally(()=>setIsLoading(false))
        }
        else return;
    }

    return <>
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>Add new User</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => {
                    handleFormData(e)
                }}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>User Name* </label>
                            <input type='text' required placeholder='Enter user name' maxLength={50} value={name}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setName)}
                            />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>User Mobile* </label>
                            <input ref={inputRef} required placeholder='Enter primary contact mobile' value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>User Email* </label>
                            <input type='email' required placeholder='Enter primary contact email' maxLength={40} value={userEmail}
                                onChange={(e) => handleEmailChange(e, setUserEmail, setIsValidEmail)}
                            />
                            {!isValidEmail && <p className={style.not_valid_text}>Please type valid Email</p>}
                        </div>
                    </div>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Select Department*</label>
                            <select value={departmentName} required onChange={(e) => setDepartmentName(e.target.value)}>
                                <option value="" disabled>Select Department</option>
                                {departmentList?.map((role, id) => {
                                    return <option key={role.id} value={role.name}>{role.name}</option>
                                })}
                            </select>
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Select Role Type* </label>
                            <select value={roleName} required
                                onChange={(e) => {
                                    const selectedRoleName = e.target.value;
                                    setRoleName(selectedRoleName);

                                    const selectedRoleObj = roleList.find(role => role.name === selectedRoleName);
                                    console.log('Selected Role Object:', selectedRoleObj);
                                    setSelectedRole(selectedRoleObj)
                                    
                                }}
                            >
                                <option value="" disabled>Select Role</option>
                                {roleList?.map((role, id) => {
                                    return <option key={role.id} value={role.name}>{role.name}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    {isLoading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>Create User</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default AddUser;