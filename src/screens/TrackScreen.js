import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Play, Pause, Square, Dumbbell, Clock, Flame, Plus, Trash2, Check, CheckCircle, ChevronRight } from 'lucide-react-native';
import { WorkoutContext } from '../context/WorkoutContext';
import { PRESETS } from '../data/presets';

const COLORS = {
  primary: '#6366f1',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  danger: '#ef4444',
  secondary: '#8b5cf6',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export default function TrackScreen({ navigation }) {
  const { saveWorkout } = useContext(WorkoutContext);
  
  // State Machine
  const [isActive, setIsActive] = useState(false);
  
  // Active Workout State
  const [workoutName, setWorkoutName] = useState('New Workout');
  const [exercises, setExercises] = useState([]);

  // Calculate live stats
  let totalVolume = 0;
  let setsDone = 0;

  exercises.forEach(ex => {
    ex.sets.forEach(set => {
      if (set.completed) {
        setsDone += 1;
        const w = parseFloat(set.weight) || 0;
        const r = parseInt(set.reps, 10) || 0;
        totalVolume += (w * r);
      }
    });
  });

  const startEmptyWorkout = () => {
    setWorkoutName('Custom Workout');
    setExercises([{
      id: generateId(),
      name: '',
      sets: [{ id: generateId(), weight: '', reps: '', completed: false }]
    }]);
    setIsActive(true);
  };

  const startPresetWorkout = (preset) => {
    setWorkoutName(preset.name);
    
    // Map preset exercises to state shape
    const mappedExercises = preset.exercises.map(exName => ({
      id: generateId(),
      name: exName,
      sets: [{ id: generateId(), weight: '', reps: '', completed: false }] // 1 empty set by default
    }));
    
    setExercises(mappedExercises);
    setIsActive(true);
  };

  const addExercise = () => {
    setExercises([...exercises, {
      id: generateId(),
      name: '',
      sets: [{ id: generateId(), weight: '', reps: '', completed: false }]
    }]);
  };

  const removeExercise = (exId) => {
    setExercises(exercises.filter(ex => ex.id !== exId));
  };

  const updateExerciseName = (exId, name) => {
    setExercises(exercises.map(ex => ex.id === exId ? { ...ex, name } : ex));
  };

  const addSet = (exId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        const lastSet = ex.sets[ex.sets.length - 1];
        return {
          ...ex,
          sets: [...ex.sets, {
            id: generateId(),
            weight: lastSet ? lastSet.weight : '',
            reps: lastSet ? lastSet.reps : '',
            completed: false
          }]
        };
      }
      return ex;
    }));
  };

  const updateSet = (exId, setId, field, value) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(set => set.id === setId ? { ...set, [field]: value } : set)
        };
      }
      return ex;
    }));
  };

  const toggleSetComplete = (exId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return {
          ...ex,
          sets: ex.sets.map(set => set.id === setId ? { ...set, completed: !set.completed } : set)
        };
      }
      return ex;
    }));
  };

  const removeSet = (exId, setId) => {
    setExercises(exercises.map(ex => {
      if (ex.id === exId) {
        return { ...ex, sets: ex.sets.filter(s => s.id !== setId) };
      }
      return ex;
    }));
  };

  const finishWorkout = () => {
    if (setsDone === 0) {
      Alert.alert('No sets completed', 'Please complete at least one set before finishing the workout.');
      return;
    }
    
    const newWorkout = {
      id: generateId(),
      name: workoutName || 'Untitled Workout',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      duration: '45m',
      totalVolume,
      setsDone,
      prs: Math.floor(Math.random() * 3), // random mock PRs for fun
    };
    
    saveWorkout(newWorkout);
    
    // Reset tracker state
    setIsActive(false);
    setWorkoutName('');
    setExercises([]);

    // Navigate to History to see it
    navigation.navigate('History');
  };

  // --- PRE-WORKOUT VIEW ---
  if (!isActive) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Start Workout</Text>
            <Text style={styles.subtitle}>Choose a routine or start fresh.</Text>
          </View>

          <TouchableOpacity style={styles.emptyStartBtn} onPress={startEmptyWorkout}>
            <View style={styles.emptyStartIcon}>
              <Plus color={COLORS.primary} size={28} />
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.emptyStartTitle}>Empty Workout</Text>
              <Text style={styles.emptyStartSub}>Build from scratch</Text>
            </View>
            <ChevronRight color={COLORS.primary} size={24} />
          </TouchableOpacity>

          <View style={styles.presetsHeader}>
            <Text style={styles.sectionTitle}>Presets</Text>
            <Text style={styles.presetsSub}>Tap to load a template</Text>
          </View>

          {PRESETS.map((preset) => (
            <TouchableOpacity key={preset.id} style={styles.presetCard} activeOpacity={0.8} onPress={() => startPresetWorkout(preset)}>
              <View style={styles.presetTop}>
                <Dumbbell color={COLORS.secondary} size={20} />
                <Text style={styles.presetName}>{preset.name}</Text>
              </View>
              <Text style={styles.presetDesc}>{preset.description}</Text>
              
              <View style={styles.presetExBox}>
                <Text style={styles.presetExTitle}>Includes {preset.exercises.length} exercises</Text>
                <Text style={styles.presetExList} numberOfLines={1}>
                  {preset.exercises.join(', ')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // --- ACTIVE WORKOUT VIEW ---
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <TextInput 
              style={styles.titleInput} 
              value={workoutName} 
              onChangeText={setWorkoutName}
              placeholder="Workout Name"
              placeholderTextColor={COLORS.textMuted}
            />
            <Text style={styles.subtitle}>Active Session</Text>
          </View>

          <View style={styles.timerCard}>
            <Text style={styles.timerText}>45:23</Text>
            <View style={styles.timerControls}>
              <TouchableOpacity style={styles.controlBtn}>
                <Pause color={COLORS.text} size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.controlBtn, styles.stopBtn]}>
                <Square color="#fff" size={24} fill="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Dumbbell color={COLORS.primary} size={20} />
              <Text style={styles.statValue}>{totalVolume.toLocaleString()}</Text>
              <Text style={styles.statLabel}>Lbs Lifted</Text>
            </View>
            <View style={styles.statBox}>
              <Clock color={COLORS.primary} size={20} />
              <Text style={styles.statValue}>{setsDone}</Text>
              <Text style={styles.statLabel}>Sets Done</Text>
            </View>
            <View style={styles.statBox}>
              <Flame color={COLORS.primary} size={20} />
              <Text style={styles.statValue}>320</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Exercises</Text>
          
          {exercises.map((ex, index) => (
            <View key={ex.id} style={styles.exerciseCard}>
              <View style={styles.exerciseHeader}>
                <TextInput 
                  style={styles.exerciseNameInput} 
                  value={ex.name}
                  onChangeText={(text) => updateExerciseName(ex.id, text)}
                  placeholder={`Exercise ${index + 1}`}
                  placeholderTextColor={COLORS.textMuted}
                />
                <TouchableOpacity onPress={() => removeExercise(ex.id)} style={styles.deleteExBtn}>
                  <Trash2 color={COLORS.danger} size={18} />
                </TouchableOpacity>
              </View>
              
              <View style={styles.setLabelsRow}>
                <Text style={styles.labelNum}>Set</Text>
                <Text style={styles.labelWeight}>Weight (lbs)</Text>
                <Text style={styles.labelReps}>Reps</Text>
                <View style={styles.labelCheckSpace} />
              </View>

              {ex.sets.map((set, setIndex) => (
                <View key={set.id} style={[styles.setRow, set.completed && styles.setRowCompleted]}>
                  <Text style={styles.setNumber}>{setIndex + 1}</Text>
                  
                  <View style={styles.inputContainer}>
                    <TextInput 
                      style={styles.numInput}
                      value={set.weight}
                      onChangeText={(val) => updateSet(ex.id, set.id, 'weight', val)}
                      keyboardType="numeric"
                      placeholder="--"
                      placeholderTextColor={COLORS.textMuted}
                      editable={!set.completed}
                    />
                  </View>
                  
                  <View style={styles.inputContainer}>
                    <TextInput 
                      style={styles.numInput}
                      value={set.reps}
                      onChangeText={(val) => updateSet(ex.id, set.id, 'reps', val)}
                      keyboardType="numeric"
                      placeholder="--"
                      placeholderTextColor={COLORS.textMuted}
                      editable={!set.completed}
                    />
                  </View>

                  {ex.sets.length > 1 && !set.completed ? (
                    <TouchableOpacity onPress={() => removeSet(ex.id, set.id)} style={styles.delSetBtn}>
                      <Text style={styles.delSetText}>✕</Text>
                    </TouchableOpacity>
                  ) : <View style={styles.delSetBtnSpace} />}

                  <TouchableOpacity 
                    style={[styles.checkBtn, set.completed && styles.checkedBtn]}
                    onPress={() => toggleSetComplete(ex.id, set.id)}
                  >
                    <Check color={set.completed ? '#fff' : COLORS.textMuted} size={18} strokeWidth={3} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={styles.addSetBtn} onPress={() => addSet(ex.id)}>
                <Plus color={COLORS.primary} size={18} />
                <Text style={styles.addSetText}>Add Set</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity style={styles.addExerciseBtn} onPress={addExercise}>
            <Plus color="#fff" size={24} />
            <Text style={styles.addExerciseText}>Add Exercise</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.finishBtn} onPress={finishWorkout}>
            <CheckCircle color="#fff" size={24} />
            <Text style={styles.finishText}>Finish Workout</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingBottom: 40 },
  header: { padding: 20, paddingBottom: 10 },
  greeting: { fontSize: 32, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  titleInput: { fontSize: 28, fontWeight: '800', color: COLORS.text, padding: 0 },
  subtitle: { fontSize: 16, color: COLORS.textMuted, marginTop: 4 },
  
  // Pre-Workout Styles
  emptyStartBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: `${COLORS.primary}10`, marginHorizontal: 20, padding: 20, borderRadius: 20, borderWidth: 2, borderColor: `${COLORS.primary}30`, marginBottom: 32 },
  emptyStartIcon: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  emptyStartTitle: { fontSize: 18, fontWeight: '800', color: COLORS.primary, marginBottom: 4 },
  emptyStartSub: { fontSize: 14, color: COLORS.textMuted, fontWeight: '600' },
  
  presetsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginHorizontal: 20, marginBottom: 16 },
  presetsSub: { fontSize: 14, color: COLORS.textMuted, fontWeight: '500' },
  
  presetCard: { backgroundColor: COLORS.card, marginHorizontal: 20, padding: 20, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.02, shadowRadius: 12, elevation: 1 },
  presetTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  presetName: { fontSize: 18, fontWeight: '800', color: COLORS.text, marginLeft: 10 },
  presetDesc: { fontSize: 14, color: COLORS.textMuted, marginBottom: 16, lineHeight: 20 },
  presetExBox: { backgroundColor: COLORS.background, padding: 12, borderRadius: 12 },
  presetExTitle: { fontSize: 12, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  presetExList: { fontSize: 12, color: COLORS.textMuted },
  
  // Tracker Styles
  timerCard: { margin: 20, padding: 30, backgroundColor: COLORS.card, borderRadius: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12, elevation: 2, borderWidth: 1, borderColor: COLORS.border },
  timerText: { fontSize: 56, fontWeight: '800', color: COLORS.text, fontVariant: ['tabular-nums'] },
  timerControls: { flexDirection: 'row', marginTop: 20, gap: 16 },
  controlBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  stopBtn: { backgroundColor: COLORS.danger, borderColor: COLORS.danger },
  statsRow: { flexDirection: 'row', paddingHorizontal: 20, justifyContent: 'space-between', marginBottom: 24 },
  statBox: { backgroundColor: COLORS.card, padding: 16, borderRadius: 16, width: '30%', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  statValue: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 8 },
  statLabel: { fontSize: 12, color: COLORS.textMuted, marginTop: 2, textAlign: 'center' },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: COLORS.text, marginHorizontal: 20, marginBottom: 12 },
  
  exerciseCard: { marginHorizontal: 20, padding: 16, backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  exerciseNameInput: { flex: 1, fontSize: 18, fontWeight: '700', color: COLORS.text, padding: 0, marginRight: 12 },
  deleteExBtn: { padding: 4 },
  
  setLabelsRow: { flexDirection: 'row', marginBottom: 8, paddingHorizontal: 4 },
  labelNum: { width: 30, fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },
  labelWeight: { flex: 1, fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },
  labelReps: { flex: 1, fontSize: 12, fontWeight: '600', color: COLORS.textMuted, textAlign: 'center' },
  labelCheckSpace: { width: 64 },
  
  setRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, backgroundColor: COLORS.background, borderRadius: 8, paddingVertical: 6, paddingHorizontal: 8 },
  setRowCompleted: { backgroundColor: `${COLORS.success}10` },
  setNumber: { width: 22, fontSize: 14, fontWeight: '700', color: COLORS.textMuted, textAlign: 'center' },
  inputContainer: { flex: 1, marginHorizontal: 4, backgroundColor: COLORS.card, borderRadius: 6, borderWidth: 1, borderColor: COLORS.border },
  numInput: { fontSize: 16, fontWeight: '600', color: COLORS.text, textAlign: 'center', paddingVertical: 8 },
  
  delSetBtn: { width: 24, height: 36, justifyContent: 'center', alignItems: 'center' },
  delSetText: { color: COLORS.danger, fontSize: 14, fontWeight: '800' },
  delSetBtnSpace: { width: 24 },
  
  checkBtn: { width: 36, height: 36, borderRadius: 8, backgroundColor: COLORS.card, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, marginLeft: 4 },
  checkedBtn: { backgroundColor: COLORS.success, borderColor: COLORS.success },
  
  addSetBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, paddingVertical: 10, backgroundColor: `${COLORS.primary}10`, borderRadius: 8 },
  addSetText: { fontSize: 14, fontWeight: '700', color: COLORS.primary, marginLeft: 6 },
  
  addExerciseBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, marginHorizontal: 20, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 10, shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  addExerciseText: { fontSize: 18, fontWeight: '700', color: '#fff', marginLeft: 8 },
  
  finishBtn: { flexDirection: 'row', backgroundColor: COLORS.success, marginHorizontal: 20, borderRadius: 16, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 24, marginBottom: 20, shadowColor: COLORS.success, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  finishText: { fontSize: 18, fontWeight: '800', color: '#fff', marginLeft: 8 },
});
