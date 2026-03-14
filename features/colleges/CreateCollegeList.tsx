import React, { useState,useEffect } from "react";
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
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { LOCATIONS, BRANCHES, CATEGORIES } from "@/constants/collegeFilters";
import { useCreateCollegeList } from "@/hooks/useCreateCollegeList";
import { formatLocationName, formatBranchName } from "@/utils/formatHelpers";
import { useSubscriptionLock } from "@/hooks/useSubcribtion";
import SubscriptionLockSheet from "@/components/ShowLockScreen";
import TopHeader from "@/components/TopHeader";
import { useRouter } from "expo-router";
import FloatingLabelInput from "@/components/FloatingLabelInput";
import { Dropdown, MultiSelect } from "react-native-element-dropdown";
import { usePreventScreenCapture } from "@/hooks/usePreventScreenCapture";

interface DropdownItemProps {
  label: string;
  isSelected: boolean;
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, isSelected }) => (
  <View style={styles.itemRow}>
    <Ionicons
      name={isSelected ? "checkbox" : "square-outline"}
      size={20}
      color={isSelected ? colors.primary : "#999"}
      style={{ marginRight: 8 }}
    />
    <Text style={[styles.itemText, isSelected && { color: colors.primary }]}>
      {label}
    </Text>
  </View>
);

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

  const { showLock, closeLock, isAllowed } = useSubscriptionLock({
    gate: "after",
    delay: 0, 
  });

  const [localShowLock, setLocalShowLock] = useState(false);

  usePreventScreenCapture();
  
  // Subscription Lock Effect
  useEffect(() => {
    if (!isAllowed) {
      setLocalShowLock(true); 
    } else {
      setLocalShowLock(false);
    }
  }, [isAllowed]);

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
    <LinearGradient
      colors={["#f8fafc", "#e6f1ff", "#e8dcff"]}
      locations={[0, 0.5, 1]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <TopHeader title="Generate Option form" showBackArrow={false} />
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* Banner */}
            <LinearGradient
              colors={["#004aad", "#0073e6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.banner}
            >
              <View style={styles.bannerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bannerHead}>Generate Option Form!</Text>
                  <Text style={styles.bannerSub}>
                    Create your perfect college preference list easily.
                  </Text>
                </View>
                <View style={styles.bannerIconWrap}>
                  <Feather name="list" size={34} color="#fff" />
                </View>
              </View>
            </LinearGradient>

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
          {localShowLock && (
          <SubscriptionLockSheet
            visible={localShowLock}
            planType="after"
            cssType="type2"
            // onClose={() => {
            //   setLocalShowLock(false)
            //   if (index >= 3) {
            //     setIndex(2) // Jump back to safe question if they close and are still on blocked index
            //   }
            // }}
          />
        )}
        </View>
      </SafeAreaView>
    </LinearGradient>
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

    <Text style={styles.formTitle}>Enter Details</Text>

    <View style={{ flexDirection: "row", gap: 12, marginBottom: -14, }}>
      <View style={{ width: "48%" }}>
        <FloatingLabelInput
          label="Rank"
          value={rank}
          onChangeText={setRank}
          keyboardType="number-pad"
        />
      </View>
      <View style={{ width: "48%" }}>
        <FloatingLabelInput
          label="Percentile"
          value={percentile}
          onChangeText={handlePercentileChange}
          keyboardType="number-pad"
        />
      </View>
    </View>

    {percentile && parseFloat(percentile) > 100 && (
      <Text style={[styles.warningText, { marginTop: -20, marginBottom: 10 }]}>Percentile cannot exceed 100</Text>
    )}

    <View style={styles.inputWrapper}>
      <Dropdown
        style={styles.dropdown}
        data={CATEGORIES.map((cat) => ({ label: cat, value: cat }))}
        labelField="label"
        valueField="value"
        value={categories[0] || ""}
        onChange={(item) => setCategories([item.value])}
        placeholder="Select Category"
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        containerStyle={styles.dropdownContainerStyle}
      />
    </View>

    <View style={styles.inputWrapper}>
      <MultiSelect
        style={styles.dropdown}
        data={LOCATIONS.map((loc) => ({
          label: formatLocationName(loc),
          value: loc,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select Locations"
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        value={locations}
        onChange={(items) => setLocations(items as string[])}
        renderItem={(item) => {
          const isSelected = locations.includes(item.value);
          return <DropdownItem label={item.label} isSelected={isSelected} />;
        }}
        visibleSelectedItem={false}
        containerStyle={styles.dropdownContainerStyle}
      />
      {locations.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{locations.length}</Text>
        </View>
      )}
    </View>

    {locations.length > 0 && (
      <SelectedLocations
        locations={locations}
        setLocations={setLocations}
      />
    )}

    <View style={styles.inputWrapper}>
      <MultiSelect
        style={styles.dropdown}
        data={BRANCHES.map((branch) => ({
          label: formatBranchName(branch),
          value: branch,
        }))}
        labelField="label"
        valueField="value"
        placeholder="Select Branches"
        placeholderStyle={styles.dropdownText}
        selectedTextStyle={styles.dropdownText}
        itemTextStyle={styles.dropdownText}
        value={branches}
        onChange={(items) => setBranches(items as string[])}
        renderItem={(item) => {
          const isSelected = branches.includes(item.value);
          return <DropdownItem label={item.label} isSelected={isSelected} />;
        }}
        visibleSelectedItem={false}
        containerStyle={styles.dropdownContainerStyle}
      />
      {branches.length > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{branches.length}</Text>
        </View>
      )}
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
        colors={['#ff7a22', '#e66a1f']}
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
      <Text style={styles.selectedSectionTitle}>Preferred Locations</Text>
      <TouchableOpacity onPress={() => setLocations([])}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.chipContainer}>
      {locations.map((loc: string) => (
        <View key={loc} style={styles.chip}>
          <Text style={styles.chipText}>{formatLocationName(loc)}</Text>
          <TouchableOpacity
            onPress={() => setLocations(locations.filter((l: string) => l !== loc))}
            style={styles.chipCloseBtn}
          >
            <Ionicons name="close-circle" size={18} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

const SelectedBranches = ({ branches, setBranches, moveBranch }: any) => (
  <View style={styles.selectedSection}>
    <View style={styles.selectedSectionHeader}>
      <Text style={styles.selectedSectionTitle}>Branches Preferrence</Text>
      <TouchableOpacity onPress={() => setBranches([])}>
        <Text style={styles.clearAllText}>Clear All</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.branchesContainer}>
      {branches.map((branch: string, index: number) => (
        <View key={branch} style={styles.branchCard}>
          <View style={styles.branchInfo}>
            <View style={styles.branchNumber}>
              <Text style={styles.branchNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.branchName}>
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
      <View key={index} style={styles.cardContainer}>
        {/* Choice code and Type Tags */}
        <View style={styles.topRow}>
          <View style={styles.greenTag}>
            <Text style={styles.greenTagText}>{index + 1}</Text>
          </View>
          {item.choice_code && (
            <View style={styles.greenTag}>
              <Text style={styles.greenTagText}>{item.choice_code}</Text>
            </View>
          )}
          {item.is_government !== undefined && (
            <View style={styles.greenTag}>
              <Text style={styles.greenTagText}>
                {item.is_government ? "Govt" : "Pvt"}
              </Text>
            </View>
          )}
        </View>

        {/* Branch Name */}
        <View style={styles.titleRow}>
          <Text style={styles.resultBranchName}>
            {formatBranchName(item.branch)}
          </Text>
        </View>

        {/* College Name */}
        <View style={styles.collegeRow}>
          <Text style={styles.collegePillText}>{item.college}</Text>
        </View>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    // backgroundColor: '#f5f9ff',
  },
  container: {
    flex: 1,
    // backgroundColor: '#f5f9ff',
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: Math.min(16, width * 0.04),
    paddingVertical: 12,
    paddingBottom: 32,
    alignItems: 'center',
  },
  banner: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
  bannerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerHead: {
    fontSize: 20,
    fontFamily: "SourceSans3Bold",
    color: "#fff",
    marginBottom: 4,
  },
  bannerSub: {
    fontSize: 14,
    fontFamily: "SourceSans3Medium",
    color: "#e6f1ff",
    lineHeight: 20,
    paddingRight: 10,
  },
  bannerIconWrap: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 10,
    borderRadius: 15,
  },
  card: {
    borderRadius: 16,
    padding: width * 0.04,
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
  formTitle: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: colors.primary,
    marginBottom: 20,
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
  dropdown: {
    height: 60,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
  },
  dropdownContainerStyle: {
    borderRadius: 16,
    marginTop: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 12,
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    fontFamily: "SourceSans3Medium",
  },
  badge: {
    position: "absolute",
    top: 20,
    right: 60,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontFamily: "SourceSans3Medium",
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
    borderWidth: 1,
    borderColor: '#d6e0f5',
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
  branchesContainer: {
    gap: 8,
    width: '100%',
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    width: '100%',
  },
  chip: {
    backgroundColor: "#fff",
    paddingVertical: 6,
    paddingLeft: 12,
    paddingRight: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: "#d6e0f5",
  },
  chipText: {
    color: "#333",
    fontSize: 13,
    fontFamily: "SourceSans3SemiBold",
  },
  chipCloseBtn: {
    padding: 2,
  },
  branchCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#d6e0f5",
    width: '100%',
  },
  branchInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  branchNumber: {
    width: 20,
    height: 20,
    borderRadius: 12,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.primary + '30',
    marginTop: 2,
  },
  branchNumberText: {
    fontSize: 10,
    fontFamily: "SourceSans3Bold",
    color: colors.primary,
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
    marginTop: -4,
    marginRight: -4,
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
  cardContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    gap: 8,
  },
  greenTag: {
    backgroundColor: "#f0f7d4",
    borderWidth: 1,
    borderColor: "#b6cf4f",
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  greenTagText: {
    fontSize: 12,
    color: "#8b9e3dff",
    fontFamily: "SourceSans3Medium",
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  resultBranchName: {
    flex: 1,
    fontSize: 17,
    color: "#000",
    fontFamily: "SourceSans3SemiBold",
  },
  collegeRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  collegePillText: {
    fontSize: 14,
    color: "#4a5568",
    fontFamily: "SourceSans3Medium",
  },
});