// src/features/jlpt-practice/components/ScoreCard.js
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ScoreCard({ result, time }) {
  const percentage = ((result.total.score / result.total.max) * 100).toFixed(1);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <View style={[styles.container, result.passed ? styles.passContainer : styles.failContainer]}>
      <View style={[styles.badge, result.passed ? styles.passBadge : styles.failBadge]}>
        <Text style={styles.badgeText}>{result.passed ? "PASSED" : "FAILED"}</Text>
      </View>

      <View style={styles.scoresRow}>
        <ScoreBlock
          label="Vocab / Grammar"
          score={result.vocabGrammar.score}
          max={result.vocabGrammar.max}
          passed={result.vocabGrammar.passed}
        />
        <View style={styles.divider} />
        <ScoreBlock
          label="Reading"
          score={result.reading.score}
          max={result.reading.max}
          passed={result.reading.passed}
        />
        <View style={styles.divider} />
        <ScoreBlock
          label="Listening"
          score={result.listening.score}
          max={result.listening.max}
          passed={result.listening.passed}
        />
        <View style={styles.divider} />
        <ScoreBlock
          label="Total"
          score={result.total.score}
          max={result.total.max}
          passed={result.passed}
          isTotal
        />
      </View>

      <Text style={styles.detail}>
        {result.passed
          ? `Congratulations! You passed with ${result.total.score}/180. Time: ${formatTime(time)}`
          : `You scored ${result.total.score}/180. Each section needs ≥19 and total ≥100 to pass. Time: ${formatTime(time)}`}
      </Text>
    </View>
  );
}

function ScoreBlock({ label, score, max, passed, isTotal }) {
  return (
    <View style={styles.block}>
      <Text style={styles.blockLabel}>{label}</Text>
      <Text style={[styles.blockScore, isTotal && styles.totalScore]}>
        {score} / {max}
      </Text>
      <Text style={[styles.blockStatus, passed ? styles.statusPass : styles.statusFail]}>
        {passed ? "✓ Pass" : "✗ Fail"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 720,
    marginTop: 16,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  passContainer: { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#bbf7d0" },
  failContainer: { backgroundColor: "#fff1f2", borderWidth: 1, borderColor: "#fecdd3" },
  badge: { paddingHorizontal: 16, paddingVertical: 6, borderRadius: 9999, marginBottom: 14 },
  passBadge: { backgroundColor: "#166534" },
  failBadge: { backgroundColor: "#be123c" },
  badgeText: { color: "#fff", fontSize: 14, fontWeight: "800", letterSpacing: 0.8 },
  scoresRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "stretch",
    flexWrap: "wrap",
    gap: 16,
  },
  block: { minWidth: 100, alignItems: "center" },
  blockLabel: { fontSize: 12, fontWeight: "600", color: "#64748b", marginBottom: 4 },
  blockScore: { fontSize: 22, fontWeight: "700", color: "#0f172a" },
  totalScore: { color: "#1d4ed8" },
  blockStatus: { marginTop: 4, fontSize: 11, fontWeight: "700" },
  statusPass: { color: "#15803d" },
  statusFail: { color: "#be123c" },
  divider: { width: 1, height: 48, backgroundColor: "#e2e8f0", alignSelf: "center" },
  detail: {
    marginTop: 14,
    fontSize: 13,
    color: "#475569",
    lineHeight: 18,
    textAlign: "center",
  },
});
