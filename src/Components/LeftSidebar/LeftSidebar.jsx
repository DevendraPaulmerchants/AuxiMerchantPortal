import React, { useEffect, useState } from 'react';
import style from "./LeftSidebar.module.css";
import "./LeftSidebar.css";
import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { MdOutlineRealEstateAgent, MdOutlineAccountBalance, MdInsights } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";
import { FiUserCheck } from "react-icons/fi";
import { BiCreditCard } from "react-icons/bi";
import { AiOutlineCustomerService, AiOutlineFileSearch, AiOutlineGold } from 'react-icons/ai';
import { FaBalanceScale, FaMoneyBillWave, FaRegCreditCard, FaUserShield } from 'react-icons/fa';
import { BsCashStack } from 'react-icons/bs';

function LeftSidebar({ open }) {
    const navigation = React.useMemo(() => [
        { title: "Dashboard", path: "/", icon: <RiDashboardFill title='Dashboard' /> },
        { title: "Agents", path: "/agent", icon: <MdOutlineRealEstateAgent title='Agents List' /> },
        { title: "Customers", path: "/customer", icon: <FiUserCheck title='Customers List' /> },
        {
            title: "Credits",
            path: "--",
            icon: <BiCreditCard />,
            subnavigation: [
                { title: "Requested to Admin", path: "/credit", icon: <BiCreditCard title='Requested Credits to Admin' /> },
                { title: "Requested from Agent", path: "/credit_approval", icon: <BsCashStack title='Requested Credits from Agent' /> }
            ]
        },
        {
            title: "Transactions",
            path: "--", // no actual route
            icon: <MdOutlineAccountBalance />,
            subnavigation: [
                { title: "Gold", path: "/gold", icon: <AiOutlineGold title='Golds Transactions List' /> },
                { title: "Silver", path: "/silver", icon: <BsCashStack title='Silver Transactions List' /> },
                { title: "Credits", path: "/credits_taransaction", icon: <BsCashStack title='Credits Transactions List' /> },
            ]
        },
        {
            title: "Manage Margin",
            path: "--",
            icon: <MdInsights />,
            subnavigation: [
                // { title: "Global", path: "/global_margin", icon: <FaMoneyBillWave /> },
                { title: "Schemes", path: "/scheme_margin", icon: <FaBalanceScale title='Scheme List' /> },
            ]
        },
        // { title: "Credits", path: "/credit", icon: <BiCreditCard /> },
        // { title: "Approval Credits", path: "/credit_approval", icon: <BsCashStack /> },
        { title: "Portal Users", path: "/users", icon: <FaUserShield title='Portal Users List' /> },
        {
            title: "Support & Tickets",
            path: "--",
            icon: <AiOutlineCustomerService />,
            subnavigation: [
                { title: "Support", path: "/query", icon: <AiOutlineCustomerService title='Requested Query to Admin' /> },
                { title: "View Ticket", path: "/view_ticket", icon: <AiOutlineFileSearch title='Requested Query from Agent' /> }
            ]
        },
        // { title: "Support", path: "/query", icon: <AiOutlineCustomerService /> },
        // { title: "View Ticket", path: "/view_ticket", icon: <AiOutlineFileSearch /> },
        { title: "Manage Bank Account", path: "/bank", icon: <FaRegCreditCard title='Previously Added Banks' /> },
        // {
        //     title: "Transactions",
        //     path: "--", // no actual route
        //     icon: <MdOutlineAccountBalance />,
        //     subnavigation: [
        //         { title: "Gold", path: "/gold", icon: <AiOutlineGold /> },
        //         { title: "Silver", path: "/silver", icon: <BsCashStack /> },
        //         { title: "Credits", path: "/credits_taransaction", icon: <BsCashStack /> },
        //     ]
        // },
    ], []);

    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        navigation.forEach((navItem, index) => {
            if (navItem.subnavigation?.some(sub => sub.path === location.pathname)) {
                setOpenDropdown(index);
            }
        });
    }, [location.pathname, navigation]);
    const handleDropdownClick = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const isActive = (nav) => {
        if (nav.subnavigation) {
            return nav.subnavigation.some(sub => location.pathname.startsWith(sub.path));
        }
        return location.pathname === nav.path;
    };

    return (
        <div className={open ? style.leftsidebar_parent_container : style.leftsidebar_parent_container_close}>
            {navigation.map((nav, index) => (
                <div key={index} className={isActive(nav) ? `${style.leftsidebar_container} ${style.leftsidebar_active}` : style.leftsidebar_container}>
                    {!nav.subnavigation ? (
                        <NavLink to={nav.path}>
                            <div className={style.nav_item}>
                                <span className={style.list_icon}>{nav.icon}</span>
                                <span className={style.list_title}>{nav.title}</span>
                            </div>
                        </NavLink>
                    ) : (
                        <div
                            className={style.nav_item}
                            onClick={() => handleDropdownClick(index)}
                            style={{ cursor: "pointer" }}
                        >
                            <div className={style.nav_without_path}>
                                <span className={style.list_icon}>{nav.icon}</span>
                                <span className={style.list_title}
                                    style={{ fontWeight: "500", fontSize: "14px", marginLeft: "-10px" }}
                                >{nav.title}</span>
                            </div>
                            <span className={style.dropdown_icon}>
                                {openDropdown === index ? <FiChevronDown /> : <FiChevronRight />}
                            </span>
                        </div>
                    )}
                    {/* <div className={!open ? style.list_title_on_hover : style.display_none}>
                        <p>{nav.title}</p>
                    </div> */}
                    {nav.subnavigation && openDropdown === index && (
                        <div className={style.subnavigation_container}>
                            {nav.subnavigation.map((subNav, subIndex) => (
                                <div key={subIndex} className={location.pathname === subNav.path ? `${style.subnav_item} ${style.leftsidebar_active}` : style.subnav_item}>
                                    <NavLink to={subNav.path}>
                                        <span className={style.sub_list_icon}>{subNav.icon}</span>
                                        <span className={style.sub_list_title}>{subNav.title}</span>
                                    </NavLink>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default LeftSidebar;
