import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { Activity, History, Timer, Dumbbell, ChevronRight, Play, Plus, TrendingUp } from 'lucide-react-native';
import { WorkoutContext } from '../context/WorkoutContext';
import { EXERCISES } from '../data/exercises';
import ProgressModal from '../components/ProgressModal';

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
};

const Widget = ({ title, icon: Icon, color, children, onPress }) => (
  <TouchableOpacity style={styles.widget} activeOpacity={0.7} onPress={onPress}>
    <View style={styles.widgetHeader}>
      <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
        <Icon color={color} size={24} />
      </View>
      <View style={styles.widgetTitleContainer}>
        <Text style={styles.widgetTitle}>{title}</Text>
        <ChevronRight color={COLORS.textMuted} size={20} />
      </View>
    </View>
    <View style={styles.widgetContent}>
      {children}
    </View>
  </TouchableOpacity>
);

export default function DashboardScreen({ navigation }) {
  const { history } = useContext(WorkoutContext);
  const [isProgressVisible, setProgressVisible] = useState(false);

  // Calculate dynamic history stats
  const totalWorkouts = history.length;
  const totalVolume = history.reduce((sum, w) => sum + (w.totalVolume || 0), 0);
  
  // Format total volume nicely (e.g. 12,400)
  const formattedVolume = totalVolume.toLocaleString();
  
  // Calculate total duration (assuming '45m' strings, we'll just mock it based on totalWorkouts for this example, e.g., 45 mins per workout)
  const totalMinutes = totalWorkouts * 45;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const formattedDuration = totalMinutes > 0 ? `${hours}h ${minutes}m` : '0h 0m';

  // Determine last workout
  const lastWorkout = history.length > 0 ? history[0] : null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.header}>
          <Text style={styles.greeting}>Ready to crush it?</Text>
          <Text style={styles.subtitle}>Here is your live fitness summary.</Text>
        </View>

        {/* Progress Widget */}
        <Widget 
          title="Personal Progress" 
          icon={TrendingUp} 
          color={COLORS.secondary}
          onPress={() => setProgressVisible(true)}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <Text style={{ fontSize: 14, color: COLORS.textMuted }}>Weight, Photos, 1RM Analytics</Text>
            <View style={{ backgroundColor: `${COLORS.secondary}20`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: COLORS.secondary }}>View</Text>
            </View>
          </View>
        </Widget>

        {/* Track Widget */}
        <Widget 
          title="Active Session" 
          icon={Activity} 
          color={COLORS.primary}
          onPress={() => navigation.navigate('Track')}
        >
          {lastWorkout ? (
            <View style={styles.trackCard}>
              <View>
                <Text style={styles.trackTitle}>Next up: Custom Workout</Text>
                <Text style={styles.trackSub}>Last did: {lastWorkout.name}</Text>
              </View>
              <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('Track')}>
                <Play color="#fff" size={20} fill="#fff" style={{ marginLeft: 3 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.trackCardEmpty}>
              <View style={styles.emptyCircle}>
                <Dumbbell color={COLORS.primary} size={24} />
              </View>
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.trackTitle}>No workouts yet</Text>
                <Text style={styles.trackSub}>Start tracking your first session</Text>
              </View>
              <TouchableOpacity style={styles.playButton} onPress={() => navigation.navigate('Track')}>
                <Plus color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          )}
        </Widget>

        {/* History Widget */}
        <Widget 
          title="Recent History" 
          icon={History} 
          color={COLORS.success}
          onPress={() => navigation.navigate('History')}
        >
          <View style={styles.historyRow}>
            <View style={styles.historyStat}>
              <Text style={styles.statValue}>{totalWorkouts}</Text>
              <Text style={styles.statLabel}>Workouts</Text>
              <Text style={styles.statSub}>Total Logged</Text>
            </View>
            <View style={styles.historyDivider} />
            <View style={styles.historyStat}>
              <Text style={styles.statValue}>{formattedDuration}</Text>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statSub}>Total Time</Text>
            </View>
            <View style={styles.historyDivider} />
            <View style={styles.historyStat}>
              <Text style={styles.statValue}>{formattedVolume}</Text>
              <Text style={styles.statLabel}>Volume (lbs)</Text>
              <Text style={styles.statSub}>Total Lifted</Text>
            </View>
          </View>
        </Widget>

        <View style={styles.row}>
          {/* Timer Widget */}
          <View style={styles.halfWidget}>
            <Widget 
              title="Quick Timer" 
              icon={Timer} 
              color={COLORS.warning}
              onPress={() => navigation.navigate('Timer')}
            >
              <Text style={styles.timerDisplay}>01:30</Text>
              <Text style={styles.timerSub}>Standard Rest</Text>
            </Widget>
          </View>

          {/* Library Widget */}
          <View style={styles.halfWidget}>
            <Widget 
              title="Library" 
              icon={Dumbbell} 
              color={COLORS.secondary}
              onPress={() => navigation.navigate('Library')}
            >
              <Text style={styles.libraryDisplay}>{EXERCISES.length}</Text>
              <Text style={styles.librarySub}>Exercises</Text>
            </Widget>
          </View>
        </View>

      </ScrollView>
      <ProgressModal visible={isProgressVisible} onClose={() => setProgressVisible(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textMuted,
  },
  widget: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  widgetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  widgetTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  widgetContent: {
    marginTop: 4,
  },
  trackCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: `${COLORS.primary}10`,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: `${COLORS.primary}20`,
  },
  trackCardEmpty: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emptyCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: `${COLORS.primary}10`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 4,
  },
  trackSub: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  historyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  historyStat: {
    alignItems: 'center',
    flex: 1,
  },
  historyDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  statSub: {
    fontSize: 10,
    color: '#94a3b8',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidget: {
    width: '48%',
  },
  timerDisplay: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  timerSub: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
  libraryDisplay: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  librarySub: {
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
