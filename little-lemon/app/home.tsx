import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("little_lemon.db");
const categories = ["Starters", "Mains", "Desserts", "Drinks"];

export default function Home() {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState("Starters");
  const [search, setSearch] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS menu (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          price REAL,
          description TEXT,
          image TEXT,
          category TEXT
        );`
      );
    });
  }, []);

  useEffect(() => {
    const loadUserData = async () => {
      const storedAvatar = await AsyncStorage.getItem("userAvatar");
      const storedFirstName = await AsyncStorage.getItem("userFirstName");
      const storedLastName = await AsyncStorage.getItem("userLastName");
      if (storedAvatar) setAvatar(storedAvatar);
      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
    };
    loadUserData();
  }, []);

  useEffect(() => {
    const loadMenu = () => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM menu;",
          [],
          (_, { rows }) => {
            if (rows.length > 0) {
              setMenu(rows._array);
              setLoading(false);
            } else {
              fetchAndStoreMenu();
            }
          },
          (_, error) => {
            setLoading(false);
            return false;
          }
        );
      });
    };

    const fetchAndStoreMenu = async () => {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json"
        );
        const data = await response.json();
        const menuItems = data.menu;
        db.transaction(
          (tx) => {
            menuItems.forEach((item) => {
              tx.executeSql(
                "INSERT INTO menu (name, price, description, image, category) VALUES (?, ?, ?, ?, ?);",
                [
                  item.name,
                  item.price,
                  item.description,
                  item.image,
                  item.category,
                ]
              );
            });
          },
          null,
          () => {
            // After insert, load from DB
            db.transaction((tx) => {
              tx.executeSql("SELECT * FROM menu;", [], (_, { rows }) => {
                setMenu(rows._array);
                setLoading(false);
              });
            });
          }
        );
      } catch (error) {
        setMenu([]);
        setLoading(false);
      }
    };

    setLoading(true);
    loadMenu();
  }, []);

  const getInitials = () => {
    const first = firstName ? firstName[0].toUpperCase() : "";
    const last = lastName ? lastName[0].toUpperCase() : "";
    return first + last;
  };

  const filteredMenu = menu.filter(
    (item) =>
      (selectedCategory === "" ||
        item.category === selectedCategory.toLowerCase()) &&
      item.name.toLowerCase().includes(search.toLowerCase())
  );

  const getImageUrl = (filename: string) =>
    `https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/images/${filename}`;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/images/little-lemon-logo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerTitle}>LITTLE LEMON</Text>
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          activeOpacity={0.7}
        >
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitials}>{getInitials()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoSection}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>Little Lemon</Text>
          <Text style={styles.city}>Chicago</Text>
          <Text style={styles.description}>
            We are a family owned Mediterranean restaurant, focused on
            traditional recipes served with a modern twist.
          </Text>
        </View>
        <Image
          source={require("../assets/images/little-lemon-logo.png")}
          style={styles.restaurantImage}
        />
      </View>

      {/* Search */}
      <View style={styles.searchSection}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.searchIcon}>
          <Text style={{ fontSize: 24 }}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <Text style={styles.orderTitle}>ORDER FOR DELIVERY!</Text>
      <View style={styles.categories}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonSelected,
            ]}
            onPress={() =>
              setSelectedCategory(selectedCategory === cat ? "" : cat)
            }
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === cat && styles.categoryTextSelected,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Menu List */}
      <View style={styles.menuList}>
        {loading ? (
          <ActivityIndicator size="large" color="#495E57" />
        ) : (
          filteredMenu.map((item) => (
            <View key={item.name} style={styles.menuItem}>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuItemTitle}>{item.name}</Text>
                <Text style={styles.menuItemDesc}>{item.description}</Text>
                <Text style={styles.menuItemPrice}>${item.price}</Text>
              </View>
              <Image
                source={{ uri: getImageUrl(item.image) }}
                style={styles.menuItemImage}
              />
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#fff", flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 24,
    paddingTop: 48,
    backgroundColor: "#fff",
  },
  logo: { width: 40, height: 40, resizeMode: "contain" },
  headerTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#495E57",
    flex: 1,
    textAlign: "center",
    marginLeft: -40, // visually center between logo and avatar
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#D3D7DF",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholder: {
    backgroundColor: "#D3D7DF",
  },
  avatarInitials: {
    fontSize: 18,
    color: "#495E57",
    fontWeight: "bold",
  },
  infoSection: {
    backgroundColor: "#495E57",
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 16,
  },
  title: { color: "#F4CE14", fontSize: 32, fontWeight: "bold" },
  city: { color: "#fff", fontSize: 28, fontWeight: "600" },
  description: { color: "#fff", fontSize: 16, marginTop: 8 },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginLeft: 16,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 24,
    marginTop: -28,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    padding: 8,
    color: "#495E57",
  },
  searchIcon: {
    padding: 8,
  },
  orderTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#495E57",
    marginTop: 24,
    marginLeft: 24,
    marginBottom: 8,
  },
  categories: {
    flexDirection: "row",
    marginHorizontal: 24,
    marginBottom: 16,
  },
  categoryButton: {
    backgroundColor: "#EDEFEE",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  categoryButtonSelected: {
    backgroundColor: "#495E57",
  },
  categoryText: {
    color: "#495E57",
    fontWeight: "bold",
    fontSize: 16,
  },
  categoryTextSelected: {
    color: "#fff",
  },
  menuList: {
    marginHorizontal: 24,
    marginBottom: 32,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: "#EDEFEE",
    borderBottomWidth: 1,
    paddingVertical: 16,
  },
  menuItemTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#495E57",
    marginBottom: 4,
  },
  menuItemDesc: {
    color: "#495E57",
    fontSize: 14,
    marginBottom: 4,
  },
  menuItemPrice: {
    color: "#495E57",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  menuItemImage: {
    width: 64,
    height: 64,
    borderRadius: 12,
    marginLeft: 12,
  },
});
