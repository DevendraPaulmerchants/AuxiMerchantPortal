import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from "react";
import { APIPath } from "../ApIPath/APIPath";

const Context = createContext();

export const DataProvider = ({ children }) => {
    const [merchantId, setMerchantId] = useState(null);
    const [token, setToken] = useState(null);
    const [merchantName, setMerchantName] = useState(null);
    const [merchantEmail, setMerchantEmail] = useState('');
     const [profileData, setProfileData] = useState(null); 
    const [agentParentList, setAgentParentList] = useState(null);
    const [availableCredits, setAvailableCredits] = useState(0);
    // const [isLoading, setIsLoading] = useState(false);
    const [user, setUser] = useState(null);
    const [isHomeLoading, setIsHomeLoading] = useState(false);

    // Load token and merchantId from localStorage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        const storedMerchantId = localStorage.getItem("merchantId");
        const storedMerchantName = localStorage.getItem("merchantName");
        if (storedToken && storedMerchantId) {
            setToken(storedToken);
            setMerchantId(storedMerchantId);
            setMerchantName(storedMerchantName);
        }
    }, []);

    // Persist token and merchantId to localStorage
    useEffect(() => {
        if (token && merchantId && merchantName) {
            localStorage.setItem("token", token);
            localStorage.setItem("merchantId", merchantId);
            localStorage.setItem("merchantName", merchantName);
        }
    }, [token, merchantId, merchantName]);

    // -------------- Count used at Dashboard ----------------
    const getUserDetails = useCallback((startDate, endDate) => {
        if (!merchantId || !token) return;

        const startdate = startDate || new Date().toISOString().split("T")[0];
        const enddate = endDate || " ";
        setIsHomeLoading(true);
        fetch(`${APIPath}merchant-service/count/${merchantId}?startDate=${startdate}&endDate=${enddate}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': "application/json"
            },
            method: "GET",
            mode: "cors"
        })
            .then((res) => res.json())
            .then((data) => {
                if (data?.status_code !== 200) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("merchantId");
                    localStorage.removeItem("merchantName");
                    alert("Session expired, please log in again.");
                    window.location.reload();
                    return;
                }
                if (data?.data) {
                    setUser(data.data);
                    setAvailableCredits(data.data.available_credit || 0);
                }
            })
            .catch((err) => {
                console.error("Error fetching user details:", err);
            })
            .finally(() => {
                setIsHomeLoading(false);
            });
    }, [merchantId, token,]);

    // ----------------- Peofile that will use at the profile section --------------------

    const getMerchantProfile = useCallback(() => {
        if (!merchantId || !token) return;
        fetch(`${APIPath}merchant-service/count/merchant-profile/${merchantId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            method: 'GET',
            mode: 'cors'
        }).then((res) => res.json())
            .then((data) => {
                console.log(data)
                setProfileData(data.data);
                setMerchantEmail(data.data?.merchant.primary_contact.person_email)
            })
            .catch((err) => {
                console.error(err)
            })
    }, [merchantId,token])

    useEffect(() => {
        getUserDetails();
        getMerchantProfile();
    }, [getUserDetails, getMerchantProfile]);

    const contextValue = useMemo(() => ({
        merchantId, setMerchantId,
        token, setToken,
        merchantEmail, setMerchantEmail,
        profileData, setProfileData,
        isHomeLoading,
        availableCredits, setAvailableCredits,
        agentParentList, setAgentParentList,
        merchantName, setMerchantName,
        user, setUser,
        getUserDetails,
    }), [
        merchantId,
        token,
        merchantEmail,
        profileData,
        isHomeLoading,
        availableCredits,
        agentParentList,
        merchantName,
        user,
        getUserDetails,
    ]);

    return (
        <Context.Provider value={contextValue}>
            {children}
        </Context.Provider>
    );
};

export const useContextData = () => useContext(Context);
