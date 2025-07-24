import React, { useState } from 'react';
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import style from "./LogIn.module.css";
import style1 from "../Agent/Merchants.module.css"
import { useContextData } from '../Context/Context';
import { APIPath } from '../ApIPath/APIPath';

function LogIn({ handleLogIn }) {
    const { setToken, setMerchantId,setMerchantName } = useContextData();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState();
    const [showPass, setShowPass] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const newUser = {
        username: email?.trim(""),
        password: password?.trim(""),
        type_of_user:'MERCHANT'
    }

    const handleLogInData = () => {
        setIsLoading(true);
        fetch(`${APIPath}oauth-service/auth/token`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newUser),
            mode:'cors'
        })
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            if(data?.status_code !== 200) {
              alert("Invalid credentials, please try again.");
              return;
            }
            alert(data.message);
            setToken(data?.data?.token);
            setMerchantId(data?.data?.user_id);
            setMerchantName(data?.data?.user_name);
            handleLogIn();
            
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
                <div>
                    <h2 className={style.welcome_massage_h2}>Welcome</h2>
                    <p className={style.welcome_massage_p}>to the Auxivault Merchant portal</p>
                </div>
                <form onSubmit={(e) => { e.preventDefault(); handleLogInData(); }}>
                    <div className={style.label_and_input_field}>
                        <label>Email:</label>
                        <input type='email' placeholder='Enter user email' required minLength={5} maxLength={50}
                            value={email} onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={style.label_and_input_field}>
                        <label>Password: </label>
                        <div className={style.login_password_and_icon}>
                            <input type={showPass ? 'text' : 'password'} placeholder='Enter Password' required minLength={5} maxLength={16}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                            />
                            <span onClick={() => setShowPass(!showPass)}>{showPass ? <IoIosEye /> : <IoIosEyeOff />}</span>
                        </div>
                    </div>
                    <br />
                    {isLoading ? <div className={style1.loader_container}>
                        <div className={style1.loader_item}>
                            <img src='/gold-coin.png' alt='Gold Coin' />
                        </div> </div>:
                        <div >
                            <button className={style1.primary_login_btn}>LogIn</button>
                        </div>
                    }
                    </form>
            </div>
        </div>
    </>
}

export default LogIn;