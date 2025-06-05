export const CamelCase = (str) => {
    if (typeof str !== 'string') return '';
    let finalString = [];
    const requiredString = str.split(" ");
    for (var i = 0; i < requiredString.length; i++) {
        finalString.push(
            requiredString[i].charAt(0).toUpperCase() + requiredString[i].slice(1).toLowerCase()
        );
    }
    return finalString.join(" ");
}

export const handleInputChangeWithAlphabetOnly = (e, setValue) => {
    const input = e.target.value;
    const isAlphabetic = /^[a-zA-Z\s]*$/.test(input);
    const sanitizedValue = input.replace(/^\s+|\s+(?=\s)/g, '').replace(/[0-9]/g, '');
    setValue(CamelCase(sanitizedValue));
    // setValid(isAlphabetic);
};
const IsValidemail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
export const handleEmailChange = (e, setValue, setValid) => {
    const email = e.target.value;
    setValue(email);
    if (IsValidemail.test(email)) {
        setValid(true);
    }
    else {
        setValid(false);
    }
}
export const handleInputChangeWithNumericValueOnly = (e, setValue) => {
    const input = e.target.value;
    const isAlphabetic = /^[0-9\s]*$/.test(input);
    const sanitizedValue = input.replace(/^\s+|\s+(?=\s)/g, '').replace(/[a-zA-Z]/g, '');
    setValue(CamelCase(sanitizedValue));
    // setValid(isAlphabetic);
};

export const handlePANCardNumber = (e, setValue, setValid) => {
    const input = e.target.value.toUpperCase();
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/; // PAN number format validation
    setValue(input);
    if (panRegex.test(input)) {
        setValid(true);
    } else {
        setValid(false);
    }
};
export const handleIFSC = (e, setValue, setValid) => {
    const input = e.target.value.toUpperCase();
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    setValue(input);
    if (ifscRegex.test(input)) {
        setValid(true)
    } else {
        setValid(false)
    }
}
// ---------------------------- Password Validation -------------------
export const handlePassword = (e, setValue, setValid) => {
    e.preventDefault();
    const value = e.target.value;
    setValue(value);
    const isValidPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/.test(value);
    setValid(isValidPassword);
}
// ----------- Convert URL to FIle -------------
 export const urlToFile = async (url, filename, mimeType) => {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return new File([buffer], filename, { type: mimeType });
  };
//   ---------- Aadhar validation ---------------
export function isValidAadhaar(e, setValue, setIsValid) {
    const aadhaar = e.target.value;
    setValue(aadhaar); // Always update the input value first
  
    const aadhaarRegex = /^[2-9]{1}[0-9]{11}$/;
    setIsValid(aadhaarRegex.test(aadhaar)); // Validate after setting the value
  }
  
  
  