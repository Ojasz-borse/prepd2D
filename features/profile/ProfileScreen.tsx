import GripDotsIcon from "@/assets/icons/GripDotsIcon";
import { ProfilePageIcon } from "@/assets/icons/ProfilePageIcon";
import AdvancedFindCollegeCard from "@/components/AdvancedFindCollegeCard";
import AdvancedFindCollegeCardSkeleton from "@/components/AdvancedFindCollegeCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { useAuth } from "@/context/AuthContext";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Modal,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { Dropdown } from "react-native-element-dropdown";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { colors } from "../../constants/theme";

interface CollegeBranch {
  branch_name: string;
  choice_code: string;
  college_code: string;
  district: string;
  is_autonomous: boolean;
  is_government: boolean;
  name: string;
  standard_cutoff_data: StandardCutoffData[];
}

interface StandardCutoffData {
  rank: number;
  category: string;
  percentile: number;
}

const MemoizedCard = React.memo(AdvancedFindCollegeCard);

export default function ProfileView() {
  const { user, loading } = useAuth();

  const [activeTab, setActiveTab] = useState<"My List" | "">("My List");

  const { branches, branchesLoading } = useAdvancedColleges();
  const [filteredData, setFilteredData] = useState<CollegeBranch[]>([]);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);

  const [view, setView] = useState<"quick" | "info">("quick");

  const [visibleModal, setVisibleModal] = useState(false);
  const [longPressedCard, setLongPressedCard] = useState<string | null>(null);
  const [showDeleteIcon, setShowDeleteIcon] = useState<string | null>(null);

  const handleClearAll = () => {
    // 👉 your clear-all logic here
    console.log("Cleared all colleges");
    setVisibleModal(false);
  };

  // Load cached list and filter colleges in order
  useEffect(() => {
    const loadList = async () => {
      const cached = await AsyncStorage.getItem("myList");
      let existingCodes: string[] = cached ? JSON.parse(cached) : [];
      setOriginalOrder(existingCodes);

      // Arrange branches in sequence of choice_code
      const sorted = existingCodes
        .map((code) => branches.find((b) => b.choice_code === code))
        .filter(Boolean) as CollegeBranch[];

      setFilteredData(sorted);
      setHasChanges(false);
    };

    if (branches.length > 0) loadList();
  }, [branches]);

  // Save new order
  const handleSave = async () => {
    setSaving(true);
    const newOrder = filteredData.map((b) => b.choice_code);
    await AsyncStorage.setItem("myList", JSON.stringify(newOrder));
    setOriginalOrder(newOrder);
    setHasChanges(false);
    setSaving(false);
    alert("✅ List updated!");
  };

  // Check for changes whenever filteredData changes
  useEffect(() => {
    const currentOrder = filteredData.map((b) => b.choice_code);
    const hasOrderChanged =
      JSON.stringify(currentOrder) !== JSON.stringify(originalOrder);
    setHasChanges(hasOrderChanged);
  }, [filteredData, originalOrder]);

  const handleDragEnd = ({ data }: { data: CollegeBranch[] }) => {
    setFilteredData(data);
    setLongPressedCard(null);
    setShowDeleteIcon(null);
  };

  const handleLongPress = (choiceCode: string) => {
    setLongPressedCard(choiceCode);
    setShowDeleteIcon(choiceCode);
  };

  const handleDeleteCard = (choiceCode: string) => {
    Alert.alert(
      "Remove College",
      "Are you sure you want to remove this college from your list?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            const newData = filteredData.filter(
              (item) => item.choice_code !== choiceCode
            );
            setFilteredData(newData);
            setShowDeleteIcon(null);
            setLongPressedCard(null);
          },
        },
      ]
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // only trigger if horizontal swipe
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > 50 && activeTab === "My List") {
          // swipe right → go back to normal
          setActiveTab("My List");
        } else if (gestureState.dx < -50 && activeTab === "") {
          // swipe left → go to advanced
          setActiveTab("");
        }
      },
    })
  ).current;

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<CollegeBranch>) => {
    return (
      <Animated.View
        style={[
          styles.cardContainer,
          isActive && styles.activeCard,
          longPressedCard === item.choice_code && styles.longPressedCard,
        ]}
      >
        {/* Delete Icon - appears on long press */}
        {showDeleteIcon === item.choice_code && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteCard(item.choice_code)}
          >
            <View style={styles.deleteIconContainer}>
              <Ionicons name="trash-outline" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
        )}

        {/* Drag Handle - 6 dots icon */}
        <TouchableOpacity
          style={styles.dragHandle}
          onPressIn={() => {
            drag();
            handleLongPress(item.choice_code);
          }}
        >
          <View style={styles.dragIconContainer}>
            <GripDotsIcon size={22} color="#444" />
          </View>
        </TouchableOpacity>

        <Pressable
          onLongPress={() => {
            drag();
            handleLongPress(item.choice_code);
          }}
          delayLongPress={200} // Adjust delay as needed
          style={styles.cardPressable}
        >
          <AdvancedFindCollegeCard
            item={item}
            quickView={view === "quick"}
            isDragging={isActive}
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TopHeader title="Profile" showBackArrow={false} />
      {/* 🔹 Profile content */}
      <View style={styles.container}>
        {/* Header */}

        <View style={styles.profileSection}>
          {/* Profile Icon on Left */}
          <View style={styles.profileWrapper}>
            <ProfilePageIcon size={100} focused={false} />
          </View>

          {/* User Info on Right */}
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>
              {!loading && user?.first_name + " " + user?.last_name}
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>

            <View style={styles.groupBadge}>
              <Text style={styles.groupText}>{user?.group}</Text>
            </View>
          </View>
        </View>

        {/* Custom Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "My List" && styles.activeTab]}
            onPress={() => setActiveTab("My List")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "My List" && styles.activeTabText,
              ]}
            >
              My List
            </Text>
          </TouchableOpacity>
        </View>

        {/* Swipeable Content */}
        <View style={styles.contentWrapper} {...panResponder.panHandlers}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                display: activeTab === "My List" ? "flex" : "none",
              }}
            >
              <View style={{ flex: 1 }}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <Dropdown
                    style={styles.dropdown}
                    data={[
                      { label: "Quick view", value: "quick" },
                      { label: "Info view", value: "info" },
                    ]}
                    labelField="label"
                    valueField="value"
                    showsVerticalScrollIndicator={false}
                    value={view}
                    onChange={(item) => setView(item.value)}
                    placeholder="Select view"
                    placeholderStyle={styles.dropdownText}
                    selectedTextStyle={styles.dropdownText}
                    itemTextStyle={styles.dropdownText}
                  />

                  <TouchableOpacity onPress={() => setVisibleModal(true)}>
                    <Text style={styles.clearButton}>Clear All</Text>
                  </TouchableOpacity>
                </View>

                <DraggableFlatList
                  data={filteredData}
                  keyExtractor={(item) => item.choice_code}
                  renderItem={renderItem}
                  onDragEnd={handleDragEnd}
                  activationDistance={10} // drag starts after moving 10px
                  autoscrollSpeed={200} // Increased for smoother scrolling
                  autoscrollThreshold={50} // Starts auto-scroll sooner for multi-card movement
                  dragHitSlop={{ left: 0, right: 50, top: 15, bottom: 15 }} // Better touch area
                  animationConfig={{
                    mass: 0.5,
                    damping: 20,
                    stiffness: 150,
                    overshootClamping: false,
                  }}
                  ListEmptyComponent={
                    branchesLoading ? (
                      <>
                        <AdvancedFindCollegeCardSkeleton />
                        <AdvancedFindCollegeCardSkeleton />
                        <AdvancedFindCollegeCardSkeleton />
                      </>
                    ) : (
                      <Text style={styles.noResult}>No colleges found</Text>
                    )
                  }
                  contentContainerStyle={{
                    padding: 4,
                    paddingTop: 16,
                    paddingBottom: 80, // space for button
                  }}
                />

                {hasChanges && filteredData.length > 0 && (
                  <View>
                    <TouchableOpacity
                      style={styles.saveBtn}
                      onPress={handleSave}
                      disabled={saving}
                    >
                      <Text style={styles.saveBtnText}>
                        {saving ? "Saving..." : "Save Changes"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        <Modal
          visible={visibleModal}
          transparent
          animationType="fade"
          onRequestClose={() => setVisibleModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Do you really want to clear all your saved list?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={styles.modalButtonCancel}
                  onPress={() => {
                    setVisibleModal(false);
                  }}
                >
                  <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.modalButtonSubmit}
                  onPress={() => {
                    handleClearAll();
                  }}
                >
                  <Text style={styles.modalButtonTextSubmit}>Clear All</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  profileSection: {
    flexDirection: "row", // side by side
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },

  profileWrapper: {
    marginRight: 16, // space between icon and text
  },

  profileInfo: {
    flex: 1,
    alignItems: "flex-start", // left aligned
  },

  userName: {
    fontSize: 18,
    color: colors.textDark,
    fontFamily: "SourceSans3Medium",
  },

  userEmail: {
    fontSize: 16,
    color: colors.textLight,
    fontFamily: "SourceSans3Medium",
  },

  groupBadge: {
    backgroundColor: "#004aad",
    paddingVertical: 1,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginTop: 8,
    alignSelf: "flex-start", // keeps badge left-aligned
  },

  groupText: {
    color: "#fff",
    fontFamily: "SourceSans3Medium",
    fontSize: 12,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d3",
    backgroundColor: "#fff",
    marginTop: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
  },
  activeTab: { borderBottomColor: colors.primary },
  tabText: {
    fontSize: 16,
    color: colors.textDark,
    fontFamily: "SourceSans3Medium",
  },
  activeTabText: { color: colors.primary },
  dropdown: {
    width: 110,
    height: 20,
    borderRadius: 20,
  },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
    textTransform: "capitalize",
  },

  contentWrapper: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  noResult: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
  saveBtn: {
    position: "absolute",
    bottom: 50,
    right: 10,
    backgroundColor: "#004aad",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "SourceSans3Medium",
  },

  clearButton: {
    fontFamily: "SourceSans3Medium",
  },

  // Card Styles
  cardContainer: {
    position: "relative",
    marginBottom: 15,
    borderRadius: 12,
    overflow: "visible",
    flexDirection: "row",
    alignItems: "center",
  },
  cardPressable: {
    flex: 1,
  },
  activeCard: {},
  longPressedCard: {
    borderWidth: 1.5,
    borderColor: "#004aad",
    borderRadius: 18,
  },

  // Drag Handle Styles
  dragHandle: {
    position: "absolute",
    right: -7,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    paddingHorizontal: 8,
  },
  dragIconContainer: {
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    padding: 2,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  // Delete Icon Styles
  deleteButton: {
    position: "absolute",
    right: 45, // Moved left to make space for drag handle
    top: -10,
    zIndex: 1000,
  },
  deleteIconContainer: {
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 30,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    marginBottom: 16,
    color: "#004aad",
    textAlign: "center",
  },

  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalButtonCancel: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 14,
  },
  modalButtonSubmit: {
    backgroundColor: "#004aad",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 99,
  },
  modalButtonTextCancel: {
    fontSize: 15,
    color: "#999",
    fontFamily: "SourceSans3Medium",
  },
  modalButtonTextSubmit: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "SourceSans3Medium",
  },
});
