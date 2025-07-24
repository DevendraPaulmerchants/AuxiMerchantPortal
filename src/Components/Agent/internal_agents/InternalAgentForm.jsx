import { useEffect, useState } from 'react';
import style from '../Merchants.module.css';
import { useContextData } from '../../Context/Context';
import { APIPath } from '../../ApIPath/APIPath';
import { IoMdClose } from 'react-icons/io';

const InternalAgentForm = ({ close, selectedRow }) => {
    const { token, merchantId } = useContextData();
    const [loading, setLoading] = useState(false);
    console.log(selectedRow)

    const [agent, setAgent] = useState({
        merchant_id: merchantId,
        full_name: '',
        emp_id: '',
        mobile: '',
        email: '',
        branch_address: '',
        branch_code: '',
        designation: ''
    });

    useEffect(() => {
        if (selectedRow) {
            setAgent({
                merchant_id: merchantId,
                full_name: selectedRow.full_name || '',
                emp_id: selectedRow.emp_id || '',
                mobile: selectedRow.mobile || '',
                email: selectedRow.email || '',
                branch_address: selectedRow.branch_address || '',
                branch_code: selectedRow.branch_code || '',
                designation: selectedRow.designation || ''
            });
        }
    }, [selectedRow, merchantId]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAgent((prevAgent) => ({
            ...prevAgent,
            [name]: value,
        }));
    };

    const handleFormData = (e) => {
        e.preventDefault();
        console.log("Agent: ", agent);
        console.log("Update Click")
        setLoading(true)
        const url = selectedRow ? `${APIPath}merchant-service/internal-agent/${selectedRow?.id}` : `${APIPath}merchant-service/internal-agent`
        fetch(url, {
            method: selectedRow ? 'PUT' : 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(agent),
            mode: 'cors'
        })
            .then(async (res) => {
                const data = await res.json();
                console.log('Response:', res.status, data);
                if (!res.ok) {
                    alert(data.message || 'Failed to save agent');
                    return;
                }
                alert(data.message || 'Agent saved successfully');
                close();
            })
            .catch((err) => {
                console.error('Network error:', err);
            })
            .finally(() => setLoading(false));

    }

    return <div className={style.add_merchants_parent}>
        <div className={style.add_merchants_form_container}>
            <div className={style.add_merchants_header}>
                <h2>{selectedRow ? "Update this Agent" : "Add new Agent"}</h2>
                <h3 onClick={close}><IoMdClose /></h3>
            </div>
            <form onSubmit={handleFormData}>
                <div className={style.name_email_parent_container}>
                    <div className={style.name_label_input_contaner}>
                        <label htmlFor='full_name'>Agent Name* </label>
                        <input type='text' required placeholder='Enter agent name' maxLength={30}
                            name='full_name'
                            value={agent.full_name}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={style.name_label_input_contaner}>
                        <label htmlFor="emp_id">Emp Code* </label>
                        <input type='text' required placeholder='Enter Emp. Code' maxLength={6} minLength={5}
                            name='emp_id' value={agent.emp_id}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className={style.name_email_parent_container}>
                    <div className={style.name_label_input_contaner}>
                        <label htmlFor="mobile">Mobile* </label>
                        <input type='text' required placeholder='Enter Emp. mobile no.' maxLength={14}
                            name='mobile' value={agent.mobile}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={style.name_label_input_contaner}>
                        <label htmlFor="email">Email* </label>
                        <input type='email' required placeholder='Enter Emp. Email' maxLength={40}
                            name='email' value={agent.email}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className={style.name_email_parent_container}>
                    <div className={style.name_label_input_contaner}>
                        <label htmlFor="branch_address">Branch Address* </label>
                        <input type='text' required placeholder='Enter Branch address' maxLength={50}
                            name='branch_address' value={agent.branch_address}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className={style.name_label_input_contaner}>
                        <label htmlFor="branch_code">Branch* </label>
                        <select required
                            name='branch_code' value={agent.branch_code}
                            onChange={handleInputChange}
                        >
                            <option value="" disabled>Select Branch</option>
                            <option value="ZIR">Zirakpur</option>
                            <option value="RPN">Roopnagar</option>
                            <option value="PTL">Patiala</option>
                            <option value="MHL">Mohali</option>
                            <option value="160022">Chandigarh</option>
                        </select>
                    </div>
                </div>
                <div className={style.name_label_input_contaner}>
                    <label htmlFor="designation">Designation* </label>
                    <select id="designation" required
                        name='designation' value={agent.designation}
                        onChange={handleInputChange}
                    >
                        <option value="" disabled>Select Designation</option>
                        <option value="AGENT">Agent</option>
                        <option value="SENIOR_AGENT">Senior Agent</option>
                        <option value="SUPERVISOR">Supervisor</option>
                        <option value="MANAGER">Manager</option>
                        <option value="REGIONAL_HEAD">Regional Head</option>
                    </select>
                </div>
                <br />
                <div>
                    <button className={style.primary_login_btn}>{selectedRow ? 'Update' : 'Submit'}</button>
                </div>
            </form>
        </div>
    </div>
}
export default InternalAgentForm;