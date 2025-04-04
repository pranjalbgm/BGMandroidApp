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
import RNPickerSelect from "react-native-picker-select";
import Toast from "react-native-simple-toast";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

const GamePostFormModal = ({
  gameSubmitChat,
  showModal,
  handleClose,
  onSubmit,
  playerData,
  markets,
}) => {
  const [formData, setFormData] = useState({
    market: "",
    anotherMarket: "",
    tricks: [""],
    single1: "",
    single2: "",
    spot1: "",
    spot2: "",
    fix1: "",
    fix2: "",
    postBy: "",
    dateFrom: "",
    dateTo: "",
  });

  
  const [showFromPicker, setShowFromPicker] = useState(false);
const [showToPicker, setShowToPicker] = useState(false);

  const handleNumberChange = (name, value) => {
    if (/^\d{0,2}$/.test(value)) {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTrickChange = (index, value) => {
    const allowedChars = /^[0-9+\-*/%()=:a-zA-Z]*$/;
    if (!allowedChars.test(value)) return;

    const lettersCount = value.replace(/[^a-zA-Z]/g, "").length;
    if (lettersCount > 4) return;

    const updatedTricks = [...formData.tricks];
    updatedTricks[index] = value;
    setFormData((prev) => ({ ...prev, tricks: updatedTricks }));
  };

  const addTrickRow = () => {
    setFormData((prev) => ({
      ...prev,
      tricks: [...prev.tricks, ""],
    }));
  };

  const removeTrickRow = (index) => {
    const updatedTricks = [...formData.tricks];
    updatedTricks.splice(index, 1);
    setFormData((prev) => ({ ...prev, tricks: updatedTricks }));
  };

  const getOpenMarketItems = () => {
    if (!markets || !Array.isArray(markets)) return [];
    return markets
      .filter((market) => market && market.market_status !== "Closed")
      .map((market) => ({ label: market.market, value: market.market }));
  };

  const getAllMarketItems = () => {
    if (!markets || !Array.isArray(markets)) return [];
    return markets
      .filter((market) => market)
      .map((market) => ({
        label: market.market,
        value: market.market,
      }));
  };


const handleFromDateChange = (event, selectedDate) => {
  setShowFromPicker(false);
  if (selectedDate) {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setFormData((prev) => ({ ...prev, dateFrom: formattedDate }));
  }
};

const handleToDateChange = (event, selectedDate) => {
  setShowToPicker(false);
  if (selectedDate) {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    setFormData((prev) => ({ ...prev, dateTo: formattedDate }));
  }
};


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.market) return Toast.show("Please select a market!", Toast.LONG);

    const newMessage = {
      mobile: playerData?.mobile,
      text: playerData?.name,
      message_by: "User",
      market: formData.market,
      tricksfrom: formData.anotherMarket,
      dateFrom: formData.dateFrom,
      dateTo: formData.dateTo,
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
    } else {
      Toast.show("You don't have permission to post, please contact Admin", Toast.LONG);
    }

    setFormData({
      market: "",
      single1: "",
      single2: "",
      spot1: "",
      spot2: "",
      fix1: "",
      fix2: "",
      postBy: playerData?.name || "",
      anotherMarket: "",
      dateFrom: "",
      dateTo: "",
      tricks: [""],
    });

    handleClose();
  };

  return (
    <Modal isVisible={showModal} onBackdropPress={handleClose} style={styles.modal}>
      <View style={styles.container}>
        <Text style={styles.title}>Game Posting Form</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Market</Text>
          <RNPickerSelect
            onValueChange={(value) => setFormData((prev) => ({ ...prev, market: value }))}
            items={getOpenMarketItems()}
            value={formData.market}
            placeholder={{ label: "Select Market", value: "" }}
            style={pickerStyles}
          />

          <Text style={styles.label}>Trick from</Text>
          <RNPickerSelect
            onValueChange={(value) => setFormData((prev) => ({ ...prev, anotherMarket: value }))}
            items={getAllMarketItems()}
            value={formData.anotherMarket}
            placeholder={{ label: "Select Market", value: "" }}
            style={pickerStyles}
          />

          {/* ✅ New Date Inputs */}
          <Text style={styles.label}>Date From</Text>
<TouchableOpacity
  style={styles.input}
  onPress={() => setShowFromPicker(true)}
>
  <Text style={{ color: formData.dateFrom ? "black" : "gray" }}>
    {formData.dateFrom || "Select Date"}
  </Text>
</TouchableOpacity>
{showFromPicker && (
  <DateTimePicker
    value={formData.dateFrom ? new Date(formData.dateFrom) : new Date()}
    mode="date"
    display="default"
    onChange={handleFromDateChange}
  />
)}

<Text style={styles.label}>Date To</Text>
<TouchableOpacity
  style={styles.input}
  onPress={() => setShowToPicker(true)}
>
  <Text style={{ color: formData.dateTo ? "black" : "gray" }}>
    {formData.dateTo || "Select Date"}
  </Text>
</TouchableOpacity>
{showToPicker && (
  <DateTimePicker
    value={formData.dateTo ? new Date(formData.dateTo) : new Date()}
    mode="date"
    display="default"
    onChange={handleToDateChange}
  />
)}


          <Text style={styles.label}>Your Trick</Text>
          {formData.tricks.map((trick, index) => (
            <View key={index} style={styles.trickRow}>
              <TextInput
                style={styles.inputTrick}
                placeholder="Enter Trick"
                value={trick}
                onChangeText={(value) => handleTrickChange(index, value)}
              />
              {index === 0 ? (
                <TouchableOpacity style={styles.addButton} onPress={addTrickRow}>
                  <Text style={styles.addText}>+</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.deleteButton} onPress={() => removeTrickRow(index)}>
                  <Text style={styles.deleteText}>-</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {["single", "spot", "fix"].map((label, index) => (
            <View key={index}>
              <Text style={styles.label}>{label.toUpperCase()}</Text>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="00"
                  maxLength={2}
                  value={formData[`${label}1`]}
                  onChangeText={(value) => handleNumberChange(`${label}1`, value)}
                />
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="00"
                  maxLength={2}
                  value={formData[`${label}2`]}
                  onChangeText={(value) => handleNumberChange(`${label}2`, value)}
                />
              </View>
            </View>
          ))}

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
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "90%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "black",
  },
  label: {
    color: "black",
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    backgroundColor: "lightgrey",
    color: "black",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  inputTrick: {
    backgroundColor: "lightgrey",
    color: "black",
    padding: 10,
    borderRadius: 5,
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  trickRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  addText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
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
    backgroundColor: "green",
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
  inputIOS: { color: "black", padding: 10, backgroundColor: "lightgrey" },
  inputAndroid: { color: "black", padding: 10, backgroundColor: "lightgrey" },
};

export default GamePostFormModal;
