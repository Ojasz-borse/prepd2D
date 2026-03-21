import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "../styles";
import { colors } from "@/constants/theme";
import { Animated, Easing } from "react-native";

interface TimelineEvent {
  id: string | number;
  start_date: string;
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

const TimelineItem = ({ item, isLast }: { item: TimelineEvent, isLast: boolean }) => {
  const status = getStatusFromDate(item.start_date, item.status);
  const { day, month } = formatDate(item.start_date);
  const badgeLabel = getBadgeLabel(status);
  const isDone = status === 'done';

  return (
    <View style={[styles.itemRow, isDone && styles.dimmed]}>
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
        <Text style={styles.cardDesc} numberOfLines={2}>{item.popup_description}</Text>
      </View>
    </View>
  );
};

const Timeline = ({ data, isLoading }: TimelineProps) => {
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

  return (
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
          />
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

export default Timeline;
