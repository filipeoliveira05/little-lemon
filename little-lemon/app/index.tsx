import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Onboarding from "./onboarding";
import Profile from "./profile";
import SplashScreen from "./SplashScreen";
import Home from "./home";

export default function Index() {
  const [isOnboarded, setIsOnboarded] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    AsyncStorage.getItem("isOnboarded").then((value) => {
      setIsOnboarded(value === "true");
    });
  }, []);

  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem("isOnboarded", "true");
    setIsOnboarded(true);
  };

  if (isOnboarded === null) {
    return <SplashScreen />;
  }

  return isOnboarded ? (
    <Home />
  ) : (
    <Onboarding onComplete={handleOnboardingComplete} />
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
  },
});
