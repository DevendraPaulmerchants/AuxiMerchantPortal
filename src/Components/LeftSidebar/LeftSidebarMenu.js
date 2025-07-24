import { AiOutlineCustomerService, AiOutlineFileSearch, AiOutlineGold } from "react-icons/ai";
import { BiCreditCard } from "react-icons/bi";
import { BsCashStack } from "react-icons/bs";
import { FaBalanceScale, FaRegCreditCard, FaUserShield } from "react-icons/fa";
import { FiUserCheck } from "react-icons/fi";
import { MdInsights, MdOutlineAccountBalance, MdOutlineRealEstateAgent } from "react-icons/md";
import { RiDashboardFill } from "react-icons/ri";

 export const navigation =[
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
        { title: "Manage Bank Account", path: "/bank", icon: <FaRegCreditCard title='Previously Added Banks' /> },
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
        // { title: "Manage Bank Account", path: "/bank", icon: <FaRegCreditCard title='Previously Added Banks' /> },

    ];