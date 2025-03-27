// utils/kycUtils.ts

enum KycStatusColors {
    Blocked = 'red',
    Verified = 'green',
    Pending = 'orange',
    Incomplete = 'red',
    AdminBlocked = 'gray'
  }
  
  export const getButtonColor = (playerData: any): string => {
    if (playerData?.data?.block === 'yes') return KycStatusColors.Blocked;
    
    if (playerData?.data?.kyc === 'yes' && playerData?.data?.isKycByAdmin === 'yes') 
      return KycStatusColors.Verified;
    
    if (playerData?.data?.iskycPending === 'rejected') 
      return KycStatusColors.Incomplete;
    
    if (playerData?.data?.iskycPending === 'yes') 
      return KycStatusColors.Pending;
    
    if (playerData?.data?.isKycByAdmin === 'no' && playerData?.data?.kyc === 'yes') 
      return KycStatusColors.AdminBlocked;
    
    return KycStatusColors.Incomplete;
  };
  
  export const getButtonText = (playerData: any): string => {
    if (playerData?.data?.block === 'yes') return 'User Blocked!';
    
    if (playerData?.data?.kyc === 'yes' && playerData?.data?.isKycByAdmin === 'yes') 
      return 'KYC Verified!';
    
    if (playerData?.data?.iskycPending === 'rejected') 
      return 'KYC Rejected! Re-Submit';
    
    if (playerData?.data?.iskycPending === 'yes') 
      return 'KYC Pending!';
    
    if (playerData?.data?.isKycByAdmin === 'no' && playerData?.data?.kyc === 'yes') 
      return 'KYC Removed (Admin)';
    
    return 'Incomplete KYC!';
  };


  // export const getButtonText = (playerData: any): string => {
  //   if (playerData?.block === 'yes') return 'User Blocked!';
    
  //   if (playerData?.kyc === 'yes' && playerData?.isKycByAdmin === 'yes') 
  //     return 'KYC Verified!';
    
  //   if (playerData?.iskycPending === 'rejected') 
  //     return 'KYC Rejected! Re-Submit';
    
  //   if (playerData?.iskycPending === 'yes') 
  //     return 'KYC Pending!';
    
  //   if (playerData?.isKycByAdmin === 'no' && playerData?.kyc === 'yes') 
  //     return 'KYC Removed (Admin)';
    
  //   return 'Incomplete KYC!';
  // };