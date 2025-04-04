import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Modal,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { fetchMobile } from "../../hooks/useWallet";
import { usePlayerDataFetch } from "../../hooks/useHome";
import { useBankVerification } from "../../hooks/useBankVerification";
import { NodeapiClient } from "../../constants/api-client";


interface OTPModalProps {
  visible: boolean;
  onClose: () => void;
  onVerifySuccess: () => void;
  formData: {
    bankName: string;
    accountNumber: string;
    reEnterAccountNumber: string;
    ifscCode: string;
    accountHolder: string;
  };
  setFormData: (data: any) => void;
  verifyAccountData: any;
  refetchPlayer: () => void;
}

const OTPModal: React.FC<OTPModalProps> = ({
  visible,
  onClose,
  onVerifySuccess,
  formData,
  setFormData,
  verifyAccountData,
  refetchPlayer,
}) => {
const [mobileNumber, setMobileNumber] = useState<string | null>(null);
const { data: playerInfo } = usePlayerDataFetch(mobileNumber) as {
    data?: any;
  };
  const {refetch} = usePlayerDataFetch(mobileNumber);

    useEffect(() => {
       const initializeMobile = async () => {
         const fetchedMobile = await fetchMobile(setMobileNumber);
         if (fetchedMobile && mobileNumber) {
           // playerInfo.mutate({ mobile: fetchedMobile });
           refetch
         }
       };
       initializeMobile();
     }, []);
   
 

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { verifyBank, isLoading, isError, isSuccess } = useBankVerification();

  useEffect(() => {
    if (playerInfo?.mobile) {
      setOtpSent(false);
    }
  }, [playerInfo]);

  const resetForm = () => {
    setFormData({
      bankName: "",
      accountNumber: "",
      reEnterAccountNumber: "",
      ifscCode: "",
      accountHolder: "",
    });
  };

  const handleSendOtp = async () => {
    if (/^[1-9]\d{9}$/.test(mobileNumber)) {
      setLoading(true);
      try {
        const response = await NodeapiClient.post("/send-otp-withdrawl", {
          mobile: mobileNumber,
        });
        if (response.data.success) {
          setOtpSent(true);
          setAlertMessage("OTP sent successfully!");
        } else {
          setAlertMessage(response.data.message);
        }
      } catch (error) {
        setAlertMessage("Error sending OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setAlertMessage("Invalid mobile number. Please try again.");
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length === 6) {
      setLoading(true);
      try {
        const response = await NodeapiClient.post("/verify-otp-withdrawl", {
          mobile: mobileNumber,
          otp,
        });
        console.log("otp modal resposne ----------------->>",response)
        if (response.data.success) {
            console.log("otp modal player info ----------------->>",playerInfo)
          if (playerInfo?.block === "yes") {
            setAlertMessage("You are blocked. Please contact support.");
            return;
          }

          if (!formData || !formData.accountNumber) {
            setAlertMessage("Bank details are incomplete. Please fill all fields.");
            return;
          }

          try {
            const payload = {
              bank: verifyAccountData?.bank_details?.data?.ifsc_details?.bank,
              account_holder: verifyAccountData?.data?.full_name
                ? verifyAccountData?.data?.full_name
                : verifyAccountData.account_holder,
              account_number: formData.accountNumber,
              ifsc: formData.ifscCode,
              bank_details: verifyAccountData?.bank_details,
            };

            const verifyBankDone = verifyBank(payload);
            console.log("--------------<<<<<<>>>>>>>>>>>>",verifyBankDone)
            onClose();
            resetForm();
            refetchPlayer();
            onVerifySuccess();
            setAlertMessage("Bank details changed successfully!");
          } catch (error) {
            console.log("error ------------",error)
            setAlertMessage(`Error submitting details: ${error?.response?.data?.message}`);
          }
        } else {
          setAlertMessage("Invalid OTP. Please try again.");
        }
      } catch (error) {
        setAlertMessage("Error verifying OTP. Please try again.");
      } finally {
        setLoading(false);
      }
    } else {
      setAlertMessage("Please enter a valid OTP.");
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        <View style={styles.modalView}>
          <Text style={styles.title}>Verify Mobile Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your mobile number"
            value={mobileNumber}
            editable={false}
          />

          {otpSent && (
            <TextInput
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChangeText={setOtp}
              keyboardType="numeric"
              maxLength={6}
            />
          )}

          {alertMessage ? (
            <Text
              style={[
                styles.alert,
                alertMessage.includes("successfully") ? styles.success : styles.error,
              ]}
            >
              {alertMessage}
            </Text>
          ) : null}

          {!otpSent ? (
            <TouchableOpacity onPress={handleSendOtp}><Text>{loading ? "Sending OTP..." : "Send OTP"} </Text> </TouchableOpacity> 
          ) : (
            // <Button title={loading ? "Verifying OTP..." : "Verify OTP"} onPress={handleVerifyOtp} />
            <TouchableOpacity onPress={handleVerifyOtp} ><Text>{loading ?"Verifying OTP..." : "Verify OTP"} </Text></TouchableOpacity>
          )}

          <Button title="Close" onPress={onClose} />
        </View>
      </View>

      {loading && <ActivityIndicator size="large" color="blue" style={styles.loader} />}
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  alert: {
    marginVertical: 10,
    textAlign: "center",
  },
  success: {
    color: "green",
  },
  error: {
    color: "red",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
  },
});

export default OTPModal;
