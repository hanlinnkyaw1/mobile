// src/features/jlpt-practice/sections/ReadingSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QuestionCard from "../components/QuestionCard";

export default function ReadingSection({ data, answers, onSelectAnswer, isSubmitted }) {
  return (
    <View style={styles.container}>
      {(data.section1 || []).map((section, secIdx) => (
        <View key={secIdx} style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>

          {section.passage && (
            <View style={styles.passageCard}>
              <Text style={styles.passageText}>{section.passage}</Text>
            </View>
          )}

          {section.questions?.map((q) => (
            <QuestionCard
              key={`reading-${q.id}`}
              questionId={`reading-${q.id}`}
              questionNumber={q.id}
              questionText={q.question}
              options={q.options}
              selectedAnswer={answers[`reading-${q.id}`]}
              onSelectAnswer={onSelectAnswer}
              isSubmitted={isSubmitted}
              correctAnswer={q.answer - 1}
              showMissedHighlight={isSubmitted}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  sectionBlock: { marginBottom: 24 },
  sectionHeader: {
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: "#2563eb",
    alignSelf: "flex-start",
  },
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937" },
  passageCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    padding: 16,
    marginBottom: 16,
  },
  passageText: { fontSize: 15, lineHeight: 24, color: "#374151" },
});
