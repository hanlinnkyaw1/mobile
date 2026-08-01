// src/features/jlpt-practice/components/TestSelection.js
import React, { useMemo } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { getAvailableTests } from "../api/testDataLoader";

const LEVEL_META = {
  N1: { desc: "Advanced", time: "~110 min" },
  N2: { desc: "Upper-Int", time: "~105 min" },
  N3: { desc: "Intermediate", time: "~100 min" },
  N4: { desc: "Elementary", time: "~75 min" },
  N5: { desc: "Beginner", time: "~60 min" },
};

export default function TestSelection({ onSelectTest }) {
  const levels = useMemo(() => {
    const available = getAvailableTests();
    const map = {};
    available.forEach(({ level, testNum }) => {
      if (!map[level]) map[level] = [];
      map[level].push(testNum);
    });
    return Object.entries(map)
      .map(([level, tests]) => ({
        level,
        tests: tests.sort((a, b) => a - b),
        desc: LEVEL_META[level]?.desc || "",
        time: LEVEL_META[level]?.time || "",
      }))
      .sort((a, b) => {
        const aNum = parseInt(a.level.replace("N", ""), 10);
        const bNum = parseInt(b.level.replace("N", ""), 10);
        return aNum - bNum;
      });
  }, []);

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

  if (levels.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No practice tests available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={levels}
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
  emptyContainer: { flex: 1, alignItems: "center", justifyContent: "center", padding: 32 },
  emptyText: { fontSize: 16, color: "#6b7280", textAlign: "center" },
});
