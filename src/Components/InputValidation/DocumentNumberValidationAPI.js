export const validatePANNumberWithAPI = async (pan,setLoader) => {
    setLoader(true);
    const response = await fetch('http://103.171.97.105:8078/external-module/external/pan_basic_v1', {
        method: 'POST',
        headers: { 
            'X-Client-ID':"auxi-vault5cf58610-8d34-4f3c-9666-b073a64fdd8d",
            'X-Client-Secret':"Y7a4s-YPd5lbd2mtMjuvWSKekeKvjsNzVPjvYHicEcI",
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pan_no:pan }),
        mode:'cors'
    });
    const data = await response.json();
    console.log("PAN API Response:", data);
    setLoader(false);
    return data.data.result;
};

export const validateAadharNumberWithAPI = async (aadhar) => {
    const response = await fetch('/api/validate-aadhar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aadhar }),
    });
    const result = await response.json();
    console.log("Aadhar API Response:", result);
};