import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar, ChevronRight, Trophy, Activity } from 'lucide-react-native';
import { WorkoutContext } from '../context/WorkoutContext';

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  warning: '#f59e0b',
};

const WorkoutItem = ({ title, date, duration, prs }) => (
  <TouchableOpacity style={styles.historyCard} activeOpacity={0.7}>
    <View style={styles.historyHeader}>
      <View style={styles.iconBox}>
        <Calendar color={COLORS.primary} size={20} />
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>{title}</Text>
        <Text style={styles.historyDate}>{date} • {duration}</Text>
      </View>
      <ChevronRight color={COLORS.textMuted} size={20} />
    </View>
    {prs > 0 && (
      <View style={styles.prBadge}>
        <Trophy color={COLORS.warning} size={14} />
        <Text style={styles.prText}>{prs} Personal Records</Text>
      </View>
    )}
  </TouchableOpacity>
);

export default function WorkoutHistoryScreen() {
  const { history } = useContext(WorkoutContext);

  const totalWorkouts = history.length;
  const totalPRs = history.reduce((sum, workout) => sum + (workout.prs || 0), 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>History</Text>
          <Text style={styles.subtitle}>Your past triumphs</Text>
        </View>

        <View style={styles.summaryBox}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalWorkouts}</Text>
            <Text style={styles.summaryLabel}>Workouts</Text>
            <Text style={styles.summarySub}>Logged</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalPRs}</Text>
            <Text style={styles.summaryLabel}>New PRs</Text>
            <Text style={styles.summarySub}>Logged</Text>
          </View>
        </View>

        <View style={styles.listContainer}>
          {history.length === 0 ? (
            <View style={styles.emptyState}>
              <Activity color={COLORS.textMuted} size={48} />
              <Text style={styles.emptyTitle}>No workouts yet</Text>
              <Text style={styles.emptySub}>Go to the Track tab to log your first session!</Text>
            </View>
          ) : (
            history.map(workout => (
              <WorkoutItem 
                key={workout.id}
                title={workout.name} 
                date={workout.date} 
                duration={workout.duration} 
                prs={workout.prs} 
              />
            ))
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 16, color: COLORS.textMuted, marginTop: 4 },
  summaryBox: { marginHorizontal: 20, marginBottom: 24, flexDirection: 'row', backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: COLORS.border, marginHorizontal: 16 },
  summaryValue: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  summaryLabel: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted, marginTop: 4 },
  summarySub: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 40 },
  historyCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8, elevation: 1 },
  historyHeader: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: `${COLORS.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  historyInfo: { flex: 1 },
  historyTitle: { fontSize: 16, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  historyDate: { fontSize: 14, color: COLORS.textMuted },
  prBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${COLORS.warning}15`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, alignSelf: 'flex-start', marginTop: 12, marginLeft: 64 },
  prText: { fontSize: 12, fontWeight: '600', color: COLORS.warning, marginLeft: 6 },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptySub: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' }
});
