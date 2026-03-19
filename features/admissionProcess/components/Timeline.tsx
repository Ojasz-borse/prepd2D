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

// ─── Config per status ───────────────────────────────────────────────────────

const STATUS_CONFIG: any = {
  done: {
    dotColor: '#9CA3AF',
    cardBg: '#F9FAFB',
    cardBorder: '#E5E7EB',
    badgeBg: '#F3F4F6',
    badgeText: '#6B7280',
    badgeLabel: 'Done',
    titleColor: '#9CA3AF',
    descColor: '#9CA3AF',
    dateColor: '#9CA3AF',
    dimmed: true,
  },
  active: {
    dotColor: colors.primary,
    dotRing: '#CECBF6',
    cardBg: '#EEEDFE',
    cardBorder: '#AFA9EC',
    badgeBg: colors.primary,
    badgeText: '#FFFFFF',
    badgeLabel: 'Active Now',
    titleColor: '#26215C',
    descColor: '#3C3489',
    dateColor: colors.primary,
    dimmed: false,
  },
  deadline: {
    dotColor: '#BA7517',
    cardBg: '#FAEEDA',
    cardBorder: '#FAC775',
    badgeBg: '#BA7517',
    badgeText: '#FFFFFF',
    badgeLabel: 'Deadline',
    titleColor: '#412402',
    descColor: '#633806',
    dateColor: '#854F0B',
    dimmed: false,
  },
  result: {
    dotColor: '#0F6E56',
    cardBg: '#E1F5EE',
    cardBorder: '#5DCAA5',
    badgeBg: '#0F6E56',
    badgeText: '#FFFFFF',
    badgeLabel: 'Result',
    titleColor: '#04342C',
    descColor: '#085041',
    dateColor: '#0F6E56',
    dimmed: false,
  },
  upcoming: {
    dotColor: '#7F77DD',
    cardBg: '#FFFFFF',
    cardBorder: '#E5E7EB',
    badgeBg: '#EEEDFE',
    badgeText: '#3C3489',
    badgeLabel: 'Upcoming',
    titleColor: '#1F2937',
    descColor: '#6B7280',
    dateColor: '#374151',
    dimmed: false,
  },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const day = d.getDate();
  const month = d.toLocaleString('default', { month: 'short' }).toUpperCase();
  return { day, month };
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
  const cfg = STATUS_CONFIG[item.status] || STATUS_CONFIG.upcoming;
  const { day, month } = formatDate(item.event_date);

  return (
    <View style={[styles.itemRow, cfg.dimmed && styles.dimmed]}>
      {/* Left: date box + spine */}
      <View style={styles.leftCol}>
        <View style={[styles.dateBox, { borderColor: cfg.cardBorder }]}>
          <Text style={[styles.dateMonth, { color: cfg.dateColor }]}>{month}</Text>
          <Text style={[styles.dateDay, { color: cfg.dateColor }]}>{day}</Text>
        </View>
        {!isLast && <View style={styles.spine} />}
      </View>

      {/* Center: dot + line */}
      <View style={styles.dotCol}>
        <View
          style={[
            styles.dot,
            { backgroundColor: cfg.dotColor },
            cfg.dotRing && {
              shadowColor: cfg.dotRing,
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 1,
              shadowRadius: 4,
              elevation: 0,
            },
          ]}
        />
        {!isLast && <View style={styles.dotLine} />}
      </View>

      {/* Right: card */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: cfg.cardBg,
            borderColor: cfg.cardBorder,
          },
        ]}
      >
        <View style={[styles.badge, { backgroundColor: cfg.badgeBg }]}>
          <Text style={[styles.badgeText, { color: cfg.badgeText }]}>
            {cfg.badgeLabel}
          </Text>
        </View>
        <Text style={[styles.cardTitle, { color: cfg.titleColor }]}>
          {item.title}
        </Text>
        <Text style={[styles.cardDesc, { color: cfg.descColor }]}>
          {item.description}
        </Text>
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
      <View style={styles.timelineHeader}>
        <Text style={styles.headerTitle}>Admission Timeline</Text>
        <Text style={styles.headerSub}>CAP 2026 · Engineering</Text>
      </View>

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
