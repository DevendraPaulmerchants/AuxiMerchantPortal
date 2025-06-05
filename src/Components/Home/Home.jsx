import style from "./Home.module.css";
import style1 from "../Admin/Admin.module.css";
import styles from "../Agent/Merchants.module.css";
import { useContextData } from '../Context/Context';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DigitalGoldChart from "../DigitalGoldGraph/DigitalGold";
import PhysicalGoldChart from "../DigitalGoldGraph/PhysicalGold";

function Home() {
    const { isHomeLoading, user, getUserDetails } = useContextData();
    const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState('');
    // const [selectedmerchant, setSelectedMerchant] = useState(null);


    useEffect(() => {
        getUserDetails(startDate, endDate);
    }, [startDate, endDate, getUserDetails]);

    const navigate = useNavigate();

    return <>
        <div className={style1.merchants_parent}>
            {isHomeLoading ? <div className={styles.loader_container}><div className={styles.loader_item}>
                <img src='/gold-coin.png' alt='Loading...' />
            </div></div> :
                <>
                    <div className={style.filters}>
                        <p>Filter By : </p>
                        <div>
                            <label htmlFor="">Start Date: </label>
                            <input type="date" max={new Date().toISOString().split('T')[0]}
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="">End Date: </label>
                            <input type="date" value={endDate} min={startDate}
                                max={new Date().toISOString().split('T')[0]}
                                disabled={!startDate}
                                onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        {/* <select onChange={(e) => setSelectedMerchant(e.target.value)} className={styles.select}>
                            <option value="" disabled>Select Agent</option>
                            <option value="">All</option>
                            {merchant?.map((merchant) => (
                                <option key={merchant.id} value={merchant.id}>
                                    {merchant.merchant_name}
                                </option>
                            ))}
                        </select> */}
                    </div>
                    <div className={style.cards_and_news}>
                        <div className={style.home_header_container}>
                            <div className={style.home_numberOfMerchants}>
                                <h2><span>👥</span><span>Customer</span></h2>
                                <div className={style.agent_details_parent} >
                                    <div className={style.agent_details}
                                        onClick={(e) => {
                                            const active = "all";
                                            e.preventDefault();
                                            navigate(`/customer/status/${active}`)
                                        }}
                                    >
                                        <span>Total:</span>
                                        <span>{user?.total_customers || 0}🧑‍🤝‍🧑</span>
                                    </div>
                                    <div className={style.agent_details}
                                        onClick={(e) => {
                                            const active = "ACTIVE";
                                            e.preventDefault();
                                            navigate(`/customer/status/${active}`)
                                        }}>
                                        <span>Active:</span>
                                        <span>{user?.total_active_customers || 0}🟢</span>
                                    </div>
                                    <div className={style.agent_details}
                                        onClick={(e) => {
                                            const active = "INACTIVE";
                                            e.preventDefault();
                                            navigate(`/customer/status/${active}`)
                                        }}
                                    >
                                        <span>InActive:</span>
                                        <span>{user?.total_inactive_customers || 0}🔴</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.home_numberOfMerchants}>
                                <h2>
                                    <span>🧑‍💼</span> <span>Agent</span>
                                </h2>
                                <div className={style.agent_details_parent}>
                                    <div className={style.agent_details}
                                        onClick={(e) => {
                                            const active = "all";
                                            e.preventDefault();
                                            navigate(`/agent/status/${active}`)
                                        }}
                                    >
                                        <span>Total:</span>
                                        <span>{user?.total_agents || 0}👨‍💼</span>
                                    </div>
                                    <div className={style.agent_details}
                                        onClick={(e) => {
                                            const active = "ACTIVE";
                                            e.preventDefault();
                                            navigate(`/agent/status/${active}`)
                                        }}
                                    >
                                        <span>Active:</span>
                                        <span>{user?.total_active_agents || 0}🟢</span>
                                    </div>
                                    <div className={style.agent_details}
                                        onClick={(e) => {
                                            const active = "INACTIVE";
                                            e.preventDefault();
                                            navigate(`/agent/status/${active}`)
                                        }}
                                    >
                                        <span>InActive:</span>
                                        <span>{user?.total_inactive_agents || 0}🔴</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.home_numberOfMerchants}>
                                <h2><span>💳</span><span>Credits</span></h2>
                                <div className={`${style.agent_details_parent} ${style.card_not_clickable}`}>
                                    <div className={style.agent_details}
                                        onClick={() => navigate('/credit')}
                                    >
                                        <span>Total:</span>
                                        <span>{user?.total_credit || 0}💰</span>
                                    </div>
                                    <div className={style.agent_details}
                                        onClick={() => navigate('/credit_approval')}
                                    >
                                        <span>Distributed:</span>
                                        <span>{user?.distributed_credit || 0}📤</span>
                                    </div>
                                    <div className={style.agent_details}>
                                        <span>Consume:</span>
                                        <span>{user?.used_credit || 0}⚡</span>
                                    </div>
                                    <div className={style.agent_details}>
                                        <span>Available:</span>
                                        <span>{user?.available_credit || 0}🏦</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.home_numberOfMerchants}>
                                <h2><span>🧾</span><span>Queries</span></h2>
                                <div className={style.agent_details_parent}
                                // onClick={() => navigate('/view_ticket')}
                                >
                                    <div className={style.agent_details}>
                                        <span>Total:</span>
                                        <span>{user?.query_dashboard_dto?.total_query || 0}📋</span>
                                    </div>
                                    <div className={style.agent_details}
                                        onClick={() => navigate('/query')}
                                    >
                                        <span>Pending from Admin:</span>
                                        <span>{user?.query_dashboard_dto?.pending_query || 0}⏳</span>
                                    </div>
                                    <div className={style.agent_details}
                                        onClick={() => navigate('/view_ticket')}
                                    >
                                        <span>Pending of Agent:</span>
                                        <span>{user?.query_dashboard_dto?.pending_query || 0}⏳</span>
                                    </div>
                                    <div className={style.agent_details}>
                                        <span>Resolved:</span>
                                        <span>{user?.query_dashboard_dto?.resolved_query || 0}✅</span>
                                    </div>
                                </div>
                            </div>
                            <div className={style.home_numberOfMerchants}>
                                <h2><span>✅</span><span>Transactions</span></h2>
                                <div className={style.agent_details_parent}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td><span>Total:</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_trn_count || 0}</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_trn_amount?.toFixed(2) || 0} 📊</span></td>
                                            </tr>
                                            <tr>
                                                <td><span>Buy:</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_buy_trn_count || 0}</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_buy_trn_amount?.toFixed(2) || 0} 💸</span></td>
                                            </tr>
                                            <tr>
                                                <td><span>Sell:</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_sell_trn_count || 0}</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_sell_trn_amount?.toFixed(2) || 0} 💸</span></td>
                                            </tr>
                                            <tr>
                                                <td><span>Transfer:</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_transfer_trn_count || 0}</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_transfer_trn_amount?.toFixed(2) || 0} 🔄</span></td>
                                            </tr>
                                            <tr>
                                                <td><span>Conversion:</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_conversion_trn_count || 0}</span></td>
                                                <td><span>{user?.all_transaction_dto?.total_conversion_trn_amount?.toFixed(2) || 0} 🔁</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={style.home_numberOfMerchants}>
                                <h2><span>🏅</span><span>Gold</span></h2>
                                <div
                                    className={style.agent_details_parent}
                                // onClick={() => navigate('/gold')}
                                >
                                    <table>
                                        <tbody>
                                            {/* <tr>
                                                <td><span>Total:</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.buy_gold_in_grms || 0} g</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.buy_gold_in_tran?.toFixed(2) || 0} 🛒</span></td>
                                            </tr> */}
                                            <tr
                                                onClick={(e) => {
                                                    const active = "BUY";
                                                    e.preventDefault();
                                                    navigate(`/gold/${active}`)
                                                }}
                                            >
                                                <td><span>Buy:</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.buy_gold_in_grms || 0} g</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.buy_gold_in_tran?.toFixed(2) || 0} 🛒</span></td>
                                            </tr>
                                            <tr
                                            onClick={(e) => {
                                                const active = "SELL";
                                                e.preventDefault();
                                                navigate(`/gold/${active}`)
                                            }}
                                            >
                                                <td><span>Sell:</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.sell_gold_in_grms || 0} g</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.sell_gold_in_tran?.toFixed(2) || 0} 💸</span></td>
                                            </tr>
                                            <tr
                                            onClick={(e) => {
                                                const active = "TRANSFER";
                                                e.preventDefault();
                                                navigate(`/gold/${active}`)
                                            }}
                                            >
                                                <td><span>Transfer:</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.transfer_gold_in_grms || 0} g</span></td>
                                                <td><span>{user?.gold_dashboard_dto?.transfer_gold_in_tran?.toFixed(2) || 0} 🔄</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={style.home_numberOfMerchants}>
                                <h2><span>🥈</span><span>Silver</span></h2>
                                <div
                                    className={style.agent_details_parent}
                                    // onClick={() => navigate('/silver')}
                                >
                                    <table>
                                        <tbody>
                                            {/* <tr>
                                                <td><span>Total:</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.buy_silver_in_grms || 0} g</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.buy_silver_in_tran?.toFixed(2) || 0} 🛒</span></td>
                                            </tr> */}
                                            <tr
                                             onClick={(e) => {
                                                const active = "BUY";
                                                e.preventDefault();
                                                navigate(`/silver/${active}`)
                                            }}
                                            >
                                                <td><span>Buy:</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.buy_silver_in_grms || 0} g</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.buy_silver_in_tran?.toFixed(2) || 0} 🛒</span></td>
                                            </tr>
                                            <tr
                                             onClick={(e) => {
                                                const active = "SELL";
                                                e.preventDefault();
                                                navigate(`/silver/${active}`)
                                            }}
                                            >
                                                <td><span>Sell:</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.sell_silver_in_grms || 0} g</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.sell_silver_in_tran?.toFixed(2) || 0} 💸</span></td>
                                            </tr>
                                            <tr
                                             onClick={(e) => {
                                                const active = "TRANSFER";
                                                e.preventDefault();
                                                navigate(`/silver/${active}`)
                                            }}
                                            >
                                                <td><span>Transfer:</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.transfer_silver_in_grms || 0} g</span></td>
                                                <td><span>{user?.silver_dashboard_dto?.transfer_silver_in_tran?.toFixed(2) || 0} 🔄</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={style.home_numberOfMerchants}>
                                <h2><span>🔁</span><span>Conversion:</span></h2>
                                <div className={style.agent_details_parent}>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <span>{user?.conversion_dto?.total_gold_from_grams?.toFixed(3) || 0}g 🏅</span>
                                                </td>
                                                <td><span>➡️</span></td>
                                                <td>
                                                    <span>{user?.conversion_dto?.total_silver_to_grams?.toFixed(3) || 0}g 🥈</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <span>{user?.conversion_dto?.total_silver_from_grams?.toFixed(3) || 0}g 🥈</span>
                                                </td>
                                                <td><span>➡️</span></td>
                                                <td>
                                                    <span>{user?.conversion_dto?.total_gold_to_grams?.toFixed(3) || 0}g 🏅</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                            </div>
                        </div>
                        {/* <div className={style.trends_and_news}>
                                <DigitalGoldChart/>
                                <br/>
                               <PhysicalGoldChart/>
                        </div> */}
                    </div>
                </>
            }
        </div>
    </>
}

export default Home;