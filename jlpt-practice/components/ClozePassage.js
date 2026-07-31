// src/features/jlpt-practice/components/ClozePassage.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import QuestionCard from "./QuestionCard";

export default function ClozePassage({ question, answers, onSelectAnswer, isSubmitted, prefix }) {
  return (
    <View style={styles.container}>
      <View style={styles.passageCard}>
        <Text style={styles.passageText}>{question.passage}</Text>
      </View>
      {question.blanks?.map((blank) => {
        const qId = `${prefix}-${question.id}-${blank.number}`;
        return (
          <QuestionCard
            key={qId}
            questionId={qId}
            questionNumber={blank.number}
            questionText={`(${blank.number})`}
            options={blank.options}
            selectedAnswer={answers[qId]}
            onSelectAnswer={onSelectAnswer}
            isSubmitted={isSubmitted}
            correctAnswer={blank.answer - 1}
            showMissedHighlight={isSubmitted}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  passageCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    backgroundColor: "#f9fafb",
    padding: 16,
    marginBottom: 12,
  },
  passageText: { fontSize: 15, lineHeight: 24, color: "#374151" },
});
