import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, TextInput, LayoutAnimation, Platform, UIManager } from 'react-native';
import { Search, ChevronDown, ChevronRight, Dumbbell, Filter, Info, Target, Zap } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const COLORS = {
  primary: '#6366f1',
  secondary: '#8b5cf6',
  background: '#f8fafc',
  card: '#ffffff',
  text: '#0f172a',
  textMuted: '#64748b',
  border: '#e2e8f0',
};

import { EXERCISES } from '../data/exercises';

export default function ExerciseLibraryScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  // Filter exercises based on search query
  const filteredExercises = EXERCISES.filter(ex => {
    const query = searchQuery.toLowerCase();
    return ex.name.toLowerCase().includes(query) || ex.muscle.toLowerCase().includes(query);
  });

  const renderItem = ({ item }) => {
    const isExpanded = expandedId === item.id;

    return (
      <TouchableOpacity 
        style={[styles.exerciseCard, isExpanded && styles.exerciseCardExpanded]} 
        activeOpacity={0.8}
        onPress={() => toggleExpand(item.id)}
      >
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Dumbbell color={COLORS.primary} size={24} />
          </View>
          <View style={styles.exerciseInfo}>
            <Text style={styles.exerciseName}>{item.name}</Text>
            <View style={styles.tagsContainer}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{item.muscle}</Text>
              </View>
              <View style={[styles.tag, { backgroundColor: '#f1f5f9' }]}>
                <Text style={[styles.tagText, { color: COLORS.textMuted }]}>{item.category}</Text>
              </View>
            </View>
          </View>
          <View style={styles.chevronContainer}>
            {isExpanded ? (
              <ChevronDown color={COLORS.primary} size={24} />
            ) : (
              <ChevronRight color={COLORS.textMuted} size={24} />
            )}
          </View>
        </View>

        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.divider} />
            
            <View style={styles.detailRow}>
              <Target color={COLORS.secondary} size={18} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailTitle}>Secondary Muscles</Text>
                <Text style={styles.detailBody}>{item.secondary}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Zap color="#f59e0b" size={18} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailTitle}>Benefits</Text>
                <Text style={styles.detailBody}>{item.benefits}</Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <Info color={COLORS.primary} size={18} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailTitle}>How To Perform</Text>
                <Text style={styles.detailBody}>{item.description}</Text>
              </View>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Library</Text>
        <Text style={styles.subtitle}>Discover your next challenge</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color={COLORS.textMuted} size={20} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search exercises or muscles..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterBtn}>
          <Filter color="#fff" size={20} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredExercises}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Dumbbell color={COLORS.textMuted} size={48} />
            <Text style={styles.emptyTitle}>No exercises found</Text>
            <Text style={styles.emptySub}>Try searching for a different term.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { padding: 20, paddingBottom: 10 },
  title: { fontSize: 32, fontWeight: '800', color: COLORS.text },
  subtitle: { fontSize: 16, color: COLORS.textMuted, marginTop: 4 },
  
  searchContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 20, gap: 12 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 16, paddingHorizontal: 16, height: 56, borderWidth: 1, borderColor: COLORS.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.02, shadowRadius: 8, elevation: 1 },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: COLORS.text },
  filterBtn: { width: 56, height: 56, backgroundColor: COLORS.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  
  listContent: { paddingHorizontal: 20, paddingBottom: 40 },
  
  exerciseCard: { backgroundColor: COLORS.card, borderRadius: 20, marginBottom: 16, borderWidth: 1, borderColor: COLORS.border, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 12, elevation: 2 },
  exerciseCardExpanded: { borderColor: COLORS.primary, borderWidth: 2 },
  
  cardHeader: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  iconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: `${COLORS.primary}15`, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  
  tagsContainer: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: `${COLORS.primary}15`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  tagText: { fontSize: 12, fontWeight: '700', color: COLORS.primary },
  
  chevronContainer: { padding: 8 },
  
  expandedContent: { paddingHorizontal: 20, paddingBottom: 24, paddingTop: 4 },
  divider: { height: 1, backgroundColor: COLORS.border, marginBottom: 20 },
  
  detailRow: { flexDirection: 'row', marginBottom: 20 },
  detailTextContainer: { flex: 1, marginLeft: 16 },
  detailTitle: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  detailBody: { fontSize: 14, color: COLORS.textMuted, lineHeight: 20 },
  
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: COLORS.text, marginTop: 16 },
  emptySub: { fontSize: 14, color: COLORS.textMuted, marginTop: 8, textAlign: 'center' }
});
