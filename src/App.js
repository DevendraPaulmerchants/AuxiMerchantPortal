import './App.css';
import styles from "../src/Components/Agent/Merchants.module.css"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import { DataProvider } from './Components/Context/Context';

// Lazy loaded components
const Home = lazy(() => import('./Components/Home/Home'));
const Header = lazy(() => import('./Components/Header/Header'));
const LeftSidebar = lazy(() => import('./Components/LeftSidebar/LeftSidebar'));
const LogIn = lazy(() => import('./Components/LogIn/LogIn'));
const Credits = lazy(() => import('./Components/Credits/Credits'));
const AgentList = lazy(() => import('./Components/Agent/AgentLIst'));
const AgentDetails = lazy(() => import('./Components/Agent/AgentDetails'));
const SubMerchantList = lazy(() => import('./Components/SubMerchant/SubMerchantList'));
const SubMerchantDetails = lazy(() => import('./Components/SubMerchant/SubMerchantDetails'));
const CustomerList = lazy(() => import('./Components/Customer/CustomerList'));
const CustomerDetails = lazy(() => import('./Components/Customer/CustomerDetails'));
const Permission = lazy(() => import('./Components/Permission/Permission'));
const Role = lazy(() => import('./Components/Role/Role'));
const CreditDetails = lazy(() => import('./Components/Credits/CreditDetails'));
const QueryList = lazy(() => import('./Components/Query/QueryList'));
const QueryDetails = lazy(() => import('./Components/Query/QueryDetails'));
const CreditApproval = lazy(() => import('./Components/Credits/ApprovalCredits'));
const ApprovalCreditDetails = lazy(() => import('./Components/Credits/ApprovalCreditDetails'));
const TicketList = lazy(() => import('./Components/Ticket/Ticket'));
const TicketDetails = lazy(() => import('./Components/Ticket/TicketDetails'));
const PortalUsers = lazy(() => import('./Components/PortalUser/PortalUser'));
const GoldTransaction = lazy(() => import('./Components/Transactions/GoldTransaction'));
const SilverTransaction = lazy(() => import('./Components/Transactions/SilverTransaction'));
const Profile = lazy(() => import('./Components/Profile/Profile'));
const CreditTransaction = lazy(() => import('./Components/Transactions/CreditTransaction'));
const SchemeMargin = lazy(() => import('./Components/Manage_Margin/SchemeMargin'));
const BankList = lazy(() => import('./Components/Bank/BankList'));

function App() {
  const [open, setOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedMerchantId = localStorage.getItem("merchantId");
    if (storedToken && storedMerchantId) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleOpen = () => {
    setOpen(!open);
  };
  const handleLogIn = () => {
    setIsAuthenticated(true);
  };
  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("merchantId");
    setIsAuthenticated(false);
  };

  return (
    <div className="App">
      <DataProvider>
        <Router>
          <Suspense fallback={<div className={styles.loader_container}><div className={styles.loader_item}></div></div>}>
            {isAuthenticated && <Header open={open} handleOpen={handleOpen} handleLogOut={handleLogOut} />}
            <div className="app_layout">
              {isAuthenticated && <LeftSidebar open={open} />}
              <Routes>
                {!isAuthenticated ? (
                  <Route path="*" element={<LogIn handleLogIn={handleLogIn} />} />
                ) : (
                  <>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path='customer' element={<CustomerList />} />
                    <Route path='customer/id/:customerId' element={<CustomerDetails />} />
                    <Route path='agent' element={<AgentList />} />
                    <Route path='agent/id/:agentId' element={<AgentDetails />} />
                    <Route path='sub_merchant' element={<SubMerchantList />} />
                    <Route path='sub_merchant/:id' element={<SubMerchantDetails />} />
                    {/* -------- Credits ---------------- */}
                    <Route path='/credit' element={<Credits />} />
                    <Route path='credit/:id' element={<CreditDetails />} />
                    <Route path='/credit_approval' element={<CreditApproval />} />
                    <Route path='/credit_approval/:id' element={<ApprovalCreditDetails />} />

                    <Route path='/permission' element={<Permission />} />
                    <Route path='/role' element={<Role />} />
                    <Route path='/users' element={<PortalUsers />} />
                    <Route path='/query' element={<QueryList />} />
                    <Route path='/query/:id' element={<QueryDetails />} />
                    <Route path='/view_ticket' element={<TicketList />} />
                    <Route path='/view_ticket/:id' element={<TicketDetails />} />
                    {/* ------- Metal Transactions -------------- */}
                    <Route path='/gold' element={<GoldTransaction />} />
                    <Route path='/silver' element={<SilverTransaction />} />
                    <Route path='/credits_taransaction' element={<CreditTransaction />} />

                    <Route path='/scheme_margin' element={<SchemeMargin />} />
                    <Route path='/bank' element={<BankList />} />
                    <Route path='/profile' element={<Profile />} />
                    <Route path="*" element={<Navigate replace to="/" />} />
                  </>
                )}
              </Routes>
            </div>
          </Suspense>
        </Router>
      </DataProvider>
    </div>
  );
}

export default App;
