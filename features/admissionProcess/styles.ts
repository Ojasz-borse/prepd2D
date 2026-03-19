import { StyleSheet, Dimensions } from "react-native";
import { colors } from "@/constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  contentArea: {
    flex: 1,
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: -10,
    gap: 28,
    borderBottomWidth: 1,
    borderBottomColor: "#d3d3d350",
    position: "relative",
    justifyContent: "flex-start",
    backgroundColor: "#fff",
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    zIndex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 17,
    fontFamily: "SourceSans3SemiBold",
    color: "#737373",
  },
  tabLabelActive: {
    color: colors.primary,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    height: 3,
    zIndex: 0,
  },
  indicator: {
    height: 3,
    width: "100%",
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  quickCard: {
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 18,
    padding: 12,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  quickHeading: {
    fontSize: 18,
    fontFamily: "SourceSans3SemiBold",
    color: "#004aad",
    marginBottom: 16,
  },
  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  quickItem: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  quickIconBox: {
    padding: 12,
    borderRadius: 12,
  },
  quickTitle: {
    fontSize: 16,
    fontFamily: "SourceSans3SemiBold",
    color: "#2E2E32",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
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
  
  // Timeline Header
  timelineHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: "SourceSans3Bold",
    color: '#111827',
    marginBottom: 2,
  },
  headerSub: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: "SourceSans3Medium",
  },

  // Today divider
  todayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 64, 
  },
  todayLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.primary,
    opacity: 0.25,
  },
  todayBadge: {
    backgroundColor: '#EEEDFE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  todayText: {
    fontSize: 10,
    fontFamily: "SourceSans3Bold",
    color: colors.primary,
    letterSpacing: 0.8,
  },

  // Item row
  itemRow: {
    flexDirection: 'row',
    marginBottom: 0,
    alignItems: 'flex-start',
  },
  dimmed: {
    opacity: 0.55,
  },

  // Left column (date box + spine)
  leftCol: {
    width: 52,
    alignItems: 'center',
    marginRight: 12,
  },
  dateBox: {
    width: 52,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 0.5,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  dateMonth: {
    fontSize: 9,
    fontFamily: "SourceSans3Bold",
    letterSpacing: 0.5,
    lineHeight: 12,
  },
  dateDay: {
    fontSize: 18,
    fontFamily: "SourceSans3Bold",
    lineHeight: 22,
  },
  spine: {
    width: 1,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },

  // Dot column
  dotCol: {
    width: 16,
    alignItems: 'center',
    marginRight: 10,
    paddingTop: 12,
  },
  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  dotLine: {
    width: 1,
    flex: 1,
    minHeight: 24,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },

  // Card
  card: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 0.5,
    padding: 12,
    marginBottom: 16,
    top: 4,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 6,
  },
  badgeText: {
    fontSize: 9,
    fontFamily: "SourceSans3Bold",
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 13,
    fontFamily: "SourceSans3Bold",
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDesc: {
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "SourceSans3Medium",
  },
});
