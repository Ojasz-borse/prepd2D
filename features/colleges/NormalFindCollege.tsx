import GovernmentCollegeIcon from "@/assets/icons/GovernmentCollegeIcon";
import PrivateCollegeIcon from "@/assets/icons/PrivateCollegeIcon";
import SearchIcon from "@/assets/icons/SearchIcon";
import { GET_COLLEGES } from "@/constants/config";
import { useAuth } from "@/context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type RootStackParamList = {
  NormalFindCollege: undefined;
  CollegeDetails: {
    id: string;
    name: string;
    code: string;
    type: "Govt" | "Pvt";
    district: string;
  };
};

type CollegeNavProp = NativeStackNavigationProp<
  RootStackParamList,
  "NormalFindCollege"
>;

interface College {
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  status: string;
}

const NormalFindCollege = () => {
  const [searchText, setSearchText] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation<CollegeNavProp>();
  const { getToken } = useAuth();

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const token = await getToken();

      const res = await fetch(GET_COLLEGES, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success && data.colleges) {
        setColleges(data.colleges);
      } else {
        throw new Error("Failed to fetch colleges");
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchColleges();
  }, []);

  const filteredData = colleges.filter((item) => {
    const search = searchText.toLowerCase();

    const collegeType = item.is_government ? "Govt" : "Pvt";
    const typeMatch =
      (collegeType.toLowerCase() === "govt" &&
        "government".startsWith(search)) ||
      (collegeType.toLowerCase() === "pvt" && "private".startsWith(search)) ||
      collegeType.toLowerCase().includes(search);

    const matchesSearch =
      item.name.toLowerCase().includes(search) ||
      item.college_code.toLowerCase().includes(search) ||
      typeMatch;

    const matchesDistrict =
      selectedDistrict === "" || item.district === selectedDistrict;
    const matchesType =
      selectedType === "" ||
      (selectedType.toLowerCase() === "govt" && item.is_government) ||
      (selectedType.toLowerCase() === "pvt" && !item.is_government);

    return matchesSearch && matchesDistrict && matchesType;
  });

  // unique district list
  const districts = [...new Set(colleges.map((item) => item.district))];

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#063866" />
        <Text style={styles.loadingText}>Loading colleges...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Pressable style={styles.retryButton} onPress={fetchColleges}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.searchContainer}>
        <SearchIcon size={18} focused={false} />
        <TextInput
          style={styles.searchBar}
          placeholder="Search by name, code, or type"
          placeholderTextColor="#777"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <View style={styles.filterRow}>
        <View style={[styles.pickerWrapper, { flex: 0.7 }]}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Districts", value: "" },
              ...districts.map((d) => ({ label: d, value: d })),
            ]}
            labelField="label"
            valueField="value"
            placeholder="Districts"
            value={selectedDistrict}
            onChange={(item) => setSelectedDistrict(item.value)}
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
          />
        </View>

        <View style={{ marginHorizontal: 5 }} />

        <View style={[styles.pickerWrapper, { flex: 0.3 }]}>
          <Dropdown
            style={styles.dropdown}
            data={[
              { label: "Types", value: "" },
              { label: "Govt", value: "Govt" },
              { label: "Pvt", value: "Pvt" },
            ]}
            labelField="label"
            valueField="value"
            placeholder="Types"
            value={selectedType}
            onChange={(item) => setSelectedType(item.value)}
            placeholderStyle={styles.dropdownText}
            selectedTextStyle={styles.dropdownText}
            itemTextStyle={styles.dropdownText}
          />
        </View>
      </View>

      <Text style={styles.resultCount}>
        Total Results: {filteredData.length}
      </Text>

      {filteredData.map((item) => (
        <Pressable
          key={item.college_code}
          style={({ pressed }) => [
            styles.card3D,
            pressed && styles.cardPressed,
          ]}
          android_ripple={{ color: "rgba(4, 36, 84, 0.06)", borderless: false }}
          onPress={() =>
            router.push({
              pathname: "../college-details",
              params: {
                id: item.college_code,
                name: item.name,
                code: item.college_code,
                type: item.is_government ? "Govt" : "Pvt",
                district: item.district,
              },
            })
          }
        >
          <View style={styles.subRow}>
            {item.is_autonomous}
            <Text style={styles.subText}>{item.college_code}</Text>
            <View style={styles.typeRow}>
              {item.is_autonomous ? (
                <GovernmentCollegeIcon size={16} />
              ) : (
                <PrivateCollegeIcon size={16} />
              )}
              <Text style={styles.subText}>
                {item.is_government ? "Govt" : "Pvt"}
              </Text>
            </View>
          </View>

          <Text style={styles.collegeName}>{item.name}</Text>
          {/* <Text style={styles.districtText}>{item.district}</Text> */}
          <Text style={styles.statusText}>Status: {item.status}</Text>
        </Pressable>
      ))}

      {filteredData.length === 0 && !loading && (
        <Text style={styles.noResult}>No colleges found</Text>
      )}
    </ScrollView>
  );
};

export default NormalFindCollege;

const styles = StyleSheet.create({
  container: {
    padding: 4,
    paddingTop: 16,
    paddingBottom: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: "BreeSerif",
    color: "#063866",
  },
  errorText: {
    fontSize: 16,
    fontFamily: "BreeSerif",
    color: "#ff3b30",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#063866",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontFamily: "BreeSerif",
    fontSize: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebf0fa",
    borderRadius: 20,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchBar: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
    fontFamily: "BreeSerif",
    marginLeft: 8,
  },
  filterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  pickerWrapper: {
    marginHorizontal: 0,
  },
  dropdown: {
    height: 45,
    borderRadius: 20,
    paddingHorizontal: 16,
    backgroundColor: "#ebf0fa",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "BreeSerif",
    color: "#333",
    textTransform: "capitalize",
  },
  resultCount: {
    fontSize: 14,
    fontFamily: "BreeSerif",
    color: "#444",
    marginBottom: 8,
    marginLeft: 4,
    marginTop: 10,
  },
  card3D: {
    width: "100%",
    backgroundColor: "#f0f4fb",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  cardPressed: {
    transform: [{ translateY: Platform.OS === "ios" ? 1 : 0 }],
    shadowOpacity: 0.08,
    elevation: 2,
  },
  collegeName: {
    fontSize: 16,
    color: "#000",
    fontFamily: "BreeSerif",
    marginTop: 6,
  },
  districtText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BreeSerif",
    marginTop: 2,
  },
  statusText: {
    fontSize: 12,
    color: "#888",
    fontFamily: "BreeSerif",
    marginTop: 2,
  },
  subRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    width: 50,
    gap: 4,
  },
  subText: {
    fontSize: 14,
    color: "#063866",
    fontFamily: "BreeSerif",
  },
  noResult: {
    fontSize: 16,
    color: "#777",
    fontFamily: "BreeSerif",
    textAlign: "center",
    marginTop: 20,
  },
});
