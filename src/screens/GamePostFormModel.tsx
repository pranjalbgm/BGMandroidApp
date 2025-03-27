import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Modal from "react-native-modal";
import Toast from 'react-native-simple-toast';
import RNPickerSelect from "react-native-picker-select";

const GamePostFormModal = ({
  showModal,
  handleClose,
  onSubmit,
  playerData,
  gameSubmitChat,
  markets,
}) => {
  const [formData, setFormData] = useState({
    market: "",
    anotherMarket: "",
    tricks: "",
    single1: "",
    single2: "",
    spot1: "",
    spot2: "",
    fix1: "",
    fix2: "",
    postBy: "",
  });

  const handleChange = (name, value) => {
    if (
      ["single1", "single2", "spot1", "spot2", "fix1", "fix2"].includes(name) &&
      value.length > 2
    ) {
      return; // Restrict input length to 2 digits
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!formData.market || !formData.tricks) {
      return Toast.show({
        type: "error",
        text1: "Error",
        text2: "Market and Trick fields are required!",
      });
    }

    const newMessage = {
      mobile: playerData?.mobile,
      text: formData.tricks,
      message_by: "User",
      market: formData.market,
      tricksfrom: formData.anotherMarket,
      tricks: formData.tricks,
      name: playerData?.name,
      created_at: new Date().toISOString(),
      reactions: {},
      singlevalue1: formData.single1,
      singlevalue2: formData.single2,
      spotvalue1: formData.spot1,
      spotvalue2: formData.spot2,
      fixvalue1: formData.fix1,
      fixvalue2: formData.fix2,
    };

    if (playerData?.game_host === "yes" && playerData?.block === "no") {
      gameSubmitChat(newMessage);
    } else if (playerData?.block === "yes") {
      Toast.show({
        type: "error",
        text1: "Blocked",
        text2: "You are blocked, please contact Admin.",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "You don't have permission to post.",
      });
    }

    setFormData({
      market: "",
      anotherMarket: "",
      tricks: "",
      single1: "",
      single2: "",
      spot1: "",
      spot2: "",
      fix1: "",
      fix2: "",
      postBy: "",
    });

    handleClose();
  };

  return (
    <Modal isVisible={showModal} onBackdropPress={handleClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Game Posting Form</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Market Picker */}
          <Text style={styles.label}>Market</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange("market", value)}
            items={markets
              ?.filter((market) => market.market_status !== "Closed")
              .map((market) => ({ label: market.market, value: market.market }))}
            value={formData.market}
            placeholder={{ label: "Select Market", value: "" }}
            style={pickerStyles}
          />

          {/* Trick From Picker */}
          <Text style={styles.label}>Trick from</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange("anotherMarket", value)}
            items={markets?.map((market) => ({
              label: market.market,
              value: market.market,
            }))}
            value={formData.anotherMarket}
            placeholder={{ label: "Select Market", value: "" }}
            style={pickerStyles}
          />

          {/* Tricks Input */}
          <Text style={styles.label}>Your Trick</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Trick"
            value={formData.tricks}
            onChangeText={(value) => handleChange("tricks", value)}
          />

          {/* Number Inputs */}
          {["SINGLE", "SPOT", "FIX"].map((label, index) => (
            <View key={index}>
              <Text style={styles.label}>{label}</Text>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="00"
                  maxLength={2}
                  value={formData[`${label.toLowerCase()}1`]}
                  onChangeText={(value) =>
                    handleChange(`${label.toLowerCase()}1`, value)
                  }
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="00"
                  maxLength={2}
                  value={formData[`${label.toLowerCase()}2`]}
                  onChangeText={(value) =>
                    handleChange(`${label.toLowerCase()}2`, value)
                  }
                />
              </View>
            </View>
          ))}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#222",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#fff",
  },
  label: {
    color: "#fff",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "#333",
    color: "#fff",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  cancelButton: {
    backgroundColor: "#666",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginRight: 5,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});

const pickerStyles = {
  inputIOS: { color: "white", padding: 10, backgroundColor: "#333" },
  inputAndroid: { color: "white", padding: 10, backgroundColor: "#333" },
};

export default GamePostFormModal;
