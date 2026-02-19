import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Picker } from "@react-native-picker/picker";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LOCATIONS, BRANCHES, CATEGORIES } from "@/constants/collegeFilters";
import { useCreateCollegeList } from "@/hooks/useCreateCollegeList";
import { formatLocationName, formatBranchName } from "@/utils/formatHelpers";

const { width } = Dimensions.get("window");

export default function CreateCollegeList() {
  const { getToken } = useAuth();
  const { generateList, loading } = useCreateCollegeList();

  const [rank, setRank] = useState("");
  const [percentile, setPercentile] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);

  const moveBranch = (index: number, direction: "up" | "down") => {
    const updated = [...branches];
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= updated.length) return;

    [updated[index], updated[swapIndex]] = [
      updated[swapIndex],
      updated[index],
    ];

    setBranches(updated);
  };

  const handlePercentileChange = (value: string) => {
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue > 100) {
        setPercentile("100");
      } else {
        setPercentile(value);
      }
    }
  };

  const handlePercentileBlur = () => {
    if (percentile) {
      const numValue = parseFloat(percentile);
      if (!isNaN(numValue)) {
        const clampedValue = Math.min(Math.max(numValue, 0), 100);
        const formattedValue = Number.isInteger(clampedValue) 
          ? clampedValue.toString() 
          : clampedValue.toFixed(2);
        setPercentile(formattedValue);
      }
    }
  };

  const handleSubmit = async () => {
    if (
      !rank ||
      !percentile ||
      categories.length === 0 ||
      locations.length === 0 ||
      branches.length === 0
    ) {
      alert("Please fill all fields");
      return;
    }

    const percentileNum = parseFloat(percentile);
    if (isNaN(percentileNum) || percentileNum < 0 || percentileNum > 100) {
      alert("Please enter a valid percentile between 0 and 100");
      return;
    }

    const token = await getToken();
    const data = await generateList({
      rank: Number(rank),
      percentile: percentileNum,
      category: categories[0],
      locations,
      branches,
      token,
    });

    if (data) {
      setResults(data);
      setShowResults(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {!showResults ? (
            <CreateCollegeForm
              rank={rank}
              setRank={setRank}
              percentile={percentile}
              setPercentile={setPercentile}
              categories={categories}
              setCategories={setCategories}
              locations={locations}
              setLocations={setLocations}
              branches={branches}
              setBranches={setBranches}
              handlePercentileChange={handlePercentileChange}
              handlePercentileBlur={handlePercentileBlur}
              moveBranch={moveBranch}
              handleSubmit={handleSubmit}
              loading={loading}
            />
          ) : (
            <>
              <EditButton onPress={() => setShowResults(false)} />
              <ResultsList results={results} />
            </>
          )}

          {loading && !showResults && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>Generating your options...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// Form Component
const CreateCollegeForm = ({
  rank,
  setRank,
  percentile,
  setPercentile,
  categories,
  setCategories,
  locations,
  setLocations,
  branches,
  setBranches,
  handlePercentileChange,
  handlePercentileBlur,
  moveBranch,
  handleSubmit,
  loading,
}: any) => (
  <LinearGradient 
    colors={["#ffffff", "#f8faff"]} 
    style={styles.card}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
  >
    <View style={styles.cardHeader}>
      <MaterialCommunityIcons name="form-dropdown" size={24} color={colors.primary} />
      <Text style={styles.heading}>Generate Option Form</Text>
    </View>

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>Rank</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="trophy-outline" size={20} color="#99b3e6" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your rank"
          placeholderTextColor="#999"
          value={rank}
          onChangeText={setRank}
          keyboardType="numeric"
        />
      </View>
    </View>

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>Percentile</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="stats-chart-outline" size={20} color="#99b3e6" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter your percentile (0-100)"
          placeholderTextColor="#999"
          value={percentile}
          onChangeText={handlePercentileChange}
          onBlur={handlePercentileBlur}
          keyboardType="decimal-pad"
        />
      </View>
      {percentile && parseFloat(percentile) > 100 && (
        <Text style={styles.warningText}>Percentile cannot exceed 100</Text>
      )}
    </View>

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>Select Category</Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue={categories[0] || ""}
          onValueChange={(value) => setCategories(value ? [value] : [])}
          style={styles.picker}
          dropdownIconColor={colors.primary}
        >
          <Picker.Item label="Select Category" value="" color="#999" />
          {CATEGORIES.map((cat) => (
            <Picker.Item key={cat} label={cat} value={cat} color="#333" />
          ))}
        </Picker>
      </View>
    </View>

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>Add Location</Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue=""
          onValueChange={(value) => {
            if (!value) return;
            if (!locations.includes(value)) {
              setLocations([...locations, value]);
            }
          }}
          style={styles.picker}
          dropdownIconColor={colors.primary}
        >
          <Picker.Item label="Select Location" value="" color="#999" />
          {LOCATIONS.map((loc) => (
            <Picker.Item key={loc} label={formatLocationName(loc)} value={loc} color="#333" />
          ))}
        </Picker>
      </View>
    </View>

    {locations.length > 0 && (
      <SelectedLocations locations={locations} setLocations={setLocations} />
    )}

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>Add Branch</Text>
      <View style={styles.dropdownContainer}>
        <Picker
          selectedValue=""
          onValueChange={(value) => {
            if (!value) return;
            if (!branches.includes(value)) {
              setBranches([...branches, value]);
            }
          }}
          style={styles.picker}
          dropdownIconColor={colors.primary}
        >
          <Picker.Item label="Select Branch" value="" color="#999" />
          {BRANCHES.map((branch) => (
            <Picker.Item key={branch} label={formatBranchName(branch)} value={branch} color="#333" />
          ))}
        </Picker>
      </View>
    </View>

    {branches.length > 0 && (
      <SelectedBranches 
        branches={branches} 
        setBranches={setBranches} 
        moveBranch={moveBranch} 
      />
    )}

    <TouchableOpacity 
      style={styles.submitButton} 
      onPress={handleSubmit}
      activeOpacity={0.8}
      disabled={loading}
    >
      <LinearGradient
        colors={[colors.primary, '#002a6e']}
        style={styles.submitButtonGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.submitButtonText}>Generate List</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  </LinearGradient>
);

const SelectedLocations = ({ locations, setLocations }: any) => (
  <View style={styles.selectedSection}>
    <View style={styles.selectedSectionHeader}>
      <Text style={styles.selectedSectionTitle}>Selected Locations</Text>
      <TouchableOpacity onPress={() => setLocations([])}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.chipContainer}>
      {locations.map((loc: string) => (
        <TouchableOpacity
          key={loc}
          style={styles.chip}
          onPress={() => setLocations(locations.filter((l: string) => l !== loc))}
          activeOpacity={0.7}
        >
          <Text style={styles.chipText}>{formatLocationName(loc)}</Text>
          <Ionicons name="close-circle" size={16} color="#fff" />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const SelectedBranches = ({ branches, setBranches, moveBranch }: any) => (
  <View style={styles.selectedSection}>
    <View style={styles.selectedSectionHeader}>
      <Text style={styles.selectedSectionTitle}>Selected Branches</Text>
      <TouchableOpacity onPress={() => setBranches([])}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.branchesContainer}>
      {branches.map((branch: string, index: number) => (
        <View key={branch} style={styles.branchCard}>
          <View style={styles.branchInfo}>
            <MaterialCommunityIcons name="school-outline" size={20} color={colors.primary} />
            <Text style={styles.branchName} numberOfLines={1}>
              {formatBranchName(branch)}
            </Text>
          </View>
          
          <View style={styles.branchActions}>
            <TouchableOpacity 
              onPress={() => moveBranch(index, "up")}
              disabled={index === 0}
              style={[styles.actionButton, index === 0 && styles.disabledButton]}
            >
              <Ionicons name="chevron-up" size={20} color={index === 0 ? "#ccc" : colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => moveBranch(index, "down")}
              disabled={index === branches.length - 1}
              style={[styles.actionButton, index === branches.length - 1 && styles.disabledButton]}
            >
              <Ionicons name="chevron-down" size={20} color={index === branches.length - 1 ? "#ccc" : colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setBranches(branches.filter((b: string) => b !== branch))}
              style={styles.actionButton}
            >
              <Ionicons name="close-circle" size={20} color="#ff3b30" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const EditButton = ({ onPress }: any) => (
  <TouchableOpacity style={styles.editButton} onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={[colors.primary, '#002a6e']}
      style={styles.editButtonGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <Ionicons name="create-outline" size={20} color="#fff" />
      <Text style={styles.editButtonText}>Edit Form</Text>
    </LinearGradient>
  </TouchableOpacity>
);

const ResultsList = ({ results }: any) => (
  <View style={styles.resultsWrapper}>
    <View style={styles.resultsHeader}>
      <Text style={styles.resultsTitle}>Generated Options</Text>
      <View style={styles.resultsCountBadge}>
        <Text style={styles.resultsCount}>{results.length}</Text>
      </View>
    </View>
    
    {results.map((item: any, index: number) => (
      <View key={index} style={styles.resultCard}>
        <View style={styles.resultCardHeader}>
          <View style={styles.resultNumber}>
            <Text style={styles.resultNumberText}>{index + 1}</Text>
          </View>
          <View style={styles.resultBadge}>
            <Text style={styles.resultBadgeText}>Option</Text>
          </View>
        </View>
        
        <View style={styles.resultContent}>
          <View style={styles.collegeInfo}>
            <MaterialCommunityIcons name="office-building" size={20} color={colors.primary} />
            <Text style={styles.collegeName} numberOfLines={2}>{item.college}</Text>
          </View>
          
          <View style={styles.branchInfo}>
            <MaterialCommunityIcons name="school" size={20} color="#666" />
            <Text style={styles.resultBranch} numberOfLines={1}>
              {formatBranchName(item.branch)}
            </Text>
          </View>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: Math.min(16, width * 0.04),
    paddingVertical: 12,
    paddingBottom: 32,
    alignItems: 'center',
  },
  card: {
    borderRadius: 24,
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: "#d6e0f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  heading: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: colors.primary,
  },
  inputWrapper: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontFamily: "SourceSans3SemiBold",
    fontSize: 14,
    color: "#333",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#d6e0f5",
    paddingHorizontal: 12,
    width: '100%',
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontFamily: "SourceSans3Medium",
    fontSize: 15,
    color: "#333",
  },
  warningText: {
    color: '#ff3b30',
    fontSize: 12,
    fontFamily: "SourceSans3Medium",
    marginTop: 4,
    marginLeft: 4,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: "#d6e0f5",
    borderRadius: 16,
    backgroundColor: "#fff",
    overflow: "hidden",
    width: '100%',
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  selectedSection: {
    marginTop: 8,
    marginBottom: 16,
    backgroundColor: '#f8faff',
    borderRadius: 16,
    padding: 12,
    width: '100%',
  },
  selectedSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  selectedSectionTitle: {
    fontFamily: "SourceSans3SemiBold",
    fontSize: 14,
    color: colors.primary,
  },
  clearAllText: {
    fontFamily: "SourceSans3Medium",
    fontSize: 12,
    color: '#ff3b30',
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: '100%',
  },
  chip: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: '100%',
  },
  chipText: {
    color: "#fff",
    fontSize: 13,
    fontFamily: "SourceSans3SemiBold",
  },
  branchesContainer: {
    gap: 8,
    width: '100%',
  },
  branchCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d6e0f5",
    width: '100%',
  },
  branchInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  branchName: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#333",
    flex: 1,
  },
  branchActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionButton: {
    padding: 6,
    borderRadius: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  submitButton: {
    marginTop: 8,
    borderRadius: 30,
    overflow: 'hidden',
    width: '100%',
  },
  submitButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    width: '100%',
  },
  submitButtonText: {
    color: "#fff",
    fontFamily: "SourceSans3SemiBold",
    fontSize: 16,
  },
  editButton: {
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  editButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
    width: '100%',
  },
  editButtonText: {
    color: "#fff",
    fontFamily: "SourceSans3SemiBold",
    fontSize: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#d6e0f5",
    marginTop: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    color: "#666",
  },
  resultsWrapper: {
    marginTop: 16,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: "SourceSans3Bold",
    color: colors.primary,
  },
  resultsCountBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  resultsCount: {
    fontSize: 14,
    fontFamily: "SourceSans3SemiBold",
    color: "#fff",
  },
  resultCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#d6e0f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    width: '100%',
  },
  resultCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resultNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultNumberText: {
    color: '#fff',
    fontFamily: "SourceSans3Bold",
    fontSize: 14,
  },
  resultBadge: {
    backgroundColor: '#e6f0ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  resultBadgeText: {
    color: colors.primary,
    fontFamily: "SourceSans3SemiBold",
    fontSize: 12,
  },
  resultContent: {
    gap: 10,
  },
  collegeInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  collegeName: {
    flex: 1,
    fontFamily: "SourceSans3SemiBold",
    fontSize: 15,
    color: "#333",
    lineHeight: 20,
  },
  resultBranch: {
    flex: 1,
    fontFamily: "SourceSans3Medium",
    fontSize: 14,
    color: "#666",
  },
});