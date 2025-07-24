import React, { useEffect, useState } from 'react';
import style from "./LeftSidebar.module.css";
import "./LeftSidebar.css";
import { NavLink, useLocation } from 'react-router-dom';
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { navigation } from './LeftSidebarMenu';

function LeftSidebar({ open }) {
    const location = useLocation();
    const [openDropdown, setOpenDropdown] = useState(null);

    useEffect(() => {
        navigation.forEach((navItem, index) => {
            if (navItem.subnavigation?.some(sub => sub.path === location.pathname)) {
                setOpenDropdown(index);
            }
        });
    }, [location.pathname]);
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
