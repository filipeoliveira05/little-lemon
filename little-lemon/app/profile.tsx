import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
} from "react-native";
import { MaskedTextInput } from "react-native-mask-text";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

export default function Profile({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [orderStatuses, setOrderStatuses] = useState(true);
  const [passwordChanges, setPasswordChanges] = useState(true);
  const [specialOffers, setSpecialOffers] = useState(true);
  const [newsletter, setNewsletter] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      const storedFirstName = await AsyncStorage.getItem("userFirstName");
      const storedLastName = await AsyncStorage.getItem("userLastName");
      const storedEmail = await AsyncStorage.getItem("userEmail");
      const storedPhone = await AsyncStorage.getItem("userPhone");
      const storedAvatar = await AsyncStorage.getItem("userAvatar");
      const storedOrderStatuses = await AsyncStorage.getItem(
        "userOrderStatuses"
      );
      const storedPasswordChanges = await AsyncStorage.getItem(
        "userPasswordChanges"
      );
      const storedSpecialOffers = await AsyncStorage.getItem(
        "userSpecialOffers"
      );
      const storedNewsletter = await AsyncStorage.getItem("userNewsletter");

      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
      if (storedEmail) setEmail(storedEmail);
      if (storedPhone) setPhone(storedPhone);
      if (storedAvatar) setAvatar(storedAvatar);
      if (storedOrderStatuses !== null)
        setOrderStatuses(JSON.parse(storedOrderStatuses));
      if (storedPasswordChanges !== null)
        setPasswordChanges(JSON.parse(storedPasswordChanges));
      if (storedSpecialOffers !== null)
        setSpecialOffers(JSON.parse(storedSpecialOffers));
      if (storedNewsletter !== null)
        setNewsletter(JSON.parse(storedNewsletter));
    };
    loadUserData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
      await AsyncStorage.setItem("userAvatar", result.assets[0].uri);
    }
  };

  const removeAvatar = async () => {
    setAvatar(null);
    await AsyncStorage.removeItem("userAvatar");
  };

  const getInitials = () => {
    const first = firstName ? firstName[0].toUpperCase() : "";
    const last = lastName ? lastName[0].toUpperCase() : "";
    return first + last;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push("/home")}
          activeOpacity={0.7}
        >
          <Text style={styles.backButtonText}>{"<"}</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image
            source={require("../assets/images/little-lemon-logo.png")}
            style={styles.logo}
          />
          <Text style={styles.headerTitle}>LITTLE LEMON</Text>
        </View>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitials}>{getInitials()}</Text>
          </View>
        )}
      </View>

      {/* Personal Info */}
      <Text style={styles.sectionTitle}>Personal information</Text>
      <Text style={styles.label}>Avatar</Text>
      <View style={styles.avatarRow}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitials}>{getInitials()}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.changeButton} onPress={pickImage}>
          <Text style={styles.changeButtonText}>Change</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.removeButton} onPress={removeAvatar}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>First name</Text>
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
      />

      <Text style={styles.label}>Last name</Text>
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <Text style={styles.label}>Phone number</Text>
      <MaskedTextInput
        style={styles.input}
        mask="(999) 999-9999"
        keyboardType="number-pad"
        value={phone}
        onChangeText={(text, rawText) => {
          if (rawText.length <= 10) setPhone(rawText);
        }}
        placeholder="(123) 456-7890"
        placeholderTextColor="#A0A0A0"
      />

      {/* Email Notifications */}
      <Text style={styles.sectionTitle}>Email notifications</Text>
      <View style={styles.switchRow}>
        <Switch value={orderStatuses} onValueChange={setOrderStatuses} />
        <Text style={styles.switchLabel}>Order statuses</Text>
      </View>
      <View style={styles.switchRow}>
        <Switch value={passwordChanges} onValueChange={setPasswordChanges} />
        <Text style={styles.switchLabel}>Password changes</Text>
      </View>
      <View style={styles.switchRow}>
        <Switch value={specialOffers} onValueChange={setSpecialOffers} />
        <Text style={styles.switchLabel}>Special offers</Text>
      </View>
      <View style={styles.switchRow}>
        <Switch value={newsletter} onValueChange={setNewsletter} />
        <Text style={styles.switchLabel}>Newsletter</Text>
      </View>

      {/* Log out button */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={async () => {
          await AsyncStorage.clear();
          if (onLogout) onLogout();
          router.replace("/");
        }}
      >
        <Text style={styles.logoutButtonText}>Log out</Text>
      </TouchableOpacity>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.discardButton}>
          <Text style={styles.discardButtonText}>Discard changes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={async () => {
            await AsyncStorage.setItem("userAvatar", avatar ?? "");
            await AsyncStorage.setItem("userFirstName", firstName);
            await AsyncStorage.setItem("userLastName", lastName);
            await AsyncStorage.setItem("userEmail", email);
            await AsyncStorage.setItem("userPhone", phone);
            await AsyncStorage.setItem(
              "userOrderStatuses",
              JSON.stringify(orderStatuses)
            );
            await AsyncStorage.setItem(
              "userPasswordChanges",
              JSON.stringify(passwordChanges)
            );
            await AsyncStorage.setItem(
              "userSpecialOffers",
              JSON.stringify(specialOffers)
            );
            await AsyncStorage.setItem(
              "userNewsletter",
              JSON.stringify(newsletter)
            );
          }}
        >
          <Text style={styles.saveButtonText}>Save changes</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#fff",
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    gap: 8,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    marginRight: 8,
  },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 20,
    letterSpacing: 2,
    color: "#495E57",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
    backgroundColor: "#D3D7DF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholder: {
    backgroundColor: "#D3D7DF",
  },
  avatarInitials: {
    fontSize: 24,
    color: "#495E57",
    fontWeight: "bold",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#495E57",
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#495E57",
    marginTop: 16,
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#495E57",
    marginTop: 16,
    marginBottom: 4,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  changeButton: {
    backgroundColor: "#495E57",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  changeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  removeButton: {
    borderColor: "#495E57",
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  removeButtonText: {
    color: "#495E57",
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#D3D7DF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F4F5F7",
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  switchLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: "#495E57",
  },
  logoutButton: {
    backgroundColor: "#FFD700",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 24,
  },
  logoutButtonText: {
    color: "#495E57",
    fontWeight: "bold",
    fontSize: 18,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  discardButton: {
    borderColor: "#D3D7DF",
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  discardButtonText: {
    color: "#495E57",
    fontWeight: "bold",
  },
  saveButton: {
    backgroundColor: "#495E57",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
