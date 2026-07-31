// src/features/jlpt-practice/sections/MojiGoiSection.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QuestionCard from "../components/QuestionCard";
import ClozePassage from "../components/ClozePassage";

export default function MojiGoiSection({ data, answers, onSelectAnswer, isSubmitted }) {
  const sections = [...(data.section1 || []), ...(data.section2 || [])];

  return (
    <View style={styles.container}>
      {sections.map((section, secIdx) => (
        <View key={secIdx} style={styles.sectionBlock}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>

          {section.type === "clozeTest" ? (
            section.questions?.map((q) => (
              <ClozePassage
                key={q.id}
                question={q}
                answers={answers}
                onSelectAnswer={onSelectAnswer}
                isSubmitted={isSubmitted}
                prefix="cloze"
              />
            ))
          ) : (
            section.questions?.map((q) => (
              <QuestionCard
                key={q.id}
                questionId={q.id}
                questionNumber={q.id}
                questionText={q.question}
                targetWord={q.target}
                options={q.options}
                selectedAnswer={answers[q.id]}
                onSelectAnswer={onSelectAnswer}
                isSubmitted={isSubmitted}
                correctAnswer={q.answer - 1}
                showMissedHighlight={isSubmitted}
              />
            ))
          )}
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
  sectionTitle: { fontSize: 16, fontWeight: "600", color: "#1f2937", lineHeight: 22 },
});
