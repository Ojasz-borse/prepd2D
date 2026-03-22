import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal } from "react-native";
import { styles } from "../styles";
import { colors } from "@/constants/theme";
import { Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TimelineEvent {
  id: string | number;
  start_date: string;
  end_date?: string;
  title: string;
  popup_description: string;
  status?: string;
}

interface TimelineProps {
  data: TimelineEvent[];
  isLoading: boolean;
}

// ─── Data ────────────────────────────────────────────────────────────────────

function getStatusFromDate(dateStr: string, apiStatus?: string) {
  try {
    const itemDate = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(itemDate);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate < today) return "done";
    if (checkDate.getTime() === today.getTime()) return apiStatus || "active";
    return apiStatus || "upcoming";
  } catch (e) {
    return apiStatus || "upcoming";
  }
}

function TimelineSkeleton() {
  const opacity = React.useRef(new Animated.Value(0.6)).current;
  React.useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.6, duration: 800, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const SkeletonBox = (props: any) => (
    <Animated.View style={[{ backgroundColor: "#e2e8f0", borderRadius: 4, opacity }, props.style]} />
  );

  return (
    <View style={styles.itemRow}>
      <View style={styles.leftCol}>
        <SkeletonBox style={{ width: 45, height: 50, borderRadius: 8 }} />
        <View style={styles.spine} />
      </View>
      <View style={styles.dotCol}>
        <View style={styles.dot} />
        <View style={styles.dotLine} />
      </View>
      <View style={styles.card}>
        <SkeletonBox style={{ width: 80, height: 20, marginBottom: 12, borderRadius: 12 }} />
        <SkeletonBox style={{ width: "70%", height: 18, marginBottom: 10 }} />
        <SkeletonBox style={{ width: "90%", height: 14, marginBottom: 6 }} />
        <SkeletonBox style={{ width: "60%", height: 14 }} />
      </View>
    </View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
  return { day, month };
}

function getBadgeLabel(status: string) {
  const mapping: { [key: string]: string } = {
    done: 'Done',
    active: 'Active Now',
    deadline: 'Deadline',
    result: 'Result',
    upcoming: 'Upcoming'
  };
  return mapping[status.toLowerCase()] || (status.charAt(0).toUpperCase() + status.slice(1));
}

function isTodayBoundary(events: any[], index: number) {
  // Insert "Today" marker between past (done) and future (active/upcoming) items
  if (index === 0) return false;
  const prevStatus = getStatusFromDate(events[index - 1].start_date, events[index - 1].status);
  const currStatus = getStatusFromDate(events[index].start_date, events[index].status);

  return prevStatus === 'done' && currStatus !== 'done';
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const TodayDivider = () => (
  <View style={styles.todayRow}>
    <View style={styles.todayLine} />
    <View style={styles.todayBadge}>
      <Text style={styles.todayText}>TODAY</Text>
    </View>
    <View style={styles.todayLine} />
  </View>
);

const TimelineItem = ({
  item,
  isLast,
  onPress
}: {
  item: TimelineEvent,
  isLast: boolean,
  onPress: (item: TimelineEvent) => void
}) => {
  const status = getStatusFromDate(item.start_date, item.status);
  const { day, month } = formatDate(item.start_date);
  const badgeLabel = getBadgeLabel(status);
  const isDone = status === 'done';

  return (
    <TouchableOpacity
      style={[styles.itemRow, isDone && styles.dimmed]}
      activeOpacity={0.7}
      onPress={() => onPress(item)}
    >
      {/* Left: date box + spine */}
      <View style={styles.leftCol}>
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{month}</Text>
          <Text style={styles.dateDay}>{day}</Text>
        </View>
        {!isLast && <View style={styles.spine} />}
      </View>

      {/* Center: dot + line */}
      <View style={styles.dotCol}>
        <View style={styles.dot} />
        {!isLast && <View style={styles.dotLine} />}
      </View>

      {/* Right: card */}
      <View style={styles.card}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{badgeLabel}</Text>
        </View>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {item.popup_description?.replace(/\\n/g, '\n')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const Timeline = ({ data, isLoading }: TimelineProps) => {
  const [selectedEvent, setSelectedEvent] = React.useState<TimelineEvent | null>(null);

  if (isLoading && (!data || data.length === 0)) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {[1, 2, 3, 4].map((i) => <TimelineSkeleton key={i} />)}
      </ScrollView>
    );
  }

  const events = React.useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
  }, [data]);

  const handleCloseModal = () => setSelectedEvent(null);

  if (!isLoading && events.length === 0) {
    return (
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.emptyCard}>
          <Ionicons name="time-outline" size={48} color="#cbd5e1" style={{ marginBottom: 16 }} />
          <Text style={styles.emptyText}>No time line added yet, please try later</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {events.map((item, index) => (
          <React.Fragment key={item.id}>
            {isTodayBoundary(events, index) && <TodayDivider />}
            <TimelineItem
              item={item}
              isLast={index === events.length - 1}
              onPress={(event) => setSelectedEvent(event)}
            />
          </React.Fragment>
        ))}
      </ScrollView>

      {/* Event Details Modal */}
      <Modal
        visible={!!selectedEvent}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedEvent && (
                <>
                  <View style={styles.modalBadgeRow}>
                    <View style={[styles.badge, { marginBottom: 0 }]}>
                      <Text style={styles.badgeText}>
                        {getBadgeLabel(getStatusFromDate(selectedEvent.start_date, selectedEvent.status))}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>

                  <View style={styles.modalDatesContainer}>
                    <View style={styles.modalDateRow}>
                      <Ionicons name="calendar-outline" size={16} color="#004aad" style={{ marginRight: 8 }} />
                      <Text style={styles.modalDateText}>
                        Starts: {new Date(selectedEvent.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </Text>
                    </View>

                    {selectedEvent.end_date && (
                      <View style={[styles.modalDateRow, { marginTop: 8 }]}>
                        <Ionicons name="alert-circle-outline" size={16} color="#ff5e32" style={{ marginRight: 8 }} />
                        <Text style={[styles.modalDateText, { color: '#ff5e32' }]}>
                          Deadline: {new Date(selectedEvent.end_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionHeader}>Description:</Text>
                    <Text style={styles.descriptionText}>
                      {selectedEvent.popup_description?.replace(/\\n/g, '\n')}
                    </Text>
                  </View>
                </>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeModalButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeModalButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Timeline;
