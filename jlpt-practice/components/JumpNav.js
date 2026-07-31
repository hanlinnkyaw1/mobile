// src/features/jlpt-practice/components/JumpNav.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function JumpNav({ questions, onJump }) {
  return (
    <View style={styles.container}>
      {questions.map((q) => (
        <TouchableOpacity
          key={q.id}
          style={[styles.dot, q.answered && styles.dotComplete]}
          onPress={() => onJump(q.id)}
        >
          <Text style={[styles.dotText, q.answered && styles.dotTextComplete]}>
            {q.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    right: 8,
    top: "30%",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 6,
    gap: 4,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
  },
  dot: {
    width: 30,
    height: 30,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },
  dotComplete: { backgroundColor: "#22c55e", borderColor: "#22c55e" },
  dotText: { fontSize: 11, fontWeight: "700", color: "#6b7280" },
  dotTextComplete: { color: "#fff" },
});
