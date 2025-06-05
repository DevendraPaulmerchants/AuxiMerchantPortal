// export default AddNewRole;
import React, { useState, useEffect } from 'react';
import style from "../Agent/Merchants.module.css"
import Select from "react-select";
import { IoMdClose } from "react-icons/io";
import { handleInputChangeWithAlphabetOnly } from '../InputValidation/InputValidation';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';

function AddNewRole({ close, selectedRoleId, selectedRole,updateList }) {
    document.body.style.overflow = "hidden";
    const { token } = useContextData();
    const [name, setName] = useState(selectedRole?.name || "");
    const [description, setDescription] = useState(selectedRole?.description || "");
    const [permissionList, setPermissionList] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectPermission, setSelectPermission] = useState({
        permissions_names: [],
        permissions_ids: [],
    });

    // useEffect(() => {
    //     fetch(`http://192.168.1.41:8090/merchant-service/roles/${selectedRoleId}`, {
    //         headers: {
    //             'Authorization': `Bearer `,
    //             'Content-Type': "Application/json",
    //         },
    //         method: "GET",
    //         mode: "cors"
    //     })
    //         .then((res) => res.json())
    //         .then((data) => {
    //             setNewOption(data.data)
    //         })
    //         .catch((err) => console.error(err))
    // }, [selectedRoleId])

    const getPermissionList = () => {
        fetch(`${APIPath}merchant-service/permissions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'Application/json'
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data)
                setPermissionList(data.data);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    useEffect(() => {
        getPermissionList();
    }, []);

    const permissionOptions = permissionList?.map(permission => ({
        value: permission.id,
        label: `${permission.name}`,
    }));

    const handlePermissionChange = (selectedOptions) => {
        const permissions_names = selectedOptions.map(option => option.label);
        const permissions_ids = selectedOptions.map(option => option.value);

        setSelectPermission({ permissions_names, permissions_ids });
    };

    const newRoleData = {
        name: name,
        description: description,
        permission_ids: selectPermission.permissions_ids,
    };

    const addPermission = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const url = selectedRoleId ? `${APIPath}merchant-service/roles/${selectedRoleId}` : `${APIPath}merchant-service/roles`;
        const method = selectedRoleId ? "PATCH" : "POST";
        fetch(url, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            method: method,
            mode: "cors",
            body: JSON.stringify(newRoleData)
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.status_code === 409) {
                    alert(data.message);
                    return;
                }
                close();
                updateList()
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container} style={{ height: "fit-content" }}>
                <div className={style.add_merchants_header}>
                    <h2>{selectedRoleId ? "Update Role" : "Add new Role"}</h2>
                    <h3 onClick={close}><IoMdClose /></h3>
                </div>
                <form onSubmit={(e) => addPermission(e)}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label>Name* </label>
                            <input type='text' required placeholder='Enter Name' minLength={3} maxLength={30} value={name}
                                readOnly={selectedRoleId}
                                onChange={(e) => handleInputChangeWithAlphabetOnly(e, setName)} />
                        </div>
                        <div className={style.name_label_input_contaner}>
                            <label>Descriptions* </label>
                            <textarea type='text' required placeholder='Enter descriptions' maxLength={200} value={description}
                                onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <div className={style.name_label_input_contaner}>
                        <label>Permission Name* </label>
                        <Select
                            options={permissionOptions}
                            isMulti
                            onChange={handlePermissionChange}
                            placeholder="Select Permissions..."
                        />
                    </div>
                    {isLoading ? (
                        <div className={style.loader_container}>
                            <div className={style.loader_item}>
                                <img src='/gold-coin.png' alt='Gold loading...' />
                            </div>
                        </div>
                    ) : (
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn}>{selectedRoleId ? "Update Role" : "Add Role"}</button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default AddNewRole;







