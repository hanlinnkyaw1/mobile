// src/features/jlpt-practice/components/QuestionCard.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function QuestionCard({
  questionId,
  questionNumber,
  questionText,
  targetWord,
  options,
  selectedAnswer,
  onSelectAnswer,
  isSubmitted,
  correctAnswer,
  showMissedHighlight,
}) {
  const isMissed = showMissedHighlight && selectedAnswer === undefined;
  const isCorrect = isSubmitted && selectedAnswer === correctAnswer;
  const isIncorrect = isSubmitted && selectedAnswer !== undefined && selectedAnswer !== correctAnswer;

  const cleanOptions = options.map((opt) => opt.replace(/^[1-4]\s+/, ""));

  return (
    <View
      style={[
        styles.container,
        isMissed && styles.missedContainer,
        isCorrect && styles.correctContainer,
        isIncorrect && styles.incorrectContainer,
      ]}
    >
      {isMissed && (
        <View style={styles.missedBadge}>
          <Text style={styles.missedBadgeText}>Not answered</Text>
        </View>
      )}

      <View style={styles.questionRow}>
        <View style={styles.numberBadge}>
          <Text style={styles.numberText}>{questionNumber}</Text>
        </View>
        <View style={{ flex: 1 }}>
          {targetWord && <Text style={styles.targetText}>Target: {targetWord}</Text>}
          <Text style={styles.questionText}>{questionText}</Text>
        </View>
      </View>

      <View style={styles.optionsContainer}>
        {cleanOptions.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrectOption = isSubmitted && index === correctAnswer;
          const isWrongSelection = isSubmitted && isSelected && index !== correctAnswer;

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                isSelected && !isSubmitted && styles.selectedOption,
                isCorrectOption && styles.correctOption,
                isWrongSelection && styles.incorrectOption,
              ]}
              onPress={() => onSelectAnswer(questionId, index)}
              disabled={isSubmitted}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.optionCircle,
                  isSelected && !isSubmitted && styles.selectedCircle,
                  isCorrectOption && styles.correctCircle,
                  isWrongSelection && styles.incorrectCircle,
                ]}
              >
                <Text
                  style={[
                    styles.optionCircleText,
                    isSelected && !isSubmitted && styles.selectedCircleText,
                    isCorrectOption && styles.correctCircleText,
                    isWrongSelection && styles.incorrectCircleText,
                  ]}
                >
                  {String.fromCharCode(65 + index)}
                </Text>
              </View>
              <Text
                style={[
                  styles.optionText,
                  isSelected && !isSubmitted && styles.selectedOptionText,
                  isCorrectOption && styles.correctOptionText,
                  isWrongSelection && styles.incorrectOptionText,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  missedContainer: {
    backgroundColor: "#fef9c3",
    borderColor: "#eab308",
    borderWidth: 2,
  },
  correctContainer: { borderColor: "#22c55e" },
  incorrectContainer: { borderColor: "#ef4444" },
  missedBadge: {
    position: "absolute",
    top: -10,
    left: 10,
    backgroundColor: "#eab308",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 1,
  },
  missedBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  questionRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 12, gap: 10 },
  numberBadge: {
    width: 28,
    height: 28,
    backgroundColor: "#1f2937",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  numberText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  targetText: { fontSize: 12, color: "#6b7280", marginBottom: 2, fontWeight: "600" },
  questionText: { fontSize: 15, fontWeight: "500", color: "#374151", lineHeight: 22 },
  optionsContainer: { gap: 10 },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  selectedOption: { borderColor: "#3b82f6", backgroundColor: "#eff6ff" },
  correctOption: { backgroundColor: "#dcfce7", borderColor: "#22c55e" },
  incorrectOption: { backgroundColor: "#fee2e2", borderColor: "#ef4444" },
  optionCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  selectedCircle: { borderColor: "#3b82f6" },
  correctCircle: { borderColor: "#22c55e", backgroundColor: "#22c55e" },
  incorrectCircle: { borderColor: "#ef4444", backgroundColor: "#ef4444" },
  optionCircleText: { fontSize: 11, fontWeight: "700", color: "#9ca3af" },
  selectedCircleText: { color: "#3b82f6" },
  correctCircleText: { color: "#fff" },
  incorrectCircleText: { color: "#fff" },
  optionText: { flex: 1, fontSize: 15, color: "#4b5563", lineHeight: 20 },
  selectedOptionText: { color: "#1d4ed8", fontWeight: "700" },
  correctOptionText: { color: "#166534", fontWeight: "600" },
  incorrectOptionText: { color: "#991b1b", fontWeight: "600" },
});
