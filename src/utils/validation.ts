export const validateMobile = (mobile: string): boolean => {
    return /^[0-9]{10}$/.test(mobile);
  };
  
  export const validateMpin = (mpin: string): boolean => {
    return /^[0-9]{6}$/.test(mpin);
  };