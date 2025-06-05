import React, { useEffect, useState } from 'react';
import style from "./Header.module.css";
import { Link } from 'react-router-dom';
// import { IoIosNotifications } from "react-icons/io";
import { IoIosWallet } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import Model from "react-modal";
import { useContextData } from '../Context/Context';
import ChangePassword from '../LogIn/ChangePassword';
import { APIPath } from '../ApIPath/APIPath';

function Header({ open, handleOpen, handleLogOut }) {
  const { availableCredits, merchantName,token } = useContextData();
  const [isUserIconClick, setIsUserIconClick] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isChangePassword, setIsChangePassword] = useState(false);
  const [rate, setRate] = useState([]);

  useEffect(() => {
    fetch(`${APIPath}merchant-service/metal-rates`,{
      headers:{
        'Authorization':`Bearer ${token}`,
        'Content-Type':'Application/json'
      },
      method:'GET',
      mode:'cors'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log(data)
        if (data && data.data) {
          setRate(data.data);
        }
      })
      .catch((error) => {
        console.error('Fetch error:', error);
      });
  }, []);

  const closeUserClick = () => {
    setIsUserIconClick(false);
  }
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: "100",
    },
    content: {
      overlay: { backgroundColor: 'transparent' },
      boxShadow: "0 5px 5px rgb(38,38,38,0.5)",
      height: "fit-content",
      width: "fit-content",
      position: "absolute",
      right: "20px",
      top: "50px",
      bottom: "auto",
      left: "auto",
      padding: "2px 10px"
    },
  };
  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 2000)
  }, []);

  const openChangePassword = () => {
    setIsChangePassword(true);
    closeUserClick();
  }

  const closeChangePassword = () => {
    setIsChangePassword(false);
  }

  return <>
    <div className={style.header_parent}>
      <div className={open ? style.header_logo_and_container : style.header_logo_and_close}>
        <Link to="/" className={style.logo_container}>
          <img src='/AuxiGoldLogo1.png' alt='Company Logo' />
          {/* <p>Auxi-Vaults Admin</p> */}
        </Link>
        <h2 className={style.forward_and_backward_icon} onClick={handleOpen}>{open ? <span>&lt;</span> : <span>&gt;</span>}</h2>
      </div>
      {/* <div className={style.slider}>
        <p><button className={style.live_dot}></button>
          <span className={style.live_text}>Live</span></p>
      </div> */}
      <div className={style.slider_wrapper}>
        <div className={style.slider_container}>
          <p>Gold Rate: {rate?.gold_rate}/gm, Silver Rate: {rate?.silver_rate}/gm</p>
        </div>
      </div>
      <div className={style.header_notification_and_user_icon}>
        {loading ? <div className={style.loader}></div> :
          <div className={style.wallet_container}>
             {availableCredits > 0 ? <p className={style.wallet_value}>{availableCredits}</p> :
              <p className={style.wallet_value}>0</p>}
            <h2><IoIosWallet /></h2>
          </div>
        }
        <h2 onClick={() => setIsUserIconClick(true)}><FaUser /></h2>
      </div>
    </div>
    {isUserIconClick &&
      <Model
        isOpen={isUserIconClick}
        onRequestClose={closeUserClick}
        style={customStyles}
      >
        <ul className={style.user_menu_list}>
          <li><Link to='/profile' onClick={closeUserClick}>{merchantName}</Link></li>
          <li><Link onClick={() => openChangePassword()}>Change Password</Link></li>
          <li><Link onClick={handleLogOut} to="/">Log out</Link></li>
        </ul>
      </Model>
    }
    {isChangePassword && <ChangePassword close={closeChangePassword} handleLogOut={handleLogOut} />}
  </>
}

export default Header;