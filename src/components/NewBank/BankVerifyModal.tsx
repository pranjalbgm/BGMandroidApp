import React, { useState, useEffect } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView 
} from "react-native";
import Modal from "react-native-modal";

import { fetchMobile } from "../../hooks/useWallet";
import useBankVerificationWithApi from "../../hooks/useBankVerificationWithApi";
import OTPModal from "./OTPModal";
import { usePlayerDataFetch } from "../../hooks/useHome";

// Define Types for Props
interface BankVerifyModalProps {
  show: boolean;
  handleClose: () => void;
}

// Define Types for Form Data
interface FormData {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  reEnterAccountNumber: string;
  ifscCode: string;
}

// Define Types for Error Messages
interface Errors {
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  reEnterAccountNumber?: string;
  ifscCode?: string;
}

const BankVerifyModal: React.FC<BankVerifyModalProps> = ({ show, handleClose }) => {
  const [formData, setFormData] = useState<FormData>({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    reEnterAccountNumber: "",
    ifscCode: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [showOTPModal, setShowOTPModal] = useState<boolean>(false);
  const [otpModalData, setOtpModalData] = useState<any>(null);
  const [mobileNumber, setMobileNumber] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { verifyBankDetails } = useBankVerificationWithApi();

  const { data: playerInfo, refetch } = usePlayerDataFetch(mobileNumber) as { data?: any; refetch: () => void };

  useEffect(() => {
    const initializeMobile = async () => {
      const fetchedMobile = await fetchMobile(setMobileNumber);
      if (fetchedMobile) {
        setMobileNumber(fetchedMobile);
        refetch(); // Ensure refetch is called when mobileNumber is available
      }
    };
    initializeMobile();
  }, [mobileNumber]);

  const handleChange = (name: keyof FormData) => (value: string) => {
    setFormData((prevFormData) => {
      let formattedValue = value;
  
      if (name === "accountNumber" || name === "reEnterAccountNumber") {
        formattedValue = value.replace(/\D/g, "").slice(0, 16); // Only numbers, max 16 digits
      }
  
      if (name === "accountHolder") {
        formattedValue = value.replace(/[^A-Z ]/g, ""); // Only capital letters & spaces
      }
  
      if (name === "ifscCode") {
        formattedValue = value.toUpperCase(); // Convert to uppercase
      }
  
      return { ...prevFormData, [name]: formattedValue };
    });
  };
  
  

  // Validate and Submit
  const validateAndSubmit = async () => {
    let newErrors: Errors = {};

    if (!formData.bankName.trim()) newErrors.bankName = "Bank Name is required";
    if (!formData.accountHolder.trim()) newErrors.accountHolder = "Account Holder Name is required";
    if (!/^[A-Z ]+$/.test(formData.accountHolder.trim())) {
      newErrors.accountHolder = "Account Holder Name should be in capital letters only";
    }

    if (!formData.accountNumber.trim()) {
      newErrors.accountNumber = "Account Number is required";
    } else if (formData.accountNumber.length < 12 || formData.accountNumber.length > 16) {
      newErrors.accountNumber = "Account Number must be 12-16 digits long";
    }

    if (!formData.reEnterAccountNumber.trim()) {
      newErrors.reEnterAccountNumber = "Re-enter Account Number is required";
    } else if (formData.reEnterAccountNumber !== formData.accountNumber) {
      newErrors.reEnterAccountNumber = "Account Numbers do not match";
    }

    if (!formData.ifscCode.trim()) {
      newErrors.ifscCode = "IFSC Code is required";
    } else {
      const ifscPattern = /^[A-Z]{4}0[A-Z0-9]{6}$/;
      if (!ifscPattern.test(formData.ifscCode)) {
        newErrors.ifscCode = "Invalid IFSC Code format";
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const bank_data = await verifyBankDetails(formData.accountNumber, formData.ifscCode);
        
        if (bank_data.success) {
          Alert.alert("Success", "Bank details verified successfully!");
          setShowOTPModal(true);
          setOtpModalData({
            mobile: mobileNumber,
            account_number: formData.accountNumber,
            ifsc: formData.ifscCode,
            account_holder: formData.accountHolder,
            bank_details: bank_data,
          });
        } else {
          const errorMessage = bank_data?.data?.remarks || "Bank verification failed.";
          Alert.alert("Error", errorMessage);
        }
      } catch (error) {
        Alert.alert("Error", "Failed to verify bank details.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      {/* Bank Details Modal */}
      <Modal isVisible={show} onBackdropPress={handleClose} style={{ margin: 0, justifyContent: "center", alignItems: "center" }}>
        <View style={{ width: "90%", backgroundColor: "white", padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Enter Bank Details</Text>
          <ScrollView style={{ maxHeight: 400 }}>
            {/* Bank Name */}
            <TextInput
              style={styles.input}
              placeholder="Enter Bank Name"
              value={formData.bankName}
              onChangeText={(value) => handleChange("bankName", value)}
            />
            {errors.bankName && <Text style={styles.errorText}>{errors.bankName}</Text>}

            {/* Account Holder Name */}
            <TextInput
              style={styles.input}
              placeholder="Enter Account Holder Name"
              value={formData.accountHolder}
              onChangeText={(value) => handleChange("accountHolder", value)}
            />
            {errors.accountHolder && <Text style={styles.errorText}>{errors.accountHolder}</Text>}

            {/* Account Number */}
            <TextInput
              style={styles.input}
              placeholder="Enter Account Number"
              keyboardType="numeric"
              value={formData.accountNumber}
              onChangeText={(value) => handleChange("accountNumber", value)}
            />
            {errors.accountNumber && <Text style={styles.errorText}>{errors.accountNumber}</Text>}

            {/* Re-enter Account Number */}
            <TextInput
              style={styles.input}
              placeholder="Re-enter Account Number"
              keyboardType="numeric"
              value={formData.reEnterAccountNumber}
              onChangeText={(value) => handleChange("reEnterAccountNumber", value)}
            />
            {errors.reEnterAccountNumber && <Text style={styles.errorText}>{errors.reEnterAccountNumber}</Text>}

            {/* IFSC Code */}
            <TextInput
              style={styles.input}
              placeholder="Enter IFSC Code"
              value={formData.ifscCode}
              onChangeText={(value) => handleChange("ifscCode", value)}
              autoCapitalize="characters"
            />
            {errors.ifscCode && <Text style={styles.errorText}>{errors.ifscCode}</Text>}
          </ScrollView>

          {/* Buttons */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 20 }}>
            <TouchableOpacity onPress={handleClose} style={[styles.button, { backgroundColor: "grey" }]}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={validateAndSubmit} style={styles.button} disabled={loading}>
              {loading ? <ActivityIndicator color="white" /> : <Text style={styles.buttonText}>Verify</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = {
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    flex: 1,
    backgroundColor: "green",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
};

export default BankVerifyModal;
