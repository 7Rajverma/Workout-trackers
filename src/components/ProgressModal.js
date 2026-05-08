import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, ScrollView, TextInput, Image, FlatList } from 'react-native';
import { X, Camera, TrendingUp, Scale, Ruler } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
};

const MOCK_GRAPH_DATA = [40, 60, 55, 80, 100, 90, 120];

export default function ProgressModal({ visible, onClose }) {
  const [activeTab, setActiveTab] = useState('Metrics'); // Metrics, Photos, Analytics
  
  // State for Metrics
  const [weight, setWeight] = useState('');
  const [logs, setLogs] = useState([
    { id: '1', date: 'Oct 1', weight: '180' },
    { id: '2', date: 'Oct 15', weight: '178' },
  ]);

  // State for Photos
  const [photos, setPhotos] = useState([]);

  // State for Analytics
  const [reps, setReps] = useState('8');
  const [liftWeight, setLiftWeight] = useState('225');
  
  // Calculate 1RM using Epley Formula: Weight * (1 + 0.0333 * Reps)
  const calculate1RM = () => {
    const w = parseFloat(liftWeight) || 0;
    const r = parseInt(reps) || 0;
    if (r === 1) return w;
    return Math.round(w * (1 + 0.0333 * r));
  };

  const handleAddLog = () => {
    if (weight) {
      setLogs([{ id: Date.now().toString(), date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), weight }, ...logs]);
      setWeight('');
    }
  };

  const pickImage = async () => {
    // Request permissions
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotos([{ id: Date.now().toString(), uri: result.assets[0].uri, date: new Date().toLocaleDateString() }, ...photos]);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Metrics':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>Log Body Weight</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputWrapper}>
                <Scale color={COLORS.textMuted} size={20} />
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 175" 
                  keyboardType="numeric"
                  value={weight}
                  onChangeText={setWeight}
                />
                <Text style={styles.inputSuffix}>lbs</Text>
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={handleAddLog}>
                <Text style={styles.addBtnText}>Save Log</Text>
              </TouchableOpacity>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 32 }]}>Recent Logs</Text>
            {logs.map(log => (
              <View key={log.id} style={styles.logCard}>
                <Text style={styles.logDate}>{log.date}</Text>
                <Text style={styles.logWeight}>{log.weight} lbs</Text>
              </View>
            ))}
          </View>
        );
      
      case 'Photos':
        return (
          <View style={styles.tabContent}>
            <TouchableOpacity style={styles.uploadBtn} onPress={pickImage}>
              <Camera color="#fff" size={24} />
              <Text style={styles.uploadBtnText}>Upload Progress Photo</Text>
            </TouchableOpacity>

            {photos.length === 0 ? (
              <View style={styles.emptyPhotos}>
                <Camera color={COLORS.textMuted} size={48} />
                <Text style={styles.emptyText}>No photos yet.</Text>
                <Text style={styles.emptySub}>Take a picture to track your physique.</Text>
              </View>
            ) : (
              <FlatList 
                data={photos}
                keyExtractor={item => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.photoList}
                renderItem={({ item }) => (
                  <View style={styles.photoCard}>
                    <Image source={{ uri: item.uri }} style={styles.photoImg} />
                    <Text style={styles.photoDate}>{item.date}</Text>
                  </View>
                )}
              />
            )}
          </View>
        );
        
      case 'Analytics':
        return (
          <View style={styles.tabContent}>
            <View style={styles.analyticsCard}>
              <View style={styles.analyticsHeader}>
                <TrendingUp color={COLORS.primary} size={24} />
                <Text style={styles.analyticsTitle}>Volume Progression</Text>
              </View>
              <Text style={styles.analyticsSub}>Past 7 Workouts</Text>
              
              <View style={styles.graphContainer}>
                {MOCK_GRAPH_DATA.map((val, i) => (
                  <View key={i} style={styles.barWrapper}>
                    <View style={[styles.bar, { height: val }]} />
                  </View>
                ))}
              </View>
            </View>

            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>1RM Calculator (Epley)</Text>
            <View style={styles.calcRow}>
              <View style={styles.calcInputBox}>
                <Text style={styles.calcLabel}>Weight (lbs)</Text>
                <TextInput style={styles.calcInput} value={liftWeight} onChangeText={setLiftWeight} keyboardType="numeric" />
              </View>
              <Text style={styles.calcX}>×</Text>
              <View style={styles.calcInputBox}>
                <Text style={styles.calcLabel}>Reps</Text>
                <TextInput style={styles.calcInput} value={reps} onChangeText={setReps} keyboardType="numeric" />
              </View>
            </View>
            
            <View style={styles.rmResultBox}>
              <Text style={styles.rmLabel}>Estimated 1 Rep Max</Text>
              <Text style={styles.rmValue}>{calculate1RM()} lbs</Text>
            </View>
          </View>
        );
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Personal Progress</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <X color={COLORS.text} size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.tabBar}>
          {['Metrics', 'Photos', 'Analytics'].map(tab => (
            <TouchableOpacity 
              key={tab} 
              style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {renderTabContent()}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: { flex: 1, backgroundColor: COLORS.background },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  closeBtn: { padding: 8, backgroundColor: COLORS.card, borderRadius: 20 },
  
  tabBar: { flexDirection: 'row', marginHorizontal: 20, backgroundColor: COLORS.card, borderRadius: 12, padding: 4, borderWidth: 1, borderColor: COLORS.border, marginBottom: 20 },
  tabBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  tabBtnActive: { backgroundColor: COLORS.primary },
  tabText: { fontSize: 14, fontWeight: '600', color: COLORS.textMuted },
  tabTextActive: { color: '#fff' },

  tabContent: { paddingHorizontal: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 12 },
  
  inputRow: { flexDirection: 'row', gap: 12 },
  inputWrapper: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: COLORS.border },
  input: { flex: 1, marginLeft: 12, fontSize: 18, color: COLORS.text, paddingVertical: 16 },
  inputSuffix: { fontSize: 16, color: COLORS.textMuted, fontWeight: '600' },
  addBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 12 },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  logCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: COLORS.card, padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border },
  logDate: { fontSize: 16, color: COLORS.textMuted },
  logWeight: { fontSize: 18, fontWeight: '700', color: COLORS.text },

  uploadBtn: { flexDirection: 'row', backgroundColor: COLORS.primary, borderRadius: 16, padding: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  uploadBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 12 },
  
  emptyPhotos: { alignItems: 'center', marginTop: 40 },
  emptyText: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptySub: { fontSize: 14, color: COLORS.textMuted, marginTop: 8 },

  photoList: { paddingVertical: 8, gap: 16 },
  photoCard: { width: 200, backgroundColor: COLORS.card, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: COLORS.border },
  photoImg: { width: '100%', height: 260, backgroundColor: '#e2e8f0' },
  photoDate: { padding: 12, textAlign: 'center', fontWeight: '600', color: COLORS.textMuted },

  analyticsCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: COLORS.border },
  analyticsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  analyticsTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginLeft: 8 },
  analyticsSub: { fontSize: 14, color: COLORS.textMuted, marginBottom: 24 },
  
  graphContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 120, paddingTop: 10 },
  barWrapper: { flex: 1, alignItems: 'center' },
  bar: { width: 24, backgroundColor: COLORS.primary, borderRadius: 4 },

  calcRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  calcInputBox: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: COLORS.border },
  calcLabel: { fontSize: 12, color: COLORS.textMuted, marginBottom: 4, fontWeight: '600' },
  calcInput: { fontSize: 24, fontWeight: '800', color: COLORS.text },
  calcX: { fontSize: 24, fontWeight: '800', color: COLORS.textMuted },

  rmResultBox: { marginTop: 24, backgroundColor: `${COLORS.success}15`, padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: `${COLORS.success}30` },
  rmLabel: { fontSize: 14, fontWeight: '700', color: COLORS.success, marginBottom: 4 },
  rmValue: { fontSize: 48, fontWeight: '800', color: COLORS.success },
});
