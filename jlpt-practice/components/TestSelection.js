// src/features/jlpt-practice/components/TestSelection.js
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";

const LEVELS = [
  { level: "N1", tests: [1, 2, 3], desc: "Advanced", time: "~110 min" },
  { level: "N2", tests: [1, 2, 3], desc: "Upper-Int", time: "~105 min" },
  { level: "N3", tests: [1, 2, 3], desc: "Intermediate", time: "~100 min" },
  { level: "N4", tests: [1, 2, 3], desc: "Elementary", time: "~75 min" },
  { level: "N5", tests: [1, 2, 3], desc: "Beginner", time: "~60 min" },
];

export default function TestSelection({ onSelectTest }) {
  const renderLevel = ({ item }) => (
    <View style={styles.levelBlock}>
      <View style={styles.levelHeader}>
        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{item.level}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.levelDesc}>{item.desc}</Text>
          <Text style={styles.levelTime}>{item.time}</Text>
        </View>
      </View>
      <View style={styles.testRow}>
        {item.tests.map((num) => (
          <TouchableOpacity
            key={num}
            style={styles.testBtn}
            onPress={() => onSelectTest(item.level, num)}
            activeOpacity={0.8}
          >
            <Text style={styles.testBtnText}>Test {num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <FlatList
      data={LEVELS}
      renderItem={renderLevel}
      keyExtractor={(item) => item.level}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  levelBlock: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e5e7eb",
  },
  levelHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 12 },
  levelBadge: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  levelBadgeText: { color: "#fff", fontWeight: "800", fontSize: 16 },
  levelDesc: { fontSize: 15, fontWeight: "600", color: "#1f2937" },
  levelTime: { fontSize: 13, color: "#6b7280", marginTop: 2 },
  testRow: { flexDirection: "row", gap: 10 },
  testBtn: {
    flex: 1,
    backgroundColor: "#eff6ff",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  testBtnText: { color: "#2563eb", fontWeight: "700", fontSize: 14 },
});
