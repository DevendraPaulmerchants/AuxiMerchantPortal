import React, { useState } from 'react';
import style from '../Agent/Merchants.module.css';
import { IoMdClose } from 'react-icons/io';
import { FiSend } from 'react-icons/fi';
import { APIPath } from '../ApIPath/APIPath';
import { useContextData } from '../Context/Context';


function CommentPopUp({ close, ticketId,updateDetails }) {
    const { token,merchantId } = useContextData();
    const [comments, setComments] = useState('');
    const [isloading, setIsLoading] = useState(false);

    const handleComments = (e) => {
        e.preventDefault();
        setIsLoading(true);
        fetch(`${APIPath}ticket-service/tickets/${ticketId}/comments`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json",
            },
            method: "POST",
            body: JSON.stringify({
                userId: merchantId,
                userType: 'MERCHANT',
                comment: comments,
                internal: false
            }),
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                alert(data.message);
                updateDetails();
                close();
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    return (
        <div className={style.add_merchants_parent}>
            <div className={style.add_merchants_form_container}>
                <div className={style.add_merchants_header}>
                    <h2>Comments</h2>
                    <h2 onClick={close}><IoMdClose /></h2>
                </div>
                <form onSubmit={handleComments}>
                    <div className={style.name_email_parent_container}>
                        <div className={style.name_label_input_contaner}>
                            <label htmlFor='comments'>Comments:</label>
                            <textarea type='text' placeholder='enter comments..' required value={comments} maxLength={250}
                                onChange={(e) => setComments(e.target.value)} />
                        </div>
                    </div>
                    {isloading ? <div className={style.loader_container}><div className={style.loader_item}>
                        <img src='/gold-coin.png' alt='Gold loading...' />
                    </div></div> :
                        <div className={style.add_merchats_btn_container}>
                            <button className={style.primary_login_btn} type='submit'><FiSend /> Send</button>
                        </div>
                    }
                </form>
            </div>
        </div>
    )
}

export default CommentPopUp;