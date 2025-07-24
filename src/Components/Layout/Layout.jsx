import React, { useState } from 'react';
import style from "./Layout.module.css";
import Header from '../Header/Header'
import LeftSidebar from '../LeftSidebar/LeftSidebar'
import { Outlet } from 'react-router-dom'

function Layout({ handleLogOut }) {
    const [open, setOpen] = useState(true);
    const handleOpen = () => {
        setOpen(!open);
    };
    return <div className={style.layout_container}>
        <Header open={open} handleOpen={handleOpen} handleLogOut={handleLogOut} />
        <div className={style.sidebar_and_main_container}>
            <LeftSidebar open={open} />
            <div className={style.main_container}>
                <Outlet />
            </div>
        </div>
    </div>
}

export default Layout