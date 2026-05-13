import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Clipboard } from 'react-native';
import { findMatches, assemblePrompt, detectIncomeIntent } from '../shared-logic/engine';

export default function App() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState([]);

  const handleGenerate = () => {
    const matches = findMatches(input);
    setResults(matches);
    if (matches.length === 0) {
      Alert.alert("No matches found", "Try keywords like 'SaaS' or 'Notion'.");
    }
  };

  const handleSelect = (item) => {
    const isIncomeOriented = detectIncomeIntent(input);
    const finalPrompt = assemblePrompt(
      item.template,
      input,
      isIncomeOriented ? "Focus on scalable revenue model and automation." : ""
    );
    Clipboard.setString(finalPrompt);
    Alert.alert("Success", "Prompt copied to clipboard! Ready for your favorite AI.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PromptForge Income Builder</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe your income asset idea..."
        value={input}
        onChangeText={setInput}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleGenerate}>
        <Text style={styles.buttonText}>Generate Income Prompts</Text>
      </TouchableOpacity>
      
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardMeta}>{item.category}</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Passive Score: {item.passiveScore}/10</Text>
            </View>
          </TouchableOpacity>
        )}
        style={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb', padding: 20, paddingTop: 60 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 20 },
  input: { backgroundColor: '#fff', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db', height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#2563eb', padding: 15, borderRadius: 10, marginTop: 15, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  list: { marginTop: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#e5e7eb' },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1f2937' },
  cardMeta: { fontSize: 14, color: '#6b7280', marginTop: 4 },
  badge: { backgroundColor: '#ecfdf5', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 5, marginTop: 8, alignSelf: 'flex-start' },
  badgeText: { color: '#059669', fontSize: 12, fontWeight: '700' }
});
