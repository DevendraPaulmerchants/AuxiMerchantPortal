import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import style from "./LogIn.module.css";
import style1 from "../Agent/Merchants.module.css"
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';
import { handlePassword } from '../InputValidation/InputValidation';
import { useNavigate } from 'react-router-dom';

function ChangePassword({ close,handleLogOut }) {
    const { token, merchantId } = useContextData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [showPass, setShowPass] = useState(false);
    const [isvalidPass, setIsValidPass] = useState(true);
    const [confirmPassword, setConfirmPassword] = useState();
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [isValidConfirmPass, setIsValidConfirmPass] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const newUser = {
        merchant_id: merchantId,
        email: email?.trim(""),
        new_password: password?.trim(""),
        confirm_password: confirmPassword?.trim(""),
    }
    const handleConfirmPassword = (e) => { 
        setConfirmPassword(e.target.value);
        if (password !== e.target.value) {
            setIsValidConfirmPass(false);
        } else {
            setIsValidConfirmPass(true);
        }
    }
    const navigate= useNavigate();

    const handleLogInData = () => {
        if (password !== confirmPassword) {
            alert("New Password and Confirm New Password do not match.");
            setIsValidConfirmPass(false);
            return;
        }
        setIsLoading(true);
        fetch(`${APIPath}oauth-service/auth/change-password`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newUser),
            mode: 'cors'
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if(data?.status_code !== 200) {
                    alert(data.message);
                    return;
                }
                alert(`${data.message} Please login with new credentials ...`);
                handleLogOut();
                close();
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };


    return <>
        <div className={style.login_parent}>
            <div className={style.login_container}>
                <div className={style.page_header}>
                    <h3 className={style.welcome_massage_h2}>Change Password</h3>
                    <h2 className={style.welcome_massage_h2} onClick={close} >X</h2>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleLogInData(); }}>
                    <div className={style.label_and_input_field}>
                        <label>Email:</label>
                        <input type='email' placeholder='Enter user email' required minLength={5} maxLength={50}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={style.label_and_input_field}>
                        <label>New Password: </label>
                        <div className={style.login_password_and_icon}>
                            <input type={showPass ? 'text' : 'password'} placeholder='Enter Password' required minLength={5} maxLength={16}
                                value={password} onChange={(e) => handlePassword(e, setPassword, setIsValidPass)}
                            />
                            <span onClick={() => setShowPass(!showPass)}>{showPass ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>
                        {!isvalidPass && password?.length > 0  && <p className={style.invalid_password}>
                            Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.
                        </p>}
                    </div>
                    <div className={style.label_and_input_field}>
                        <label> Confirm Password: </label>
                        <div className={style.login_password_and_icon}>
                            <input type={showConfirmPass ? 'text' : 'password'} placeholder='Enter Password' required minLength={5} maxLength={16}
                                value={confirmPassword} onChange={(e) => handleConfirmPassword(e)}
                            />
                            <span onClick={() => setShowConfirmPass(!showConfirmPass)}>{showPass ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>
                        {!isValidConfirmPass && <p className={style.invalid_password}>Oops! Your passwords don’t match</p>}
                    </div>
                    <br />
                    {isLoading ? <div className={style1.loader_container}>
                        <div className={style1.loader_item}>
                            <img src='/gold-coin.png' alt='Gold Coin' />
                        </div> </div> :
                        <div >
                            <button className={style1.primary_login_btn}>Update</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    </>
}

export default ChangePassword;