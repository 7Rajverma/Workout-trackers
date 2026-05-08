import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Vibration } from 'react-native';
import { Play, Pause, RotateCcw, Plus, Minus } from 'lucide-react-native';

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  danger: '#ef4444',
  success: '#10b981',
};

const MODES = {
  Rest: { time: 90, label: 'Rest Time' },
  AMRAP: { time: 600, label: 'As Many Reps As Possible' },
  EMOM: { time: 60, label: 'Every Minute On Minute' },
  Tabata: { time: 20, label: 'Work Interval' },
};

export default function TimerScreen() {
  const [mode, setMode] = useState('Rest');
  const [timeLeft, setTimeLeft] = useState(MODES['Rest'].time);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      Vibration.vibrate([500, 500, 500]); // Vibrate when done
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleModeChange = (newMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(MODES[newMode].time);
  };

  const handleReset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(MODES[mode].time);
  }, [mode]);

  const adjustTime = (amount) => {
    setTimeLeft(prev => {
      const newTime = prev + amount;
      return newTime > 0 ? newTime : 0;
    });
  };

  const toggleTimer = () => {
    if (timeLeft > 0) {
      setIsRunning(!isRunning);
    }
  };

  // Format time (e.g. 600 -> 10:00)
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Timer</Text>
      </View>

      <View style={styles.modeSelector}>
        {Object.keys(MODES).map((m) => (
          <TouchableOpacity 
            key={m} 
            style={[styles.modeTab, mode === m && styles.modeTabActive]}
            onPress={() => handleModeChange(m)}
          >
            <Text style={[styles.modeText, mode === m && styles.modeTextActive]}>{m}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.timerDisplayContainer}>
        <View style={styles.timerCircle}>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
          <Text style={styles.timerLabel}>{MODES[mode].label}</Text>
        </View>
      </View>

      <View style={styles.adjustmentRow}>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(-15)}>
          <Minus color={COLORS.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.adjustText}>15 sec</Text>
        <TouchableOpacity style={styles.adjustBtn} onPress={() => adjustTime(15)}>
          <Plus color={COLORS.text} size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <RotateCcw color={COLORS.textMuted} size={24} />
          <Text style={styles.resetText}>Reset</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.playBtn, isRunning && styles.pauseBtn]} onPress={toggleTimer}>
          {isRunning ? (
            <Pause color="#fff" size={32} fill="#fff" />
          ) : (
            <Play color="#fff" size={32} fill="#fff" style={{ marginLeft: 4 }} />
          )}
        </TouchableOpacity>
        
        <View style={styles.spacer} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.text },
  modeSelector: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: COLORS.card, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: COLORS.border },
  modeTab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  modeTabActive: { backgroundColor: COLORS.primary },
  modeText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  modeTextActive: { color: '#fff' },
  timerDisplayContainer: { alignItems: 'center', marginVertical: 40 },
  timerCircle: { width: 280, height: 280, borderRadius: 140, backgroundColor: COLORS.card, borderWidth: 8, borderColor: `${COLORS.primary}30`, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  timerValue: { fontSize: 72, fontWeight: '800', color: COLORS.text, fontVariant: ['tabular-nums'] },
  timerLabel: { fontSize: 18, color: COLORS.textMuted, marginTop: 8 },
  adjustmentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 40 },
  adjustBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  adjustText: { fontSize: 16, fontWeight: '600', color: COLORS.textMuted },
  controlsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 40 },
  resetBtn: { alignItems: 'center', justifyContent: 'center' },
  resetText: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, fontWeight: '600' },
  playBtn: { width: 88, height: 88, borderRadius: 44, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  pauseBtn: { backgroundColor: COLORS.danger, shadowColor: COLORS.danger },
  spacer: { width: 40 }
});
