import { View, Text, StyleSheet, Image } from "react-native";

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/little-lemon-logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.text}>Little Lemon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D3D7DF",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#495E57",
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
});
