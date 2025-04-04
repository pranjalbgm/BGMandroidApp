import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image, ActivityIndicator, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // For Back Icon
import useTipsAndTricks from "../hooks/useTipsAndTricks";
import HeaderThree from "../components/HeaderThree";

const TipsAndTricks: React.FC = () => {
  const { tipsAndTricks, isLoading, isError, updateCount } = useTipsAndTricks();
  const navigation = useNavigation();
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  console.log("----------------------------------------",tipsAndTricks)

  const handleVote = (tipId: string, optionTitle: string) => {
    if (selectedOptions[tipId]) return; // Prevent multiple votes

    setSelectedOptions((prevState) => ({
      ...prevState,
      [tipId]: optionTitle,
    }));

    updateCount({ pk: tipId, optionTitle });
  };

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load data</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
     <HeaderThree title={'Tips And Tricks'} />

      {/* Title */}
      <Text style={styles.title}>Daily Tips and Tricks</Text>

      {/* List of Tips */}
      <FlatList
        data={tipsAndTricks?.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const totalVotes = item.option.reduce((sum, opt) => sum + opt.mobile.length, 0);

          return (
            <View style={styles.tipCard}>
              <Text style={styles.tipTitle}>{item.heading}</Text>
              <Text style={styles.tipMessage}>{item.message}</Text>
              {item.question && <Text style={styles.question}>{item.question}</Text>}
              {item.file && <Image source={{ uri: item.file }} style={styles.tipImage} />}
              <Text style={styles.dateText}>{new Date(item.created_at).toLocaleString()}</Text>

              {/* Voting Options */}
              {item.option.length > 0 && (
                <View style={styles.optionContainer}>
                  {item.option.map((opt, index) => {
                    const voteCount = opt.mobile.length;
                    const percentage = totalVotes ? Math.round((voteCount / totalVotes) * 100) : 0;
                    const isSelected = selectedOptions[item.id] === opt.title;

                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handleVote(item.id, opt.title)}
                        disabled={isSelected}
                        style={[styles.option, isSelected && styles.selectedOption]}
                      >
                        <View style={[styles.progressBar, { width: `${percentage}%` }]} />
                        <Text style={[styles.optionText, isSelected && styles.selectedText]}>
                          {opt.title} ({percentage}%)
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#E8F5E9", // Light Green Background
    // paddingHorizontal: 16,
    // paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    color: "#2E7D32",
    fontSize: 16,
    marginLeft: 5,
    fontWeight: "bold",
  },
  logo: {
    width: 55,
    height: 55,
    resizeMode: "contain",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1B5E20",
    textAlign: "center",
    marginBottom: 10,
    marginTop:20,
  },
  tipCard: {
    backgroundColor: "#C8E6C9",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  tipTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 5,
  },
  tipMessage: {
    fontSize: 16,
    color: "#2E7D32",
    marginBottom: 10,
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1B5E20",
    marginBottom: 10,
  },
  tipImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 12,
    color: "#388E3C",
    marginBottom: 10,
  },
  optionContainer: {
    marginTop: 10,
  },
  option: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 8,
    textAlign: "center",
    overflow: "hidden",
    alignItems: "center",
    position: "relative",
  },
  selectedOption: {
    backgroundColor: "#2E7D32",
  },
  progressBar: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    backgroundColor: "#A5D6A7",
    borderRadius: 20,
  },
  optionText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#333",
    zIndex: 2,
  },
  selectedText: {
    color: "#FFF",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
  },
  loadingText: {
    fontSize: 18,
    color: "#2E7D32",
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
});

export default TipsAndTricks;
