import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { learningQuiz } from '../data/quiz';

export default function LearningScreen() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const current = learningQuiz[index];

  const next = () => {
    setSelected(null);
    setIndex((prev) => (prev + 1) % learningQuiz.length);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Learning Hub</Text>
      <Text style={styles.counter}>Question {index + 1} / {learningQuiz.length}</Text>
      <View style={styles.card}>
        <Text style={styles.question}>{current.question}</Text>

        {current.options.map((option) => {
          const isCorrect = option === current.answer;
          const isSelected = selected === option;

          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                isSelected && (isCorrect ? styles.correct : styles.wrong),
              ]}
              onPress={() => setSelected(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity style={styles.button} onPress={next}>
        <Text style={styles.buttonText}>Next question</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b1020', padding: 20 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700', marginBottom: 8 },
  counter: { color: '#9aa3c7', marginBottom: 16 },
  card: { backgroundColor: '#0f1724', borderRadius: 14, padding: 16 },
  question: { color: '#fff', fontSize: 18, fontWeight: '700', marginBottom: 16 },
  option: {
    backgroundColor: '#111827',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#1f2937',
  },
  optionText: { color: '#e2e8f0' },
  correct: { borderColor: '#34d399', backgroundColor: '#0f2d26' },
  wrong: { borderColor: '#f87171', backgroundColor: '#3b1d1d' },
  button: {
    marginTop: 18,
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
