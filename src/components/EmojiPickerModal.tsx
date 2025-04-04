import React from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import EmojiSelector from "react-native-emoji-selector";

interface EmojiPickerModalProps {
  visible: boolean;
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

const screenHeight = Dimensions.get("window").height;

const EmojiPickerModal: React.FC<EmojiPickerModalProps> = ({
  visible,
  onSelect,
  onClose,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.bottomSheet}>
              <EmojiSelector
                onEmojiSelected={(emoji) => {
                  onSelect(emoji);
                  onClose();
                }}
                showSearchBar={true}
                showTabs={true}
                showHistory={true}
                columns={8}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default EmojiPickerModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // dimmed background
  },
  bottomSheet: {
    height: Dimensions.get("window").height * 0.5, // Half screen
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  },
});
