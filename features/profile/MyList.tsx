import GripDotsIcon from "@/assets/icons/GripDotsIcon";
import AdvancedFindCollegeCard from "@/components/AdvancedFindCollegeCard";
import AdvancedFindCollegeCardSkeleton from "@/components/AdvancedFindCollegeCardSkeleton";
import TopHeader from "@/components/TopHeader";
import { useAdvancedColleges } from "@/hooks/useAdvancedColleges";
import { useMyList } from "@/hooks/useMyList";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Modal,
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
import { SafeAreaView } from "react-native-safe-area-context";

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

export default function MyList() {
  const { branches, branchesLoading } = useAdvancedColleges();
  const { codes, loading, saving, saveList, clearList } = useMyList();

  const [filteredData, setFilteredData] = useState<CollegeBranch[]>([]);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalOrder, setOriginalOrder] = useState<string[]>([]);
  const [view, setView] = useState<"quick" | "info">("quick");
  const [visibleModal, setVisibleModal] = useState(false);

  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    if (branches?.length === 0 || codes?.length === 0) return;
    const sorted = codes
      .map((code) => branches.find((b) => b.choice_code === code))
      .filter(Boolean) as CollegeBranch[];
    setFilteredData(sorted);
    setOriginalOrder(codes);
  }, [branches, codes]);

  const handleSave = async () => {
    const newOrder = filteredData.map((b) => b.choice_code);
    await saveList(newOrder);
    setOriginalOrder(newOrder);
    setHasChanges(false);
    alert("✅ List updated!");
  };

  const handleClearAll = async () => {
    await clearList();
    setFilteredData([]);
    setVisibleModal(false);
  };

  const handleDragEnd = ({ data }: { data: CollegeBranch[] }) => {
    setFilteredData(data);
  };

  useEffect(() => {
    const currentOrder = filteredData.map((b) => b.choice_code);
    setHasChanges(
      JSON.stringify(currentOrder) !== JSON.stringify(originalOrder)
    );
  }, [filteredData, originalOrder]);

  const handleLongPress = (choiceCode: string) => {
    setSelectionMode(true);
    setSelectedCards((prev) =>
      prev.includes(choiceCode) ? prev : [...prev, choiceCode]
    );
  };

  const handleSelectCard = (choiceCode: string) => {
    if (!selectionMode) return;
    setSelectedCards((prev) =>
      prev.includes(choiceCode)
        ? prev.filter((code) => code !== choiceCode)
        : [...prev, choiceCode]
    );
  };

  const handleDeleteSelected = () => {
    const newData = filteredData.filter(
      (item) => !selectedCards.includes(item.choice_code)
    );
    setFilteredData(newData);
    setSelectedCards([]);
    setSelectionMode(false);
  };

  useEffect(() => {
    if (selectedCards.length === 0) setSelectionMode(false);
  }, [selectedCards]);

  const renderItem = ({
    item,
    drag,
    isActive,
  }: RenderItemParams<CollegeBranch>) => {
    const isSelected = selectedCards.includes(item.choice_code);

    return (
      <Animated.View
        style={[
          styles.cardContainer,
          isActive && styles.activeCard,
          isSelected && styles.selectedCard,
        ]}
      >
        {!selectionMode && (
          <TouchableOpacity style={styles.dragHandle} onPressIn={drag}>
            <View style={styles.dragIconContainer}>
              <GripDotsIcon size={22} color="#444" />
            </View>
          </TouchableOpacity>
        )}
        <Pressable
          style={styles.cardPressable}
          onPress={() => selectionMode && handleSelectCard(item.choice_code)}
          delayLongPress={200}
        >
          <MemoizedCard
            item={item}
            quickView={view === "quick"}
            onLongPress={handleLongPress}
          />
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <GestureHandlerRootView>
        <TopHeader title="My List" showBackArrow={true} />
        <View style={styles.container}>
          <View style={styles.contentWrapper}>
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
              activationDistance={10}
              autoscrollSpeed={200}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 4,
                paddingTop: 16,
                paddingBottom: 100,
              }}
              ListEmptyComponent={
                loading || branchesLoading ? (
                  <>
                    <AdvancedFindCollegeCardSkeleton />
                    <AdvancedFindCollegeCardSkeleton />
                  </>
                ) : (
                  <Text style={styles.noResult}>No colleges found</Text>
                )
              }
            />

            {hasChanges && filteredData.length > 0 && (
              <View style={styles.bottomDeleteWrapper}>
                <TouchableOpacity
                  style={styles.bottomSaveBtn}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Ionicons name="checkmark" size={20} color="#fff" />
                  <Text style={styles.bottomDeleteText}>
                    {saving ? "Saving..." : "Save Changes"}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {selectionMode && selectedCards.length > 0 && (
              <View style={styles.bottomDeleteWrapper}>
                <TouchableOpacity
                  style={styles.bottomDeleteBtn}
                  onPress={handleDeleteSelected}
                >
                  <Ionicons name="trash-outline" size={20} color="#fff" />
                  <Text style={styles.bottomDeleteText}>
                    Delete Selected ({selectedCards.length})
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
                    onPress={() => setVisibleModal(false)}
                  >
                    <Text style={styles.modalButtonTextCancel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.modalButtonSubmit}
                    onPress={handleClearAll}
                  >
                    <Text style={styles.modalButtonTextSubmit}>Clear All</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  container: { flex: 1, backgroundColor: "#fff" },
  contentWrapper: { flex: 1, paddingHorizontal: 12, paddingTop: 8 },
  dropdown: { width: 110, height: 20, borderRadius: 20 },
  dropdownText: {
    fontSize: 16,
    fontFamily: "SourceSans3Medium",
    color: "#333",
    textTransform: "capitalize",
  },
  clearButton: {
    fontFamily: "SourceSans3Medium",
  },
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
    elevation: 5,
    shadowColor: "#000",
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

  // Card Styles
  cardContainer: {
    position: "relative",
    marginBottom: 15,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cardPressable: {
    flex: 1,
  },
  selectedCard: {
    borderWidth: 1.5,
    borderColor: "#004aad",
    borderRadius: 18,
  },
  activeCard: {
    borderWidth: 1.5,
    borderColor: "#004aad50",
    borderRadius: 18,
  },

  // Drag Handle
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

  // Bottom Delete Bar
  bottomDeleteWrapper: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  bottomDeleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ff3b30",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
  },
  bottomSaveBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#004aad",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
    elevation: 5,
  },
  bottomDeleteText: {
    color: "#fff",
    marginLeft: 8,
    fontFamily: "SourceSans3Medium",
    fontSize: 15,
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
