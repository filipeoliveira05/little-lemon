import * as React from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");

  const handleNext = async () => {
    await AsyncStorage.setItem("userFirstName", firstName);
    await AsyncStorage.setItem("userEmail", email);
    onComplete();
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Image
            source={require("../assets/images/little-lemon-logo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>LITTLE LEMON</Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={styles.title}>Let us get to know you</Text>
        <Text style={styles.label}>First name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
        />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} />
      </View>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#F4F5F7",
    justifyContent: "flex-start",
  },
  header: {
    backgroundColor: "#D3D7DF",
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 8,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 2,
    color: "#495E57",
  },
  container: {
    flex: 1,
    backgroundColor: "#D3D7DF",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 24,
    color: "#495E57",
    textAlign: "center",
  },
  label: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 8,
    color: "#495E57",
    alignSelf: "flex-start",
  },
  input: {
    width: "100%",
    height: 48,
    borderColor: "#495E57",
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    fontSize: 16,
  },
  footer: {
    backgroundColor: "#F4F5F7",
    padding: 24,
    alignItems: "flex-end",
  },
  button: {
    backgroundColor: "#D3D7DF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    opacity: 0.7,
  },
  buttonText: {
    color: "#495E57",
    fontSize: 18,
    fontWeight: "bold",
  },
});
