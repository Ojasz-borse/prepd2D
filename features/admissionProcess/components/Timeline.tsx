import React from "react";
import { View, Text, ScrollView } from "react-native";
import { styles } from "../styles";
import { colors } from "@/constants/theme";

// ─── Data ────────────────────────────────────────────────────────────────────

const EVENTS = [
  {
    id: '1',
    event_date: '2026-03-10',
    status: 'done',
    title: 'Registration Opens',
    description: 'Student login portal activated. Create your account and verify your documents.',
  },
  {
    id: '2',
    event_date: '2026-03-18',
    status: 'active',
    title: 'CAP Round 1 — Option Form',
    description: 'Fill and submit your college preference list. You can edit until the deadline.',
  },
  {
    id: '3',
    event_date: '2026-03-22',
    status: 'deadline',
    title: 'Option Form Closes',
    description: 'Last date to edit or re-submit your preference list. No changes after this.',
  },
  {
    id: '4',
    event_date: '2026-03-28',
    status: 'result',
    title: 'CAP Round 1 — Result',
    description: 'Seat allotment published on the official portal. Check your allotment letter.',
  },
  {
    id: '5',
    event_date: '2026-04-03',
    status: 'upcoming',
    title: 'CAP Round 2 — Option Form',
    description: 'Second round preferences open for eligible and non-reporting students.',
  },
  {
    id: '6',
    event_date: '2026-04-10',
    status: 'upcoming',
    title: 'CAP Round 2 — Result',
    description: 'Round 2 seat allotment declared. Candidates must report to allotted institute.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
  return { day, month };
}

function getBadgeLabel(status: string) {
  switch (status) {
    case 'done': return 'Done';
    case 'active': return 'Active Now';
    case 'deadline': return 'Deadline';
    case 'result': return 'Result';
    default: return 'Upcoming';
  }
}

function isTodayBoundary(events: any[], index: number) {
  // Insert "Today" marker between done/past and active/future items
  if (index === 0) return false;
  const prev = events[index - 1];
  const curr = events[index];
  const prevIsPast = prev.status === 'done';
  const currIsPresent = curr.status === 'active' || curr.status === 'deadline';
  return prevIsPast && currIsPresent;
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

const TimelineItem = ({ item, isLast }: { item: any, isLast: boolean }) => {
  const { day, month } = formatDate(item.event_date);
  const badgeLabel = getBadgeLabel(item.status);
  const isDone = item.status === 'done';

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
        <Text style={styles.cardDesc}>{item.description}</Text>
      </View>
    </View>
  );
};

const Timeline = () => {
  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {EVENTS.map((item, index) => (
        <React.Fragment key={item.id}>
          {isTodayBoundary(EVENTS, index) && <TodayDivider />}
          <TimelineItem
            item={item}
            isLast={index === EVENTS.length - 1}
          />
        </React.Fragment>
      ))}
    </ScrollView>
  );
};

export default Timeline;
