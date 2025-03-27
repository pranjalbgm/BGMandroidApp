import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  View, 
  StyleSheet 
} from 'react-native';

// import Spinner from 'react-native-spinkit';

// Types for robust type checking
interface PlayerData {
  block?: string;
  kyc?: string;
  isKycByAdmin?: string;
  isSuccess?: boolean;
  iskycPending?: string;
}

interface KycStatusButtonProps {
  playerData: PlayerData | null;
  onPress: () => void;
  onEditKyc?: () => void;
}

const KycStatusButton: React.FC<KycStatusButtonProps> = ({ 
  playerData, 
  onPress, 
  onEditKyc 
}) => {
  // Determine if button should be disabled
  const isButtonDisabled = (): boolean => {
    if (!playerData) return true;

    return (
      playerData.kyc === "yes" ||
      playerData.kyc === "pending" ||
      playerData.iskycPending === "yes" ||
      (playerData.isKycByAdmin === "no" && playerData.kyc === "yes")
    );
  };

  // Handle button press based on KYC status
  const handleButtonPress = () => {
    if (playerData?.iskycPending === "rejected" && onEditKyc) {
      onEditKyc();
    } else {
      onPress();
    }
  };

  // Render button content based on various KYC statuses
  const renderButtonContent = () => {
    if (!playerData) {
      return <Text style={styles.buttonText}>Incomplete KYC!</Text>;
    }

    // User Blocked
    if (playerData.block === "yes") {
      return (
        <View style={styles.contentContainer}>
          {/* <TfiClose color="white" size={16} /> */}
          <Text style={styles.buttonText}>User Blocked!</Text>
        </View>
      );
    }

    // KYC Verified
    if (playerData.kyc === "yes" && playerData.isKycByAdmin === "yes") {
      return (
        <View style={styles.contentContainer}>
          {/* <BsCheck2 color="white" size={16} /> */}
          <Text style={styles.buttonText}>KYC Verified!</Text>
        </View>
      );
    }

    // Loading State
    // if (playerData.isSuccess === false) {
    //   return (
    //     <Spinner 
    //       type="ThreeBounce" 
    //       color="white" 
    //       size={20} 
    //     />
    //   );
    // }

    // KYC Removed by Admin
    if (playerData.isKycByAdmin === "no" && playerData.kyc === "yes") {
      return (
        <Text style={styles.buttonText}>KYC Removed (Admin)</Text>
      );
    }

    // KYC Rejected
    if (playerData.iskycPending === "rejected") {
      return (
        <View style={styles.contentContainer}>
          {/* <TfiClose color="white" size={16} /> */}
          <View>
            <Text style={styles.buttonText}>KYC Rejected!</Text>
            <Text style={styles.resubmitText}>Re-Submit</Text>
          </View>
        </View>
      );
    }

    // KYC Pending
    if (playerData.iskycPending === "yes") {
      return (
        <View style={styles.contentContainer}>
          {/* <TfiClose color="white" size={16} /> */}
          <Text style={styles.buttonText}>KYC Pending!</Text>
        </View>
      );
    }

    // Incomplete KYC
    return <Text style={styles.buttonText}>Incomplete KYC!</Text>;
  };

  // Determine button color based on status
  const getButtonColor = () => {
    if (!playerData) return styles.incompleteButton;

    if (playerData.block === "yes") return styles.blockedButton;
    if (playerData.kyc === "yes" && playerData.isKycByAdmin === "yes") return styles.verifiedButton;
    if (playerData.iskycPending === "rejected") return styles.rejectedButton;
    if (playerData.iskycPending === "yes") return styles.pendingButton;

    return styles.incompleteButton;
  };

  return (
    <TouchableOpacity
      onPress={handleButtonPress}
      disabled={isButtonDisabled()}
      style={[
        styles.button, 
        getButtonColor(),
        isButtonDisabled() && styles.disabledButton
      ]}
    >
      {renderButtonContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  resubmitText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  blockedButton: {
    backgroundColor: 'red',
  },
  verifiedButton: {
    backgroundColor: 'green',
  },
  rejectedButton: {
    backgroundColor: 'orange',
  },
  pendingButton: {
    backgroundColor: 'gray',
  },
  incompleteButton: {
    backgroundColor: 'red',
  },
});

export default KycStatusButton;